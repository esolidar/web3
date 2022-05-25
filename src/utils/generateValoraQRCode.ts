const generateValoraQRCode = (address: string, name: string) => {
  const deepLink = `celo://wallet/pay?address=${address}&displayName=${name}&token=cUSD`;

  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    deepLink
  )}&margin=0&format=svg`;

  return qrCode;
};

export default generateValoraQRCode;
