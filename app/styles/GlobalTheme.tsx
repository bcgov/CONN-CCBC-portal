import { ThemeProvider } from 'styled-components';

// Here we can set a global theme or variables to reference in child components
const theme = {
  width: {
    form: '1020px',
    inputWidthSmall: '50%',
    inputWidthMid: '75%',
    inputWidthFull: '100%',
    pageMaxWidth: '1280px',
  },
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const GlobalTheme: React.FC<Props> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default GlobalTheme;
