import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import BCGovTypography from '../components/BCGovTypography';
import { Layout } from '../components';
import App from 'next/app';

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

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <BCGovTypography />
      <Layout title="Connecting Communities BC">
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

MyApp.getInitialProps = async (context: any) => {
  const props = await App.getInitialProps(context);
  return { ...props };
};
