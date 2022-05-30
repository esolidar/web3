import { useQuery } from 'react-query';
import axios from 'axios';
import toNumber from '../../utils/convertAmount';
import truncateNumber from '../../utils/truncateNumber';

declare type currencies = 'celo' | 'cusd' | 'ceur';

interface Args {
  wallet: string;
  balanceOf: currencies;
  enabled?: boolean;
  onSuccess?(data: any): void;
}

interface CeloContractAddress {
  name: currencies;
  address: string | undefined;
}

const celoContractAddresses: CeloContractAddress[] = [
  { address: String(process.env.NEXT_PUBLIC_CONTRACT_CELO_ADDRES), name: 'celo' },
  { address: String(process.env.NEXT_PUBLIC_CONTRACT_CUSD_ADDRES), name: 'cusd' },
  { address: String(process.env.NEXT_PUBLIC_CONTRACT_CEUR_ADDRES), name: 'ceur' },
];

const useCeloWalletBalance = ({ wallet, balanceOf, enabled = true, onSuccess }: Args) =>
  useQuery(
    'celoWalletBalance',
    async () => {
      const contractAddress = celoContractAddresses.find(({ name }) => name === balanceOf)?.address;

      if (contractAddress === undefined) throw new Error('Currency not found!');

      const url = `${process.env.NEXT_PUBLIC_EXPLORER_API}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${wallet}`;
      const { data: response } = await axios.get(url);

      const value = toNumber(response.result);
      const truncatedValue = truncateNumber(value, 8);

      return truncatedValue;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
      enabled,
      initialData: 0,
    }
  );

export default useCeloWalletBalance;
