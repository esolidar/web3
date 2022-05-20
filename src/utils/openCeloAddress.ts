const openCeloAddress = (address: string) => {
  const url = String(process.env.NEXT_PUBLIC_ADDRESS_DETAILS_URL).replace('{{address}}', address);
  window.open(url, '_blank');
};

export default openCeloAddress;
