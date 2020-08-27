/** @jsx jsx */
import { jsx, Flex, Box, Heading } from 'theme-ui';
import Layout from '~/components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 76px)',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Heading as="h1">404!</Heading>
          <Heading as="h3">Not Found</Heading>
        </Box>
      </Flex>
    </Layout>
  );
}
