import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { ThemeProvider } from '@mui/material';
import theme from 'styles/muiTheme';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { Settings } from 'luxon';
import * as Sentry from '@sentry/nextjs';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import Error500 from 'pages/500';
import { getClientEnvironment } from 'lib/relay/client';
import GlobalStyle from 'styles/GobalStyles';
import GlobalTheme from 'styles/GlobalTheme';
import BCGovTypography from 'components/BCGovTypography';
import { SessionExpiryHandler } from 'components';
import { AppProvider } from 'components/AppProvider';

config.autoAddCss = false;

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

const growthbook = new GrowthBook();

const { publicRuntimeConfig } = getConfig();
// Using convict to declare it but using nextjs public env due to convict fs import
const growthbookUrl = `https://cdn.growthbook.io/api/features/${publicRuntimeConfig.NEXT_PUBLIC_GROWTHBOOK_API_KEY}`;
try {
  await fetch(growthbookUrl)
    .then((res) => res.json())
    .then((res) => {
      growthbook.setFeatures(res.features);
    });
} catch (err) {
  Sentry.captureException(err);
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;
  const router = useRouter();
  Settings.defaultZone = 'America/Vancouver';
  Settings.defaultLocale = 'en-CA';

  newTracker('ccbcTracker', 'spt.apps.gov.bc.ca', {
    appId: 'Snowplow_standalone_NWBC',
  });

  trackPageView();

  const [appMounted, setAppMounted] = useState(false);

  useEffect(() => {
    // nextjs.org/docs/messages/react-hydration-error
    setAppMounted(true);
  }, []);

  useEffect(() => {
    const fetchGrowthbook = async () => {
      try {
        const data = await fetch(growthbookUrl)
          .then((res) => res.json())
          .then((res) => {
            growthbook.setFeatures(res.features);
          });
        return data;
      } catch (err) {
        Sentry.captureException(err);
      }
      return null;
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
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <BCGovTypography />
          <Sentry.ErrorBoundary fallback={<Error500 />}>
            <RelayEnvironmentProvider environment={env}>
              <AppProvider>
                {typeof window !== 'undefined' && <SessionExpiryHandler />}
                {component}
              </AppProvider>
            </RelayEnvironmentProvider>
          </Sentry.ErrorBoundary>
        </ThemeProvider>
      </GlobalTheme>
    </GrowthBookProvider>
  );
};

export default MyApp;
