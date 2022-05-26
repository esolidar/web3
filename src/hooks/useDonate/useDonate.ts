/* eslint-disable consistent-return */
import { useContractKit } from '@celo-tools/use-contractkit';

const useDonateCeloCUSD = () => {
  const { performActions } = useContractKit();

  const donateWithCUSD = async (to: string, amount: string) => {
    try {
      const transactionHash = await performActions(async kit => {
        const cUSD = await kit.contracts.getStableToken();
        const value = kit.web3.utils.toWei(amount, 'ether');
        const tx = await cUSD.transfer(to, value).send({
          from: kit.defaultAccount,
          gasPrice: kit.gasPrice,
        });
        const hash = await tx.getHash();
        await tx.waitReceipt();
        return hash;
      });
      console.log('sendTransaction succeeded');
      return transactionHash;
    } catch (e) {
      console.log((e as Error).message);
      return e;
    } finally {
      console.log('finally');
    }
  };

  return donateWithCUSD;
};

export default useDonateCeloCUSD;
