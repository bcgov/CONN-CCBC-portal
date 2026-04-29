import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

export { theme };

type Props = {
  children: React.ReactNode;
};

const GlobalTheme: React.FC<Props> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default GlobalTheme;
