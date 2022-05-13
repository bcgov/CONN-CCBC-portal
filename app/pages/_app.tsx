import type { AppProps } from 'next/app';

import GlobalStyle from '../styles/GobalStyles';
import GlobalTheme from '../styles/GlobalTheme';
import BCGovTypography from '../components/BCGovTypography';
import { Layout } from '../components';
import App from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalTheme>
      <GlobalStyle />
      <BCGovTypography />
      <Layout title="Connecting Communities BC">
        <Component {...pageProps} />
      </Layout>
    </GlobalTheme>
  );
}

MyApp.getInitialProps = async (context: any) => {
  const props = await App.getInitialProps(context);
  return { ...props };
};
