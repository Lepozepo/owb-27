import React from 'react';
import { Button, Container, Heading } from 'theme-ui'
import { useWallet } from '~/config/wallet';

export default function Login() {
  const [fcl, currentUser] = useWallet();
  console.log(currentUser);

  return (
    <Container>
      <Heading>Login</Heading>
      <Button onClick={() => fcl.authenticate()}>
        Log In
      </Button>
    </Container>
  );
}
