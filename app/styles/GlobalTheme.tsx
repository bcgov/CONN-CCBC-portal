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
  color: {
    // https://developer.gov.bc.ca/Design-System/Colour-Palette
    backgroundBlue: '#3F5986',
    backgroundGrey: '#F2F2F2',
    components: '#606060',
    error: '#D8292F',
    errorBackground: 'rgba(248, 214, 203, 0.4)',
    links: '#1A5A96',
    primaryBlue: '#113362',
    primaryYellow: '#FCBA19',
    success: '#2E8540',
    text: '#313132',
    descriptionGrey: 'rgba(49, 49, 50, 0.7)',
    stepperGrey: 'rgba(196, 196, 196, 0.16)',
    stepperHover: 'rgba(196, 196, 196, 0.06)',
    stepperBlue: '#e5eff9',
  },
  padding: {
    page: '20px',
  },
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const GlobalTheme: React.FC<Props> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default GlobalTheme;
