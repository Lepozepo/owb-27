

// CertificateNFT.cdc

pub contract CertificateNFT {

    // id has to be maintained in a central location because that is the co-ordination point
    // here the minter cannot be the central point of co-ordination to assign ids because there will be multiple minters
    pub var maxPossibleCertID: UInt64

    init(){
        self.maxPossibleCertID = UInt64(0)
    }

    // supplying batches of 1000 to the minters.
    pub fun supplyBatch(): [UInt64] {
        var temp = self.maxPossibleCertID
        self.maxPossibleCertID = self.maxPossibleCertID + UInt64(1000)
        return [temp, UInt64(1000)]

    }

    

    // define the certificate resource type
    pub resource Certificate {

        // the certificate has to have a unique id across the platform.
        pub let certID: UInt64

        // certificate has title
        pub let title: String

        // certificate has metadata
        pub var metadata: String

        // certificate has Issuer id's account ID
        pub let issuerID: UInt64

        // certificate status
        pub var status: String


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
    pub resource interface CertificateReceiver{

        pub fun receive(cert: @Certificate)
    }
    

    // Need a certificate vault, just like in the examples
    // Our company(admin account) creates the CertificateVaults in each user account when they signup for it.
    pub resource CertificateVault: CertificateReceiver {

        // this vault should contain a collection of certificates
        // we store a mapping of certID and the certificate resource itself
        pub var ownedCertificates: @{UInt64: Certificate}

        init(){
            self.ownedCertificates <- {}
            // may have to create the storage here.
        }

        pub fun receive(cert: @Certificate){
            let oldCert <- self.ownedCertificates[cert.certID] <- cert
            destroy oldCert
        }

        // need ot define destroy function becasue there are nested resources.
        destroy(){
            destroy self.ownedCertificates 
        }

    }


    // Orgs should be able to get a minter and mint certs.
    // Our company(admin account) creates  the minters to official accounts (Certificate Authorities) when they create their accounts
    pub resource CertificateMinter {

        pub var mintingBatchLeft: UInt64
        pub var mintingStartCount: UInt64

        init(mintingBatchLeft: UInt64, mintingStartCount: UInt64){
            self.mintingBatchLeft = mintingBatchLeft
            self.mintingStartCount = mintingStartCount
        }

        // fun used in txns by the Certificate Authority to issueCert to user.
        // How to make the mapping from @User to recipient Vault reference 
        pub fun issueCert(recipient: &AnyResource{CertificateReceiver}, title: String, metadata: String, issuerID: UInt64, status: String ){
            recipient.receive(cert:  <-create Certificate(certID: self.mintingStartCount, title: title, metadata: metadata, issuerID: issuerID, status: status))
            self.mintingStartCount = self.mintingStartCount + UInt64(1)
            self.mintingBatchLeft = self.mintingBatchLeft - UInt64(1)
            if(self.mintingBatchLeft == UInt64(0)){
                self.getNextBatch();
            }
        }

        // fun used in txns by the Certificate Authority to change status to  
        pub fun revokeCert(recipient: &AnyResource{CertificateReceiver}, title: String, metadata: String, issuerID: UInt64, status: String ) {

        }

        pub fun getNextBatch(){
            var temp = CertificateNFT.supplyBatch()
            self.mintingStartCount = temp[0]
            self.mintingBatchLeft = temp[1]
        }

    }

    








}






