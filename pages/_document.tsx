import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

import { ServerStyleSheet } from 'styled-components';

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await NextDocument.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  public render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            as="font"
            href="/fonts/Roboto-Regular.ttf"
            crossOrigin="anonymous"
          />

          <link
            rel="preload"
            as="font"
            href="/fonts/Roboto-Bold.ttf"
            crossOrigin="anonymous"
          />

          <link
            rel="preload"
            as="font"
            href="/fonts/GloriaHallelujah-Regular.ttf"
            crossOrigin="anonymous"
          />

          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
