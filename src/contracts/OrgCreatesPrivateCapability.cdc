// OrgCreatesPrivateCapability.cdc
// This txn must be executed by the Org to create a private capability for transactions to come in and create a certificate using the Org's minter on demand.

import Vedas from 0x01cf0e2f2f715450

transaction {

    // the Org already has a CertificateMinter in its MinterVault
    // We need to expose a private capability so that the org can 

    prepare(account: AuthAccount) {
        
        // create a private link to that , so that Org can use it in txns
        account.link<&Vedas.MinterVault>(/private/MinterVault, target: /storage/MinterVault )
    }

    
}