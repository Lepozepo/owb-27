/** @jsx jsx */
import { jsx, Box, Label, Input, Textarea, Button } from 'theme-ui';
import Layout from '~/components/Layout';
import HeroText from '~/components/HeroText';

export default function CreateCertificate() {
  return (
    <Layout>
      <HeroText>Create Certificate</HeroText>
      <Box
        as='form'
        onSubmit={(e) => e.preventDefault()}
      >
        <Label htmlFor='title'>Title</Label>
        <Input
          name='title'
          id='title'
          mb={3}
        />
        <Label htmlFor='description'>Description</Label>
        <Textarea
          name='description'
          id='description'
          rows='6'
          mb={3}
        />
        <Label htmlFor='img'>SVG Image</Label>
        <Textarea
          name='img'
          id='img'
          rows='6'
          mb={3}
        />
        <Label htmlFor='recipient'>Recipient Address</Label>
        <Input
          name='recipient'
          id='recipient'
          mb={3}
        />
        <Button>
          Submit
        </Button>
      </Box>
    </Layout>
  );
}
