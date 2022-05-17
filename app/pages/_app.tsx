import { Suspense } from 'react';

import type { AppProps } from 'next/app';

import GlobalStyle from '../styles/GobalStyles';
import GlobalTheme from '../styles/GlobalTheme';
import BCGovTypography from '../components/BCGovTypography';
import { Layout } from '../components';
import App from 'next/app';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { relayEnvironment } from '../lib/relay';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <Suspense fallback={'Loading...'}>
        <GlobalTheme>
          <GlobalStyle />
          <BCGovTypography />
          <Layout title="Connecting Communities BC">
            <Component {...pageProps} />
          </Layout>
        </GlobalTheme>
      </Suspense>
    </RelayEnvironmentProvider>
  );
}

MyApp.getInitialProps = async (context: any) => {
  const props = await App.getInitialProps(context);
  return { ...props };
};
