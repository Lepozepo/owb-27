const SHA3 = require('sha3').SHA3;
const EC = require('elliptic').ec;
const ec = new EC('p256')
const rlp = require('rlp');
const fcl = require('@onflow/fcl');
const t = require('@onflow/types');

class Flow {

  static get Roles() {
    return {
      'PROPOSER': 'proposer',
      'AUTHORIZER': 'authorizer',
      'AUTHORIZERS': 'authorizers',
      'PAYER': 'payer',
      'ALL': 'all',
    }
  }

  /**
    config {
    httpUri: "...",
     serviceWallet: {
      "address": "...",
      "keys": [
        {
        "publicKey": "...",
        "privateKey": "...",
        "keyId": 0,
        "weight": 1000
        }  
      ]
     }
   } 
   */
  constructor(config) {
    this.serviceUri = config.httpUri;
    this.serviceWallet = config.serviceWallet;
  }

  /* API */
  /**
    keyInfo { 
      entropy: byte array, 
      weight: 1 ... 1000 
    }
  */
  async createAccount(keyInfo) {
    /*
       
    */

    let publicKeys = [];
    keyInfo.forEach((key) => {
      publicKeys.push({
        ...key,
        ...Flow._genKeyPair(key.entropy, key.weight)
      });
    });

    // Transaction code
    let tx =  fcl.transaction`
      transaction {
        prepare(signer: AuthAccount) {
          let acct = AuthAccount(payer: signer)
          let publicKeys =  ["${p => p.publicKeys.join('","')}"]
          for key in publicKeys {
            acct.addPublicKey(key.decodeHex())
          }
        }
      }`;

    // Transaction options
    // roleInfo can either be:
    // { [Flow.Roles.ALL]: xxxxxx }  
    // - OR - 
    // { [Flow.Roles.PROPOSER]: xxxxxx,  [Flow.Roles.AUTHORIZATIONS]: [ xxxxxx ],  [Flow.Roles.PAYER]: xxxxxx,}
    let options = {
      roleInfo: { [Flow.Roles.ALL]: this.serviceWallet.address },
      params: [{ name: 'publicKeys', type: t.Array(t.String), value: publicKeys.map(o => o.encodedPublicKey) }],
      gasLimit: 50
    }

    // Use fcl to compose and submit the transaction
    let response = await this.executeTransaction(tx, options);
    // Get the new account info and pass it back
    const { events } = await fcl.tx(response).onceSealed();
    const accountCreatedEvent = events.find(d => d.type === "flow.AccountCreated")

    let addr = accountCreatedEvent.data.address.replace(/^0x/, '');
    const account = await this.getAccount(addr); 

    let newAccount = {
      address: account.address,
      keys: []
    };

    publicKeys.map((k) => {
      let key = account.keys.find(d => d.publicKey === k.publicKey);
      newAccount.keys.push({
        publicKey: k.publicKey,
        privateKey: k.privateKey,
        keyId: key.index,
        weight: k.weight    
      });
    });

    return newAccount;
  }



  async deployContract(address, key, contract) {
    // Transaction code
    let tx = fcl.transaction`
      transaction {
        prepare(acct: AuthAccount) {
          acct.setCode("${p => p.code}".decodeHex())
        }
      }`;

    // Transaction options
    let options = {
      roleInfo: { [Flow.Roles.ALL]: address },
      //roleInfo: { [Flow.Roles.ALL]: address},
      params: [{ name: 'code', type: t.Identity, value: Buffer.from(contract, "utf8").toString("hex") }],
      gasLimit: 50,
      key,
    }

    let response = await this.executeTransaction(tx, options);

    const { events } = await fcl.tx(response).onceSealed();
    const accountCreatedEvent = events.find(d => d.type === "flow.AccountCodeUpdated")
    if (accountCreatedEvent && accountCreatedEvent.data) {
      let contracts = accountCreatedEvent.data.contracts;
      return contracts;
    } else {
      console.log('Contract not deployed', contract);
      return [];
    }
  }

  /* INTERACTIONS */

  async getAccount(address) {
    let accountInfo = await fcl.send([fcl.getAccount(address)], { node: this.serviceUri });
    if (accountInfo.account.address !== address) {
      throw new Error(`Account 0x${address} does not exist`);
    }                
    return accountInfo.account;
  }

  async executeTransaction(tx, options) {
    return await this._processTransaction(tx, options);
  }

  static async decode(data) {
    return await fcl.decode(data);
  }

  static async handleEvent(env, eventType, callback) {

    // const blockResponse = await sdk.send(await sdk.build([
    //     sdk.getLatestBlock()
    //   ]), { node: env.config.httpUri });

    // const response = await sdk.send(await sdk.build([
    // sdk.getEvents(eventType, blockResponse.latestBlock.parentId, blockResponse.latestBlock.id),
    // ]), { node: env.config.httpUri });

    // callback(response);
  }

  /* HELPERS */

  static _genKeyPair(entropy, weight) {
    const keys = ec.genKeyPair({
      entropy
    })
    const privateKey = keys.getPrivate("hex")
    const publicKey = keys.getPublic("hex").replace(/^04/, "")
    return {
      publicKey,
      privateKey,
      // Require rlp encoded value of publicKey that encodes the key itself, 
      // what curve it uses, how the signed values are hashed and the keys weight.
      encodedPublicKey: rlp.encode([
        Buffer.from(publicKey, "hex"), // publicKey hex to binary
        2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
        3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
        weight
      ]).toString("hex")
    }
  }


  /*
    roleInfo 
    {
      [PROPOSER]: address,
      [AUTHORIZERS]: [ address ],
      [PAYER]: address
    }
  */
  async _processTransaction(tx, options) {
    options = options || {};

    let builders = [];

    // BUILD INTERACTION

    // Add the actual interaction code
    builders.push(tx);

    // If there are any params, add those here
    if (options.params && Array.isArray(options.params)) {
      let params = [];
      options.params.forEach((param) => {
        params.push(fcl.param(param.value, param.type, param.name));
      });
      builders.push(fcl.params(params));
    }

    if (options.gasLimit && options.gasLimit > 0) {
      builders.push(fcl.limit(options.gasLimit));
    }
    // If the transaction is going to change state, it will require roleInfo to be populated
    if (options.roleInfo ) {

      let signer = new Signer(this.serviceWallet);
      let roles = options.roleInfo;

      // The Proposer authorization is the only one that requires a sequenceNumber
      // This block does double-duty...for Proposer and the scenario in which
      // Proposer, Authorizer, Payer are all the same i.e. Flow.Roles.ALL
      if (roles[Flow.Roles.PROPOSER] || roles[Flow.Roles.ALL]) {
        let address = roles[Flow.Roles.PROPOSER] || roles[Flow.Roles.ALL];
        let account = await this.getAccount(address);
        builders.push(fcl.proposer(await signer.authorize(account, options.key)));

        if (roles[Flow.Roles.ALL]) {
          builders.push(fcl.authorizations([await signer.authorize(account, options.key)]));
          builders.push(fcl.payer(await signer.authorize(account, options.key)));
        }
      }
      // A transaction can have multiple Authorizers. 
      // Loop through and create an authorization object for each one
      if (roles[Flow.Roles.AUTHORIZERS] && Array.isArray(roles[Flow.Roles.AUTHORIZERS])) {
        let authorizations = [];
        for(let a=0; a<roles[Flow.Roles.AUTHORIZERS].length; a++) {
          let address = roles[Flow.Roles.AUTHORIZERS][a];
          let account = await this.getAccount(address);
          let authorization = await signer.authorize(account, options.key);
          authorizations.push(authorization);                    
        }
         if (authorizations.length > 0) {
          builders.push(fcl.authorizations(authorizations));            
        }
      }

      // Finally, add the Payer authorization
      if (roles[Flow.Roles.PAYER]) {
        let address = roles[Flow.Roles.PAYER];
        let account = await this.getAccount(address);
        builders.push(fcl.payer(await signer.authorize(account, options.key)));
        
      }
    }
    // const response = await fcl.serialize(builders);
    // console.log(JSON.stringify(JSON.parse(response), null, 2))

    // SEND TRANSACTION TO BLOCKCHAIN
    return await fcl.send(builders, { node: this.serviceUri });
  }

}

class Signer {
  constructor(serviceWallet) {
    this.serviceWallet = serviceWallet;
  }

  async _getAuthorizingKey(address) {
    let dappConfig;
    try {
      //delete require.cache[require.resolve('../dapp-config.json')];
      dappConfig = require('../dapp-config.json');
    } catch(e) {
      dappConfig = {
        wallets: [ this.serviceWallet ]               
      }
    }

    let selectedKey = 0; // TODO: This could be different

    let wallet = dappConfig.wallets.find(o => o.address === address);
    let key = wallet.keys.find(k => k.keyId === selectedKey);

    return {
      privateKey: key.privateKey,
      keyId: key.keyId
    }
  }

  async authorize(accountInfo, key) {
    const { privateKey, keyId } = key || this.serviceWallet.keys[0];

    return (account = {}) => {

      // This function is passed as a param for each authorization requested
      // Use currying to ensure that "account" is correctly hydrated for each
      // authorization for which signingFunction is called
      const __signingFunction = data => {
        console.log(`Signing for account ${accountInfo.address}`)
        return {
          addr: accountInfo.address,
          keyId: keyId,
          signature: Signer.signMessage(privateKey, data.message)
        }
      }

      let retVal = {
        ...account,
        addr: accountInfo.address,
        keyId,
        sequenceNum: accountInfo.keys[keyId].sequenceNumber,
        signature: account.signature || null,
        signingFunction: __signingFunction
      }

      return retVal;
    }
  }

  static signMessage(privateKey, message) {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    const digest = sha.digest();
    const sig = key.sign(digest);
    const n = 32; // half of signature length?
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex") 
  }
}

module.exports = {
  Flow: Flow,
  Signer: Signer
}