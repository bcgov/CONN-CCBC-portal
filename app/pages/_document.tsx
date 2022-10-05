import React from 'react';
import Document, { Html, Main, DocumentContext } from 'next/document';
import {
  getCspInitialProps,
  provideComponents,
} from '@next-safe/middleware/dist/document'; 

import { ServerStyleSheet } from 'styled-components';
import { createRelayDocument, RelayDocument } from 'relay-nextjs/document';

interface DocumentProps {
  relayDocument: RelayDocument;
}

export default class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    const relayDocument = createRelayDocument();

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => {
            const AppWithRelay = relayDocument.enhance(App);

            return sheet.collectStyles(<AppWithRelay {...props} />);
          },
        });

      const initialProps = await Document.getInitialProps(ctx);
      const cspInitialProps = await getCspInitialProps({ ctx, trustifyScripts: true, trustifyStyles: true });
      return {
        ...initialProps,
        ...cspInitialProps,
        relayDocument,
        styles: [
          <React.Fragment key="0">
            {initialProps.styles}
            {sheet.getStyleElement()}
          </React.Fragment>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const { relayDocument } = this.props;
    const { Head, NextScript } = provideComponents(this.props);
    /* NextJs will automatically include the styles array from the getInitialProps function and render it last */
    return (
      <Html lang="en">
        <Head>
          <relayDocument.Script />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
