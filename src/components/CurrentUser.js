/** @jsx jsx */
import { jsx, IconButton, Container, Text, Flex, Avatar } from 'theme-ui'
import { IoIosContact } from "react-icons/io";
import { useWallet } from '~/config/wallet';

export default function CurrentUser() {
  const [fcl, currentUser] = useWallet();
  const handleClick = () => {
    if (!currentUser?.loggedIn) {
      fcl.authenticate();
      return;
    }
    const willLogout = window.confirm('Log out?');
    if (willLogout) fcl.unauthenticate();
  };

  return (
    <Container>
      <Flex
        sx={{
          justifyContent: 'flex-end',
        }}
      >
        <Flex
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleClick}
        >
          <Text pr="2">{currentUser?.identity?.name || 'Log In'}</Text>
          {currentUser?.identity?.avatar && (
            <Avatar
              sx={{ size: 60 }}
              src={currentUser?.identity?.avatar}
            />
          )}
          {!currentUser?.identity?.avatar && (
            <IconButton
              sx={{ size: 60 }}
            >
              <IoIosContact size="100%" />
            </IconButton>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
