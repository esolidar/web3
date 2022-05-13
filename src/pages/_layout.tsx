import Head from 'next/head';
import Header from '../components/Header';

/* eslint-disable no-undef */
interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta name="description" content="Description" />
      <meta name="keywords" content="Keywords" />
      <title>eSolidar Web3</title>

      <link rel="stylesheet" href="https://use.typekit.net/xse0hrt.css" />
      <link rel="manifest" href="/manifest.json" />
      <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
      <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
      <link rel="apple-touch-icon" href="/apple-icon.png" />
      <meta name="theme-color" content="#317EFB" />
    </Head>
    <div className="container">
      <Header />
      <div className="app">{children}</div>
    </div>
    ;
  </>
);

export default Layout;
