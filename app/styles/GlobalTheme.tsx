import React from 'react';
import { ThemeProvider } from 'styled-components';

// Here we can set a global theme or variables to reference in child components
export const theme = {
  width: {
    form: '1020px',
    inputWidthSmall: '50%',
    inputWidthMid: '75%',
    inputWidthFull: '100%',
    pageMaxWidth: '1280px',
  },
  color: {
    // https://developer.gov.bc.ca/Design-System/Colour-Palette
    white: '#ffffff',
    backgroundBlue: '#3F5986',
    backgroundGrey: '#F2F2F2',
    navigationLightGrey: '#F8F8F8',
    navigationBlue: '#38598A',
    components: '#606060',
    error: '#D8292F',
    errorBackground: 'rgba(248, 214, 203, 0.4)',
    warnBackground: 'rgb(227 168 43)',
    links: '#1A5A96',
    primaryBlue: '#113362',
    primaryYellow: '#FCBA19',
    success: '#2E8540',
    text: '#313132',
    descriptionGrey: 'rgba(49, 49, 50, 0.7)',
    borderGrey: '#c4c4c4',
    stepperGrey: 'rgba(196, 196, 196, 0.16)',
    stepperHover: 'rgba(196, 196, 196, 0.06)',
    stepperBlue: 'rgb(229, 239, 249)',
    disabledGrey: '#939393',
    placeholder: '#cccccc',
    backgroundMagenta: '#b200ff',
    darkGrey: '#676666',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '48px',
  },
  breakpoint: {
    smallUp: '@media (min-width: 600px)',
    mediumUp: '@media (min-width: 768px)',
    largeUp: '@media (min-width: 1007px)',
    extraLargeUp: '@media (min-width: 1280px)',
  },
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const GlobalTheme: React.FC<Props> = ({ children }) => {
  const StyledThemeProvider = ThemeProvider as any;
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

export default GlobalTheme;
