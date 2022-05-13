import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKit } from '@celo/contractkit';

const useGetBalance = () => {
  const { address, performActions } = useContractKit();

  const getBalances = async () => {
    await performActions(async (kit: ContractKit) => {
      let account: string = '';
      const celotoken = await kit.contracts.getGoldToken();
      const cUSDtoken = await kit.contracts.getStableToken();

      if (address) account = address;
      const celoBalance = await celotoken.balanceOf(account);
      const cUSDBalance = await cUSDtoken.balanceOf(account);
      console.log(`Your account CELO balance: ${celoBalance.toString()}`);
      console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
    });
  };

  return getBalances;
};

export default useGetBalance;
