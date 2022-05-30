const generateValoraQRCode = (address: string, name: string) =>
  `celo://wallet/pay?address=${address}&displayName=${name}`;

export default generateValoraQRCode;
