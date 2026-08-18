import React, { Suspense } from 'react';
import { ThemeProvider } from '@mui/material';
import theme from 'styles/muiTheme';
import { RelayEnvironmentProvider } from 'react-relay';
import { useRelayNextjs } from 'relay-nextjs/app';
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { Settings } from 'luxon';
import type { AppProps } from 'next/app';
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
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
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
      <Component {...pageProps} {...relayProps} />
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
            <FeatureFlagProvider>
              <AppProvider>
                {typeof window !== 'undefined' && <SessionExpiryHandler />}
                {component}
              </AppProvider>
            </FeatureFlagProvider>
          )}
        </AppErrorBoundary>
      </ThemeProvider>
    </GlobalTheme>
  );
};

export default MyApp;
