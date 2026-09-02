import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import config from '../config';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) =>
            ((props) => sheet.collectStyles(<App {...props} />)) as any,
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [
          <React.Fragment key="0">
            {initialProps.styles}
            {sheet.getStyleElement() as any}
          </React.Fragment>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const publicRuntimeConfig = {
      ENABLE_MOCK_TIME: config.get('ENABLE_MOCK_TIME'),
      OPENSHIFT_APP_NAMESPACE: config.get('OPENSHIFT_APP_NAMESPACE'),
      SITEMINDER_LOGOUT_URL: config.get('SITEMINDER_LOGOUT_URL'),
      COVERAGES_FILE_NAME: config.get('COVERAGES_FILE_NAME'),
    };

    /* NextJs will automatically include the styles array from the getInitialProps function and render it last */
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <script
            id="__ENV__"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `window.__ENV__ = ${JSON.stringify(
                publicRuntimeConfig
              ).replace(/</g, '\\u003c')}`,
            }}
          />
          <NextScript />
        </body>
      </Html>
    );
  }
}
