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
  .formFieldset {
    border: none;
  }
  // Respect line breaks in strings
  label {
    white-space: pre-line;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  input[type=number]{
      -moz-appearance: textfield;
  }
  button, input[type="submit"], input[type="reset"] {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }
`;

export default GlobalStyle;
