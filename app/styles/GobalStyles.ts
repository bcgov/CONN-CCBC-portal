import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  },
  a {
    color: inherit;
    text-decoration: none;
  },
  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
