import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../lib/relay/client';
import type { AppProps } from 'next/app';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import GlobalStyle from '../styles/GobalStyles';
import GlobalTheme from '../styles/GlobalTheme';
import BCGovTypography from '../components/BCGovTypography';

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

const growthbook = new GrowthBook();

const { publicRuntimeConfig } = getConfig();
// Using convict to declare it but using nextjs public env due to convict fs import
const growthbookUrl = `https://cdn.growthbook.io/api/features/${publicRuntimeConfig.NEXT_PUBLIC_GROWTHBOOK_API_KEY}`;

await fetch(growthbookUrl)
  .then((res) => res.json())
  .then((res) => {
    growthbook.setFeatures(res.features);
  });

function MyApp({ Component, pageProps }: AppProps) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;
  const router = useRouter();

  const [appMounted, setAppMounted] = useState(false);

  useEffect(() => {
    // nextjs.org/docs/messages/react-hydration-error
    setAppMounted(true);
  }, []);

  useEffect(() => {
    const fetchGrowthbook = async () => {
      const data = await fetch(growthbookUrl)
        .then((res) => res.json())
        .then((res) => {
          growthbook.setFeatures(res.features);
        });
      return data;
    };
    fetchGrowthbook();
  }, [router.asPath]);

  const component = appMounted ? (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...pageProps} {...relayProps} />
    </Suspense>
  ) : (
    <Component {...pageProps} {...relayProps} />
  );

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <GlobalTheme>
        <GlobalStyle />
        <BCGovTypography />
        <RelayEnvironmentProvider environment={env}>
          {component}
        </RelayEnvironmentProvider>
      </GlobalTheme>
    </GrowthBookProvider>
  );
}

export default MyApp;
