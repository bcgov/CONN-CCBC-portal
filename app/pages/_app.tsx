import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { ThemeProvider } from '@mui/material';
import theme from 'styles/muiTheme';
import { RelayEnvironmentProvider } from 'react-relay';
import { useRelayNextjs } from 'relay-nextjs/app';
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { Settings } from 'luxon';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import Error500 from 'pages/500';
import { getClientEnvironment } from 'lib/relay/client';
import reportClientError from 'lib/helpers/reportClientError';
import GlobalStyle from 'styles/GobalStyles';
import GlobalTheme from 'styles/GlobalTheme';
import BCGovTypography from 'components/BCGovTypography';
import { SessionExpiryHandler } from 'components';
import { AppProvider } from 'components/AppProvider';

config.autoAddCss = false;

const growthbook = new GrowthBook();

const { publicRuntimeConfig } = getConfig();
const growthbookApiKey = publicRuntimeConfig.NEXT_PUBLIC_GROWTHBOOK_API_KEY;
// Using convict to declare it but using nextjs public env due to convict fs import
const growthbookUrl = growthbookApiKey
  ? `https://cdn.growthbook.io/api/features/${growthbookApiKey}`
  : null;

if (growthbookUrl) {
  try {
    await fetch(growthbookUrl)
      .then((res) => res.json())
      .then((res) => {
        growthbook.setFeatures(res.features);
      });
  } catch (err) {
    reportClientError(err, { source: 'growthbook-bootstrap' });
  }
} else {
  // Visible in server logs (e.g. Docker) and browser console; reportClientError is browser-only.
  console.warn(
    '[GrowthBook] NEXT_PUBLIC_GROWTHBOOK_API_KEY is not set; feature flags disabled'
  );
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    reportClientError(error, {
      source: 'app-error-boundary',
      metadata: { componentStack: info.componentStack },
    });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <Error500 />;
    }
    return children;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
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

  useEffect(() => {
    const fetchGrowthbook = async () => {
      if (!growthbookUrl) return null;
      try {
        const data = await fetch(growthbookUrl)
          .then((res) => res.json())
          .then((res) => {
            growthbook.setFeatures(res.features);
          });
        return data;
      } catch (err) {
        reportClientError(err, { source: 'growthbook-refresh' });
      }
      return null;
    };
    fetchGrowthbook();
  }, [router.asPath]);

  const component = (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...pageProps} {...relayProps} />
    </Suspense>
  );

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <GlobalTheme>
        <ThemeProvider theme={theme}>
          {React.createElement(GlobalStyle as any)}
          <BCGovTypography />
          <AppErrorBoundary>
            {React.createElement(
              RelayEnvironmentProvider as any,
              { environment: env },
              <AppProvider>
                {typeof window !== 'undefined' && <SessionExpiryHandler />}
                {component}
              </AppProvider>
            )}
          </AppErrorBoundary>
        </ThemeProvider>
      </GlobalTheme>
    </GrowthBookProvider>
  );
};

export default MyApp;
