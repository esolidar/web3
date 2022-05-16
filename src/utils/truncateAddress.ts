const truncateAddress = (address: string, sliceLength: number = 8): string =>
  `${address.slice(0, sliceLength)}...${address.slice(-sliceLength)}`;

export default truncateAddress;
