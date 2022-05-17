import { useState } from 'react';
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
import ToastProvider from '../providers/ToastProvider';
import '@celo-tools/use-contractkit/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.scss';

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
              {/* <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} /> */}
              <ToastProvider>
                <Component {...pageProps} />
              </ToastProvider>
            </Layout>
            {process.env.NEXT_PUBLIC_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </Hydrate>
        </QueryClientProvider>
      </IntlProvider>
    </ContractKitProvider>
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
