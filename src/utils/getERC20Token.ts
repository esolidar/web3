import tokenMap from '../constants/sweepstake';

const getERC20Token = (address: string) => {
  const tokenList = Object.values(tokenMap);
  const addressIsValidToken = tokenList.some(token => token === address);

  if (addressIsValidToken) {
    const index = tokenList.findIndex(token => token === address);
    return `${address} (${Object.keys(tokenMap)[index]})`;
  }
  return null;
};

export default getERC20Token;
