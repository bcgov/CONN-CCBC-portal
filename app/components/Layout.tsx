import Head from 'next/head';
import { Footer } from '@button-inc/bcgov-theme';
import { FooterLinks, Navigation } from '.';

import styled from 'styled-components';

const StyledFooter = styled(Footer)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const StyledMain = styled.main`
  margin: 0 auto 50px;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  padding: 5em 3.5em;
`;

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[] | string | string[];
};

const Layout: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <title>{title}</title>
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
      <Navigation />
      <StyledMain>{children}</StyledMain>
      <StyledFooter>
        <FooterLinks />
      </StyledFooter>
    </>
  );
};

export default Layout;
