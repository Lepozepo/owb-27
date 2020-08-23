/** @jsx jsx */
import { jsx, Text, Flex, Box, Image } from 'theme-ui';

export default function CertificateLI({ certificate } = {}) {
  if (!certificate) return null;

  return (
    <Flex
      sx={{
        my: 2,
      }}
      key={certificate.id}
    >
      <Image
        sx={{
          width: 150,
          mr: 2,
        }}
        src={certificate.img}
      />
      <Box>
        <Text pr="2">{certificate.title}</Text>
        <Text pr="2">{certificate.description}</Text>
        <Text pr="2">{certificate.grantedAt}</Text>
      </Box>
    </Flex>
  );
}
