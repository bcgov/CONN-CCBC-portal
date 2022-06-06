import { Suspense } from 'react';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../lib/relay/client';
import type { AppProps } from 'next/app';

import GlobalStyle from '../styles/GobalStyles';
import GlobalTheme from '../styles/GlobalTheme';
import BCGovTypography from '../components/BCGovTypography';
import App from 'next/app';

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;

  return (
    <GlobalTheme>
      <GlobalStyle />
      <BCGovTypography />
      <RelayEnvironmentProvider environment={env}>
        <Suspense fallback={<div>Loading...</div>}>
          <Component {...pageProps} {...relayProps} />
        </Suspense>
      </RelayEnvironmentProvider>
    </GlobalTheme>
  );
}

MyApp.getInitialProps = async (context: any) => {
  const props = await App.getInitialProps(context);
  return { ...props };
};
