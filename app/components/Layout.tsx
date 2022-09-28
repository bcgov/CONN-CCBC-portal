import Head from 'next/head';
import { Footer } from '@button-inc/bcgov-theme';
import { FooterLinks, Navigation, TimeTravel } from '.';
import getConfig from 'next/config';

import styled from 'styled-components';

const runtimeConfig = getConfig()?.publicRuntimeConfig ?? {};

const StyledFooter = styled(Footer)`
  width: 100%;
`;

const StyledLayout = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
`;

const StyledMain = styled('main')`
  margin: auto 50px;
  display: flex;
  width: 100%;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  flex: 1;
  padding: 2em;
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
  const enableTimeMachine = runtimeConfig.ENABLE_MOCK_TIME;
  const isLoggedIn = session?.sub;
  return (
    <StyledLayout>
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
      {enableTimeMachine && (
        <StyledDiv style={{ paddingLeft: '16px' }}>
          <TimeTravel />
        </StyledDiv>
      )}
      <StyledFooter>
        <StyledDiv>
          <FooterLinks />
        </StyledDiv>
      </StyledFooter>
    </StyledLayout>
  );
};

export default Layout;
