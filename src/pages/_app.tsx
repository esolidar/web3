import Head from 'next/head';
import { AppProps } from 'next/app';
import {
  ContractKitProvider,
  SupportedProviders,
  Alfajores,
  // Mainnet,
} from '@celo-tools/use-contractkit';
import '../styles/globals.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
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
        network={Alfajores}
        // network={Mainnet}
        // networks={[Mainnet, Alfajores]}
      >
        <Component {...pageProps} />
      </ContractKitProvider>
    </>
  );
}
