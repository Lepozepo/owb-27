/** @jsx jsx */
import { jsx, Container } from 'theme-ui'
import CurrentUser from '~/components/CurrentUser';

export default function Layout(props) {
  return (
    <Container>
      <CurrentUser />
      {props?.children || null}
    </Container>
  );
}
