import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

interface Props {
  userAddress: string;
  selectedCountryCode: string;
}

const openRamp = (userAddress: string, selectedCountryCode: string) => {
  new RampInstantSDK({
    //url: 'https://ri-widget-staging.firebaseapp.com/',
    hostAppName: '3solidar',
    hostLogoUrl: 'https://uploads-ssl.webflow.com/60772889b1dfccd8c9417886/60a7f3b1485626527fe35b97_logo_esolidar.svg',
    swapAsset: 'CELO_CUSD',
    variant: 'auto',
    fiatCurrency: 'EUR', 
    fiatValue: "10",
    userAddress: userAddress,
    selectedCountryCode: selectedCountryCode
  }).show();
};

const RampCheckout = ({
  userAddress,
  selectedCountryCode
}: Props) => {
  console.log("Ramp chackout");

    return (
      <div>
        <button onClick={() => openRamp(userAddress, selectedCountryCode)}>
          Buy Crypto
        </button>
      </div>
    )
};

export default RampCheckout;
