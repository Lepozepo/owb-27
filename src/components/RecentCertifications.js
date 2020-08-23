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
      ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/6173a5ff-effa-7141-820f-e16693eb878b.svg' }],
    },
    {
      id: 2,
      title: 'Certificate of Achievement',
      description: 'For participating and completing on-flow course',
      img: 'https://images-na.ssl-images-amazon.com/images/I/81W5nfYYxoL._AC_SY355_.jpg',
      grantedAt: format(new Date(2014, 2, 11), 'MM/dd/yyyy'),
      grantedBy: ['walletId2', 'walletId3'],
      ownedBy: [{ id: 'walletId1', avatar: 'https://avatars.onflow.org/avatar/afe737d9-4c07-fd89-24a9-3f26bf30c530.svg' }],
    },
  ];

  return (
    <Container>
      {certificates.map((certificate) => (
        <CertificateLI key={certificate.id} certificate={certificate} />
      ))}
    </Container>
  );
}
