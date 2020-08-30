const chain = require('./src/utils/blockchain');

const serviceAddr = 'f8d6e0586b0a20c7';

const config = {
  httpUri: 'http://localhost:8080',
  serviceWallet: {
    address: 'f8d6e0586b0a20c7',
    keys: [
      {
        publicKey: '80478d6c870c52f33a41d047864bf2d582d77849ca95f7cdf3fa14e3517a21193f73e6c9a004aea72c444cf4fd049a71a0bf67cc3e1170368434383c98b1ea48',
        privateKey: '398ffa83e34ac67bf61fa8ab907eb05393f49404de953a20da525db1aa355c6f',
        keyId: 0,
        weight: 1000
      }
    ]
  }
};

async function stage() {
  await chain.deployContract(
    config,
    serviceAddr,
    `pub contract DappState {
      // Declare the NFT resource type
      pub resource NFT {
        // The unique ID that differentiates each NFT
        pub let id: UInt64

        // Initialize both fields in the init function
        init(initID: UInt64) {
          self.id = initID
        }
      }

      // We define this interface purely as a way to allow users
      // to create public, restricted references to their NFT Collection.
      // They would use this to only expose the deposit, getIDs,
      // and idExists fields in their Collection
      pub resource interface NFTReceiver {
        pub fun deposit(token: @NFT) 
        pub fun getIDs(): [UInt64]
        pub fun idExists(id: UInt64): Bool
      }

      // The definition of the Collection resource that
      // holds the NFTs that a user owns
      pub resource Collection: NFTReceiver {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an UInt64 ID field
        pub var ownedNFTs: @{UInt64: NFT}

        // Initialize the NFTs field to an empty collection
        init () {
          self.ownedNFTs <- {}
        }

        // withdraw 
        //
        // Function that removes an NFT from the collection 
        // and moves it to the calling context
        pub fun withdraw(withdrawID: UInt64): @NFT {
          // If the NFT isn't found, the transaction panics and reverts
          let token <- self.ownedNFTs.remove(key: withdrawID)!

          return <-token
        }

        // deposit 
        //
        // Function that takes a NFT as an argument and 
        // adds it to the collections dictionary
        pub fun deposit(token: @NFT) {
          // add the new token to the dictionary which removes the old one
          let oldToken <- self.ownedNFTs[token.id] <- token
          destroy oldToken
        }

        // idExists checks to see if a NFT 
        // with the given ID exists in the collection
        pub fun idExists(id: UInt64): Bool {
          return self.ownedNFTs[id] != nil
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
          return self.ownedNFTs.keys
        }

        destroy() {
          destroy self.ownedNFTs
        }
      }

      // creates a new empty Collection resource and returns it 
      pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
      }

      // NFTMinter
      //
      // Resource that would be owned by an admin or by a smart contract 
      // that allows them to mint new NFTs when needed
      pub resource NFTMinter {
        // the ID that is used to mint NFTs
        // it is onlt incremented so that NFT ids remain
        // unique. It also keeps track of the total number of NFTs
        // in existence
        pub var idCount: UInt64

        init() {
          self.idCount = 1
        }

        // mintNFT 
        //
        // Function that mints a new NFT with a new ID
        // and deposits it in the recipients collection 
        // using their collection reference
        pub fun mintNFT(recipient: &AnyResource{NFTReceiver}) {
          // create a new NFT
          var newNFT <- create NFT(initID: self.idCount)
          
          // deposit it in the recipient's account using their reference
          recipient.deposit(token: <-newNFT)

          // change the id so that each ID is unique
          self.idCount = self.idCount + UInt64(1)
        }
      }


      init() {
        // store an empty NFT Collection in account storage
        self.account.save(<-self.createEmptyCollection(), to: /storage/NFTCollection)

        // publish a reference to the Collection in storage
        self.account.link<&{NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)

        // store a minter resource in account storage
        self.account.save(<-create NFTMinter(), to: /storage/NFTMinter)
      }
    }
  `);
}

stage().then(console.log).catch(console.log);
