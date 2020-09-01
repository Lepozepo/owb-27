/** @jsx jsx */
import { jsx, Container } from 'theme-ui';
import CertificateLI from '~/components/CertificateLI';
import certificates from '~/config/tmpCerts';

export default function UserCertifications({ addr } = {}) {
  return (
    <Container>
      {certificates.slice(0, 1).map((certificate) => (
        <CertificateLI key={certificate.id} certificate={certificate} />
      ))}
    </Container>
  );
}
