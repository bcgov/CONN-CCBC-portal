import React, { Suspense } from 'react';
import { ThemeProvider } from '@mui/material';
import theme from 'styles/muiTheme';
import { RelayEnvironmentProvider } from 'react-relay';
import { useRelayNextjs } from 'relay-nextjs/app';
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { Settings } from 'luxon';
import NextApp, { AppContext, AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Error500 from 'pages/500';
import { getClientEnvironment } from 'lib/relay/client';
import reportClientError from 'lib/helpers/reportClientError';
import GlobalStyle from 'styles/GobalStyles';
import GlobalTheme from 'styles/GlobalTheme';
import BCGovTypography from 'components/BCGovTypography';
import { SessionExpiryHandler } from 'components';
import { AppProvider } from 'components/AppProvider';
import FeatureFlagProvider from 'components/FeatureFlagProvider';
import {
  PublicConfig,
  PublicConfigProvider,
} from 'components/PublicConfigProvider';

config.autoAddCss = false;

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
  const { publicConfig, ...relayPageProps } = pageProps;
  const { env, ...relayProps } = useRelayNextjs(relayPageProps, {
    createClientEnvironment: () => getClientEnvironment()!,
  });
  Settings.defaultZone = 'America/Vancouver';
  Settings.defaultLocale = 'en-CA';

  newTracker('ccbcTracker', 'spt.apps.gov.bc.ca', {
    appId: 'Snowplow_standalone_NWBC',
  });

  trackPageView();

  const component = (
    <Suspense
      fallback={<div data-testid="app-suspense-loading">Loading...</div>}
    >
      <Component {...relayPageProps} {...relayProps} />
    </Suspense>
  );

  return (
    <GlobalTheme>
      <ThemeProvider theme={theme}>
        {React.createElement(GlobalStyle as any)}
        <BCGovTypography />
        <AppErrorBoundary>
          {React.createElement(
            RelayEnvironmentProvider as any,
            { environment: env },
            <PublicConfigProvider value={publicConfig}>
              <FeatureFlagProvider>
                <AppProvider>
                  {typeof window !== 'undefined' && <SessionExpiryHandler />}
                  {component}
                </AppProvider>
              </FeatureFlagProvider>
            </PublicConfigProvider>
          )}
        </AppErrorBoundary>
      </ThemeProvider>
    </GlobalTheme>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);

  let publicConfig: PublicConfig;
  if (typeof window === 'undefined') {
    // Server-only: never let this branch reach the client bundle.
    // eslint-disable-next-line global-require
    const getServerPublicConfig = require('backend/lib/getServerPublicConfig')
      .default as () => PublicConfig;
    publicConfig = getServerPublicConfig();
  } else {
    // Client-side navigations re-run getInitialProps, but the value can't
    // change within a running container, so reuse the snapshot embedded in
    // the initial HTML instead of trying to read config in the browser.
    publicConfig = (window as any).__NEXT_DATA__?.props?.pageProps
      ?.publicConfig;
  }

  return {
    ...appProps,
    pageProps: { ...appProps.pageProps, publicConfig },
  };
};

export default MyApp;
