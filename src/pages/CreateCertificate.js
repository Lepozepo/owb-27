/** @jsx jsx */
import { jsx, Box, Label, Input, Textarea, Button } from 'theme-ui';
import { Redirect, useHistory } from 'react-router-dom';
import { useRef } from 'react';
import Layout from '~/components/Layout';
import HeroText from '~/components/HeroText';
import createCertificate from '~/contracts/createCertificate'; 
import { useWallet } from '~/config/wallet';

export default function CreateCertificate() {
  const [fcl, currentUser] = useWallet();
  const history = useHistory();
  const title = useRef();
  const description = useRef();
  const img = useRef();
  const recipient = useRef();

  // if (!currentUser?.loggedIn) {
  //   return <Redirect to="/" />;
  // }

  return (
    <Layout>
      <HeroText>Create Certificate</HeroText>
      <Box
        as='form'
        onSubmit={async (e) => {
          // TODO: Error handling
          e.preventDefault();
          const certificate = await fcl.send([
            createCertificate({
              title: title.current.value,
              description: description.current.value,
              img: img.current.value,
              recipient: recipient.current.value,
            }),
            fcl.proposer(currentUser.authorization),
            fcl.payer(currentUser.authorization),
          ]).then(fcl.decode);
          console.log(certificate);
          history.push(`/certificates/${certificate.id}`);
        }}
      >
        <Label htmlFor='title'>Title</Label>
        <Input
          ref={title}
          name='title'
          id='title'
          mb={3}
        />
        <Label htmlFor='description'>Description</Label>
        <Textarea
          ref={description}
          name='description'
          id='description'
          rows='6'
          mb={3}
        />
        <Label htmlFor='img'>SVG Image</Label>
        <Textarea
          ref={img}
          name='img'
          id='img'
          rows='6'
          mb={3}
        />
        <Label htmlFor='recipient'>Recipient Address</Label>
        <Input
          ref={recipient}
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
