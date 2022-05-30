import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKit } from '@celo/contractkit';
import { useContext } from 'react';
import toNumber from '../../utils/convertAmount';
import truncateNumber from '../../utils/truncateNumber';
import AppContext from '../../contexts/AppContext';

const useGetBalance = () => {
  const { address, performActions } = useContractKit();
  const context = useContext(AppContext);

  const getBalances = async () => {
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
      const truncatedValue = truncateNumber(value, 8);

      context.changeBalance(truncatedValue);
    });
  };

  return { getBalances };
};

export default useGetBalance;
