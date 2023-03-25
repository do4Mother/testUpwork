import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Make your resume stand out."
          />
          <meta property="og:site_name" content="resumeboostai.com" />
          <meta
            property="og:description"
            content="Boost your Resume using AI."
          />
          <meta property="og:title" content="Resume Boost AI Generator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Resume Boost AI Generator" />
          <meta
            name="twitter:description"
            content="Boost your Resume using AI."
          />
          <meta
            property="og:image"
            content="https://resumeboostai.com/featured.png"
          />
          <meta
            name="twitter:image"
            content="https://resumeboostai.com/featured.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
