/** @jsx jsx */
import { jsx, Flex, Heading } from 'theme-ui';
import Layout from '~/components/Layout';

export default function Landing() {
  return (
    <Layout>
      <Flex
        sx={{
          height: '20vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Heading>Certified</Heading>
      </Flex>
    </Layout>
  );
}
