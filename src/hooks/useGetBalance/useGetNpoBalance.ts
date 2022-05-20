/* eslint-disable consistent-return */

import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKit } from '@celo/contractkit';
import { useState } from 'react';
import toNumber from '../../utils/convertAmount';
import isValidAddress from '../../utils/isValidAddress';

const useGetNpoBalance = () => {
  const { performActions } = useContractKit();
  const [balance, setBalance] = useState<number>();
  const [error, setError] = useState<any>(null);

  const getNpoBalance = async (address: string) => {
    if (!isValidAddress(address)) {
      setError('error');
      return { error: 'invalid address' };
    }

    await performActions(async (kit: ContractKit) => {
      let account: string = '';
      // const celotoken = await kit.contracts.getGoldToken();
      const cUSDtoken = await kit.contracts.getStableToken();

      if (address) account = address;
      // const celoBalance = await celotoken.balanceOf(account);
      const cUSDBalance = await cUSDtoken.balanceOf(account);
      // console.log(`Your account CELO balance: ${celoBalance.toString()}`);
      // console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
      const value = toNumber(cUSDBalance.toString());

      setBalance(+value.toFixed(4));
    });
  };

  return { balance, getNpoBalance, error };
};

export default useGetNpoBalance;
