/** @jsx jsx */
import { jsx, Container } from 'theme-ui';
import CertificateLI from '~/components/CertificateLI';
import certificates from '~/config/tmpCerts';

export default function UserCertifications({ addr } = {}) {
  console.log(addr);

  return (
    <Container>
      {certificates.map((certificate) => (
        <CertificateLI key={certificate.id} certificate={certificate} />
      ))}
    </Container>
  );
}
