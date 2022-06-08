import { Suspense } from 'react';
import getConfig from 'next/config';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../lib/relay/client';
import type { AppProps } from 'next/app';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import GlobalStyle from '../styles/GobalStyles';
import GlobalTheme from '../styles/GlobalTheme';
import BCGovTypography from '../components/BCGovTypography';
import App from 'next/app';

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

const growthbook = new GrowthBook();

const { publicRuntimeConfig } = getConfig();
// Using convict to declare it but using nextjs public env due to convict fs import
await fetch(
  `https://cdn.growthbook.io/api/features/${publicRuntimeConfig.NEXT_PUBLIC_GROWTHBOOK_API_KEY}`
)
  .then((res) => res.json())
  .then((res) => {
    growthbook.setFeatures(res.features);
  });

export default function MyApp({ Component, pageProps }: AppProps) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <GlobalTheme>
        <GlobalStyle />
        <BCGovTypography />
        <RelayEnvironmentProvider environment={env}>
          <Suspense fallback={<div>Loading...</div>}>
            <Component {...pageProps} {...relayProps} />
          </Suspense>
        </RelayEnvironmentProvider>
      </GlobalTheme>
    </GrowthBookProvider>
  );
}

MyApp.getInitialProps = async (context: any) => {
  const props = await App.getInitialProps(context);
  return { ...props };
};
