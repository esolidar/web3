const openCeloTransaction = (hash: string) => {
  const url = String(process.env.NEXT_PUBLIC_TRANSACTION_ADDRESS_DETAILS_URL).replace(
    '{{hash}}',
    hash
  );
  console.log('url');
  window.open(url, '_blank');
};

export default openCeloTransaction;
