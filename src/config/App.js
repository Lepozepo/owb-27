import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from './theme';

import Hello from '~/components/Hello';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Hello />
    </ThemeProvider>
  );
}
