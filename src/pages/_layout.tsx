/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';
import Script from 'next/script';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { DAPP_DESCRIPTION, DAPP_NAME } from '../constants/dapp';

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
      rel="apple-touch-icon"
      sizes="180x180"
      href={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/apple-touch-icon.png?favicon-32=favicon`}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/favicon-32x32.png?favicon-32=favicon`}
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/favicon-16x16.png?favicon-32=favicon`}
    />
    <link
      rel="manifest"
      href={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/site.webmanifest?favicon-32=favicon`}
    />
    <link
      rel="mask-icon"
      href={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/safari-pinned-tab.svg?favicon-32=favicon`}
      color="#17c3b2"
    />
    <link
      rel="shortcut icon"
      href={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/favicon.ico?favicon-32=favicon`}
    />
    <meta name="msapplication-TileColor" content="#17c3b2" />
    <meta
      name="msapplication-config"
      content={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/browserconfig.xml?favicon-32=favicon`}
    />
    <meta name="theme-color" content="#17c3b2" />
    <title>{DAPP_NAME}</title>
    <meta name="description" content={DAPP_DESCRIPTION} />
    <meta name="keywords" content="esolidar" />
    <meta name="twitter:card" content={DAPP_DESCRIPTION} />
    <meta name="twitter:site" content="@esolidar" />
    <meta name="twitter:title" content={DAPP_NAME} />
    <meta name="twitter:description" content={DAPP_DESCRIPTION} />
    <meta name="twitter:creator" content="@esolidar" />
    <meta
      name="twitter:image:src"
      content={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/assets/web3-social-share.png`}
    />
    <meta key="og:title" property="og:title" content={DAPP_NAME} />
    <meta key="og:description" property="og:description" content={DAPP_DESCRIPTION} />
    <meta
      key="og:image"
      property="og:image"
      content={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/assets/web3-social-share.png`}
    />
    <meta key="og:url" property="og:url" content={process.env.NEXT_PUBLIC_DOMAIN} />
    <link key="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} rel="canonical" />

    <Script
      dangerouslySetInnerHTML={{
        __html: `
            window['_fs_debug'] = false;
            window['_fs_host'] = 'fullstory.com';
            window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
            window['_fs_org'] = '15RV3R';
            window['_fs_namespace'] = 'FS';
            (function(m,n,e,t,l,o,g,y){
                if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
                y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                g.anonymize=function(){g.identify(!!0)};
                g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                g.log = function(a,b){g("log",[a,b])};
                g.consent=function(a){g("consent",!arguments.length||a)};
                g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                g.clearUserCookie=function(){};
                g.setVars=function(n, p){g('setVars',[n,p]);};
                g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                g._v="1.3.0";
            })(window,document,window['_fs_namespace'],'script','user');
            `,
      }}
      strategy="beforeInteractive"
    />
    <Script
      dangerouslySetInnerHTML={{
        __html: `
        window.intercomSettings = {
          api_base: ${process.env.NEXT_PUBLIC_INTERCOM},
          app_id: ${process.env.NEXT_PUBLIC_INTERCOM_KEY}
        };
            `,
      }}
      strategy="beforeInteractive"
    />
    <Script
      dangerouslySetInnerHTML={{
        __html: `
        (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='${process.env.NEXT_PUBLIC_WIDGET_INTERCOM}${process.env.NEXT_PUBLIC_INTERCOM_KEY}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
            `,
      }}
      strategy="beforeInteractive"
    />
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
