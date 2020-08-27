

// Vedas.cdc

pub contract Vedas {

    // id has to be maintained in a central location because that is the co-ordination point
    // here the minter cannot be the central point of co-ordination to assign ids because there will be multiple minters
    pub var maxCertID: UInt64
    pub var maxMinterID: UInt64

    init(){
        self.maxCertID = UInt64(0)
        self.maxMinterID = UInt64(0)
    }

    // supplying batches of 1000 to the minters.
    pub fun getCertID(): UInt64 {
        var temp = self.maxCertID
        self.maxCertID = self.maxCertID + UInt64(1)
        return temp
    }

    pub fun getMinterID(): UInt64 {
        var temp = self.maxMinterID
        self.maxMinterID = self.maxMinterID + UInt64(1)
        return temp
    }

// dictionary limit
//100,000

/*  status has to be outside in the main contract.
{1234: inactive,
veve
fv
ve
ve
fvefv
}

// another dictionary
{
    0x439358: @JohnDoe   <------------- insert 
    0x9834u04: @JohnDoe1
}

//
@JohnDoe
john@mit.edu ---> adminemai@mit.edu 

admin logs onto app ---> NFT ---> @JohnDoe
*/
// permission to MIT admin -->  modify the NFT 
// permission to return it back to to MIT account - explore


// crystal box to the guy. pu the certs in there.
// if crystal breaks, cert will be sent back. Resource owning a resource.
// admin has right to break the box.
// user can also break the box.


    // define the certificate resource type
    // all type declarations must be public
    pub resource Certificate {

        // the certificate has to have a unique id across the platform.
        access(contract) let certID: UInt64

        // certificate has title
        access(self) let title: String

        // certificate has metadata
        access(self) var metadata: String

        // certificate has Issuer id's account ID
        access(self) let issuerID: UInt64

        // certificate status
        access(self) var status: String


        //Initialise all fields during the creation of the resource.
        init(certID: UInt64, title: String, metadata: String, issuerID: UInt64, status: String){
            self.certID = certID
            self.title = title
            self.metadata = metadata
            self.issuerID = issuerID
            self.status = status
        }

        
    }


    // define the Certificate receiver interface
    // this helps create receiver links, so only intended receivers aka "subscribers" can receive the certificates sent by the minter authority
    pub resource interface CertificateReceiver {

        pub fun deposit(cert: @Certificate)

    }
    

    // Need a certificate vault, just like in the examples
    // Our company(admin account) creates the CertificateVaults in each user account when they signup for it.
    pub resource CertificateVault: CertificateReceiver {

        // this vault should contain a collection of certificates
        // we store a mapping of certID and the certificate resource itself
        access(self) var ownedCertificates: @{UInt64: Certificate}

        init() {
            self.ownedCertificates <- {}
        }

        pub fun deposit(cert: @Certificate) {
            let oldCert <- self.ownedCertificates[cert.certID] <- cert
            destroy oldCert
        }

        // need to define destroy function becasue there are nested resources.
        destroy(){
            destroy self.ownedCertificates 
        }

    }

    pub fun createEmptyCertificateVault(): @CertificateVault {
        return <- create CertificateVault()
    }

    // MinterReceiver interface
    // This existes so that only the MinterReceiver can receive the Minters
    // Also exposes only the interface functions publicly
    pub resource interface MinterReceiver{

        pub fun deposit(token: @CertificateMinter)

    }

    // all type declarations must be public
    pub resource MinterVault: MinterReceiver {

        access(self) var certMinter : @CertificateMinter?
        
        init(){
            self.certMinter <- nil
        }

        destroy(){
            destroy self.certMinter
        }
        
        pub fun deposit(token: @CertificateMinter){
            // need unwrap operation here
            var oldCertMinter <- self.certMinter <- token
            destroy oldCertMinter
        }

    }

    pub fun createEmptyMinterVault(): @MinterVault {
            return  <- create MinterVault()
    }




    // Orgs should be able to get a minter and mint certs.
    // Our company(admin account) creates  the minters to official accounts (Certificate Authorities) when they create their accounts
    pub resource CertificateMinter {

        pub let minterID: UInt64

        init(){
            self.minterID = Vedas.getMinterID()
        }

       

        // fun used in txns by the Certificate Authority to issueCert to user.
        // How to make the mapping from @User to recipient Vault reference 
        pub fun issueCert(recipient: &AnyResource{CertificateReceiver}, title: String, metadata: String, issuerID: UInt64, status: String ){
            recipient.deposit(cert:  <-create Certificate(certID: Vedas.getCertID(), title: title, metadata: metadata, issuerID: issuerID, status: status))
            
        }

        // fun used in txns by the Certificate Authority to change status to  
        pub fun revokeCert(recipient: &AnyResource{CertificateReceiver}, title: String, metadata: String, issuerID: UInt64, status: String ) {

        }


    }

    


}






 