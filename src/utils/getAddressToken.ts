import tokenMap from '../constants/sweepstake';
import truncateAddress from './truncateAddress';

const getAddressToken = (address: string) => {
  const tokenList = Object.values(tokenMap);
  const addressIsValidToken = tokenList.some(token => token === address);

  if (addressIsValidToken) {
    const index = tokenList.findIndex(token => token === address);
    return Object.keys(tokenMap)[index];
  }
  return truncateAddress(address, 5);
};

export default getAddressToken;
