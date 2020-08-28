// issueCert.cdc 
// this txn has to be executed when the CA issues new cert using the minter


import Vedas from 0x01cf0e2f2f715450

transaction {

    let minterVaultRef: &Vedas.MinterVault

    let certMinterRef: &Vedas.CertificateMinter

    var certReceiverRef: &AnyResource{Vedas.CertificateReceiver}

    var certificate: @Vedas.Certificate

    prepare(account: AuthAccount){

        // the candidate has already created an account permissionlessly and handed over their account address to org
        // use org account to create a certificate
        // use the minter vault resource that only the org account has access to
        // get minterVaults's capability and get a reference to use it
        self.minterVaultRef = account.getCapability(/private/MinterVault)!.borrow<&Vedas.MinterVault>()?? panic("Could not borrow MinterVault reference")
        
        // from this minterVaultRef, I need to get the certMinterRef
        let certMinterRef = 

        // get the receivers's capability, get the reference to use it
        self.certReceiverRef = getAccount(0xf3fcd2c1a78f5eee).getCapability(/public/CertificateReceiver)!.borrow<&AnyResource{Vedas.CertificateReceiver}>()?? panic("Could not borrow CertificateReceiver reference")

        // transfer over the certificate to this txn
        self.certificateMinter  <- self.certMinterRef.createCertificateMinter()

    }

    execute{
        
        self.certReceiverRef.deposit(certificate: <- self.certificate )

    }


}
 