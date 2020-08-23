/** @jsx jsx */
import { jsx, Container } from 'theme-ui';
import { format } from 'date-fns';
import CertificateLI from '~/components/CertificateLI';

export default function RecentCertifications() {
  const certificates = [
    {
      id: 1,
      title: 'Certificate of Achievement',
      description: 'For participating and completing on-flow course',
      img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
      grantedAt: format(new Date(2014, 1, 11), 'MM/dd/yyyy'),
      grantedBy: ['walletId2', 'walletId3'],
      ownedBy: ['walletId1'],
    },
    {
      id: 2,
      title: 'Certificate of Achievement',
      description: 'For participating and completing on-flow course',
      img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
      grantedAt: format(new Date(2014, 2, 11), 'MM/dd/yyyy'),
      grantedBy: ['walletId2', 'walletId3'],
      ownedBy: ['walletId4'],
    },
  ];

  return (
    <Container>
      {certificates.map((certificate) => (
        <CertificateLI certificate={certificate} />
      ))}
    </Container>
  );
}
