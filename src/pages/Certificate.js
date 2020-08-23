/** @jsx jsx */
import { jsx, Flex, Box, Text, Heading, Image } from 'theme-ui';
import { useParams } from 'react-router-dom';
import Layout from '~/components/Layout';
import EventTimeline from '~/components/EventTimeline';
import certificates from '~/config/tmpCerts';

export default function Certificate() {
  const { certificateId } = useParams();
  const certificate = certificates.find((c) => c.id === certificateId);
  return (
    <Layout>
      <Flex
        sx={{
          my: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={certificate.img}
        />
      </Flex>

      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Heading>{certificate.title}</Heading>
        <Text>{certificate.description}</Text>
      </Box>

      <EventTimeline certificateId={certificateId} />
    </Layout>
  );
}
