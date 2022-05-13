import { useQuery } from 'react-query';
import axios from 'axios';
import toNumber from '../../utils/convertAmount';

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
    { address: String(process.env.NEXT_PUBLIC_CONTRACT_CEUR_ADDRES), name: 'ceur' }
];

const queryKey: string = 'celoWalletBalance';
const url = (wallet: string, contractAddress?: string): string => `${process.env.NEXT_PUBLIC_EXPLORER_API}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${wallet}`;

const useCeloWalletBalance = ({ wallet, balanceOf, enabled = true, onSuccess }: Args) =>
  useQuery(
    queryKey,
    async () => {
      const contractAddress = celoContractAddresses.find(({ name }) => name === balanceOf)?.address;

      if(contractAddress === undefined)
      throw new Error('Currency not find!');
      
      const { data: response } = await axios.get(url(wallet, contractAddress));
      return toNumber(response.result);
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
      enabled,
    }
  );

export default useCeloWalletBalance;
