import { AddressUtils } from '@celo/utils';

const isValidAddress = (address: string): boolean => AddressUtils.isValidAddress(address);

export default isValidAddress;
