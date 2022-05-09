import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import BCGovTypography from '../components/BCGovTypography';

import { Navigation, Footer } from '@button-inc/bcgov-theme';
import FooterLinks from '../components/FooterLinks';
import NavbarLinks from '../components/NavBarLinks';
import styled from 'styled-components';
import App from 'next/app';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const StyledFooter = styled(Footer)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <title>Connecting Communities BC</title>
        <link
          rel="apple-touch-icon"
          href="/icons/bcid-apple-touch-icon.png"
          sizes="180x180"
        />
        <link
          rel="icon"
          href="/icons/bcid-favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="/icons/bcid-favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link rel="mask-icon" href="/icons/bcid-apple-icon.svg" color="#036" />
        <link rel="icon" href="/icons/bcid-favicon-32x32.png" />
      </Head>
      <Navigation header="main" title="Connected Communities BC">
        <NavbarLinks />
      </Navigation>
      <GlobalStyle />
      <BCGovTypography />
      <Component {...pageProps} />
      <StyledFooter>
        <FooterLinks />
      </StyledFooter>
    </>
  );
}

MyApp.getInitialProps = async (context: any) => {
  const props = await App.getInitialProps(context);
  return { ...props };
};
