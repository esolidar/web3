import { useEffect, useState } from 'react';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

/* eslint-disable no-undef */
interface Props {
  children: React.ReactNode;
}

const Head = () => (
  <NextHead>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
    />
    <link rel="stylesheet" href="https://use.typekit.net/xse0hrt.css" />
    <link rel="manifest" href="/manifest.json" />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="https://static.esolidar.com/frontend/logo/esolidar/favicon-32x32.png?favicon-32=favicon"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="https://static.esolidar.com/frontend/logo/esolidar/favicon-16x16.png?favicon-32=favicon"
    />
    <link rel="apple-touch-icon" href="/apple-icon.png" />
    <meta name="theme-color" content="#317EFB" />
    <title>esolidar</title>
    <meta
      name="description"
      content="Empowering philanthropy and ESG practice through blockchain"
    />
    <meta name="keywords" content="esolidar" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@esolidar" />
    <meta name="twitter:title" content="esolidar" />
    <meta
      name="twitter:description"
      content="Empowering philanthropy and ESG practice through blockchain"
    />
    <meta name="twitter:creator" content="@esolidar" />
    <meta
      name="twitter:image:src"
      content={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/assets/web3-social-share.png`}
    />
    <meta key="og:title" property="og:title" content="esolidar" />
    <meta
      key="og:description"
      property="og:description"
      content="Empowering philanthropy and ESG practice through blockchain"
    />
    <meta
      key="og:image"
      property="og:image"
      content={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/assets/web3-social-share.png`}
    />
    <meta key="og:url" property="og:url" content={process.env.NEXT_PUBLIC_DOMAIN} />
    <link key="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} rel="canonical" />
  </NextHead>
);

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const [isHeaderTransparent, setIsHeaderTransparent] = useState<boolean>(router.pathname === '/');
  const [isBottonsTransparent, setIsBottonsTransparent] = useState<boolean>(
    router.pathname === '/'
  );

  useEffect(() => {
    document.addEventListener('scroll', () => {
      const scroll = window.scrollY;

      if (scroll > 600) {
        setIsBottonsTransparent(false);
      } else {
        setIsBottonsTransparent(true);
      }

      if (scroll > 700) {
        setIsHeaderTransparent(false);
      } else {
        setIsHeaderTransparent(true);
      }
    });
    return () => {
      document.removeEventListener('scroll', () => {});
    };
  }, []);

  return (
    <>
      <Head />
      <Header
        isHeaderTransparent={router.pathname === '/' && isHeaderTransparent}
        isBottonsTransparent={router.pathname === '/' && isBottonsTransparent}
      />
      {router.pathname === '/' ? (
        <div>{children}</div>
      ) : (
        <div className="app">
          <Viewport className="web3__viewport" centred size="xl">
            <div>{children}</div>
          </Viewport>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Layout;
