// createCertificateMinter.cdc
// This txn must be executed by the admin when the Org/CA signs up with us.

import Vedas from 0x01cf0e2f2f715450

transaction {

    prepare(account: AuthAccount){

        // the Org has already created an account permissionlessly and handed over their account address to us
        // use contract to create a minter 



    }

    execute{

        let receiverAccount = getAccount(#acc2)

        

    }


}
 