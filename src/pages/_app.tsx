import { useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { IntlProvider } from 'react-intl';
import {
  ContractKitProvider,
  SupportedProviders,
  Alfajores,
  Mainnet,
} from '@celo-tools/use-contractkit';
import Layout from './_layout';
import { SUPPORTED_LOCALES } from '../constants/locales';
import getLocaleTranslations from '../utils/locales';
import '../index.scss';
import '@celo-tools/use-contractkit/lib/styles.css';

export type ILocale = {
  [key in string]: string;
};

export type IMessages = {
  [key in string]: ILocale;
};
interface InitialProps {
  locale: string;
}
interface Props extends AppProps {
  initialProps: InitialProps;
}

const messages: IMessages = {
  br: getLocaleTranslations(SUPPORTED_LOCALES.BR),
  en: getLocaleTranslations(SUPPORTED_LOCALES.EN),
  pt: getLocaleTranslations(SUPPORTED_LOCALES.PT),
};

// const defaultRichTextElements = {
//   br: <br />,
//   b: (chunks: any) => <b>{chunks}</b>,
//   p: (chunks: any) => <p>{chunks}</p>,
//   i: (chunks: any) => <i>{chunks}</i>,
//   strong: (chunks: any) => <strong>{chunks}</strong>,
// };

const App = ({ Component, pageProps, initialProps }: Props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const { locale } = initialProps;

  const contractkitNetwork = process.env.NEXT_PUBLIC_ENV === 'production' ? Mainnet : Alfajores;
  return (
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
        <title>Next.js PWA Example</title>

        <link rel="stylesheet" href="https://use.typekit.net/xse0hrt.css" />
        <link rel="manifest" href="/manifest.json" />
        <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <ContractKitProvider
        dapp={{
          name: 'use-contractkit demo',
          description: 'A demo DApp to showcase functionality',
          url: 'https://use-contractkit.vercel.app',
          icon: 'https://use-contractkit.vercel.app/favicon.ico',
        }}
        connectModal={{
          reactModalProps: {
            overlayClassName: 'web3__connect-modal',
          },
          providersOptions: {
            hideFromDefaults: [
              SupportedProviders.CeloDance,
              SupportedProviders.CeloExtensionWallet,
              SupportedProviders.CeloTerminal,
              SupportedProviders.CeloWallet,
              SupportedProviders.Injected,
              SupportedProviders.Ledger,
              SupportedProviders.PrivateKey,
            ],
          },
        }}
        network={contractkitNetwork}
      >
        <IntlProvider
          locale="pt"
          messages={messages[locale] || messages.en}
          // defaultRichTextElements={defaultRichTextElements}
        >
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps?.dehydratedState}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              {process.env.NEXT_PUBLIC_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </Hydrate>
          </QueryClientProvider>
        </IntlProvider>
      </ContractKitProvider>
    </>
  );
};

App.getInitialProps = async (appContext: any) => {
  const { locale } = appContext.ctx;

  return {
    initialProps: {
      locale,
    },
  };
};

export default App;
