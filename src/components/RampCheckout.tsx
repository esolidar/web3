import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import useGetBalance from '../hooks/useGetBalance/useGetBalance';
import { DAPP_NAME } from '../constants/dapp';

interface Props {
  userAddress: string;
  selectedCountryCode: string;
}

const openRamp = (getBalance: any, userAddress: string, selectedCountryCode: string) => {
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
  }).show();
};

const RampCheckout = ({
  userAddress,
  selectedCountryCode,
}: Props) => {
    const { getBalances } = useGetBalance();

    return (
      <div>
        <button type="button" onClick={() => openRamp(getBalances, userAddress, selectedCountryCode)}>
          Buy Crypto
        </button>
      </div>
    )
};

export default RampCheckout;
