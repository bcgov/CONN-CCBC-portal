import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import theme from 'styles/muiTheme';
import { RelayEnvironmentProvider } from 'react-relay';
import { useRelayNextjs } from 'relay-nextjs/app';
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { Settings } from 'luxon';
import * as Sentry from '@sentry/nextjs';
import type { AppProps } from 'next/app';
import type { EmotionCache } from '@emotion/react';
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
import createEmotionCache from 'utils/createEmotionCache';

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

config.autoAddCss = false;

const growthbook = new GrowthBook();

const { publicRuntimeConfig } = getConfig();
// Using convict to declare it but using nextjs public env due to convict fs import
const growthbookUrl = `https://cdn.growthbook.io/api/features/${publicRuntimeConfig.NEXT_PUBLIC_GROWTHBOOK_API_KEY}`;

// Initialize GrowthBook features on client-side only
if (typeof window !== 'undefined') {
  fetch(growthbookUrl)
    .then((res) => res.json())
    .then((res) => {
      growthbook.setFeatures(res.features);
    })
    .catch((err) => {
      Sentry.captureException(err);
    });
}

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) => {
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
    createClientEnvironment: () => getClientEnvironment()!,
  });
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

    // Force styled-components to rehydrate in React 19
    if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
      // This helps with styled-components hydration in React 19
      const styledComponentsStyleTags =
        document.querySelectorAll('[data-styled]');
      styledComponentsStyleTags.forEach((tag) => {
        if (tag.textContent) {
          // Force re-evaluation of styles to prevent hydration mismatch
          tag.setAttribute('data-styled-version', '6');
        }
      });
    }
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
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          Loading...
        </div>
      }
    >
      <Component {...pageProps} {...relayProps} />
    </Suspense>
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      Loading...
    </div>
  );

  return (
    <CacheProvider value={emotionCache}>
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
    </CacheProvider>
  );
};

export default MyApp;
