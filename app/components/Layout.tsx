import Head from 'next/head';
import { Footer } from '@button-inc/bcgov-theme';
import { FooterLinks, Navigation } from '.';
import GlobalTheme from '../styles/GlobalTheme';

import styled from 'styled-components';

const StyledFooter = styled(Footer)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const StyledMain = styled('main')`
  margin: 0 auto 50px;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  padding: 2em 1.5em;

  @media (min-width: 768px) {
    padding: 40px 3.5em;
  }
`;

const StyledDiv = styled('div')`
  width: 100%;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  margin: auto;
`;

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[] | string | string[];
  session: any;
};

const Layout: React.FC<Props> = ({ children, session, title }) => {
  const isLoggedIn = session?.sub;
  return (
    <GlobalTheme>
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
      <Navigation isLoggedIn={isLoggedIn} />
      <StyledMain>{children}</StyledMain>
      <StyledFooter>
        <StyledDiv>
          <FooterLinks />
        </StyledDiv>
      </StyledFooter>
    </GlobalTheme>
  );
};

export default Layout;
