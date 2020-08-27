// createOrgAccount.cdc
// This script should be executed by the Org after the org has a Flow account

import Vedas from 0x01cf0e2f2f715450

transaction {

    prepare(account: AuthAccount){

        // create an empty MinterVault and store it in storage
        account.save<@Vedas.MinterVault>( <- Vedas.createEmptyMinterVault(), to: /storage/MinterVault)

        log("Empty vault created")

        // create the public capability to provide a referance to anyone trying to send the MinterVault
        account.link<&Vedas.MinterVault>(/public/MinterVault, target: /storage/MinterVault)

        log("Capability created")
    }

}
