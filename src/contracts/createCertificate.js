import * as fcl from '@onflow/fcl';

export default function createCertificate(props = {}) {
  const {
    title,
    description,
    img,
    recipient,
  } = props;

  // TODO: Check if creator has vault, if not create then create it
  // If a recipient exists, transfer to recipient
  return fcl.script(`
    transaction {
      prepare(account: AuthAccount){
        account.save<@Vedas.CertificateVault>(<- Vedas.createEmptyCertificateVault(), to: /storage/CertificateVault)
        account.link<&Vedas.CertificateVault>(/public/CertificateVault, target: /storage/CertificateVault)
      }
    }
  `);
};
