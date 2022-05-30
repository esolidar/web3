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
import AppProvider from '../providers/AppProvider';

import '@celo-tools/use-contractkit/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.scss';
import { DAPP_DESCRIPTION, DAPP_NAME } from '../constants/dapp';

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
  br: getLocaleTranslations(SUPPORTED_LOCALES.BR.id),
  en: getLocaleTranslations(SUPPORTED_LOCALES.EN.id),
  pt: getLocaleTranslations(SUPPORTED_LOCALES.PT.id),
};

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
        name: DAPP_NAME,
        description: DAPP_DESCRIPTION,
        url: String(process.env.NEXT_PUBLIC_DOMAIN),
        icon: `${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/favicon.ico`,
      }}
      actionModal={{
        reactModalProps: {
          overlayClassName: 'web3__getBalance-modal',
        },
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
      <IntlProvider locale={locale} messages={messages[locale] || messages.en}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps?.dehydratedState}>
            <AppProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </AppProvider>
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
