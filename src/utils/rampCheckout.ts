import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { DAPP_NAME } from '../constants/dapp';

const openRamp = (getBalance: () => Promise<void>, userAddress: string, selectedCountryCode: string) => (
  new RampInstantSDK({
    url: process.env.NEXT_PUBLIC_ENV !== 'production' ? 'https://ri-widget-staging.firebaseapp.com/' : undefined,
    hostAppName: DAPP_NAME,
    hostLogoUrl: `${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/logo/esolidar/logo-xsmall.svg`,
    swapAsset: 'CELO_CUSD',
    variant: 'auto',
    userAddress,
    selectedCountryCode,
  }).on('*', event => {
    // Sent when a user confirms closing the widget - this ends the flow
    if(event.type === 'WIDGET_CLOSE_REQUEST_CONFIRMED') getBalance();
  }).show()
);

export default openRamp;