import { useContractKit } from "@celo-tools/use-contractkit";

const useDonateCeloCUSD = () => {
    const { performActions, } = useContractKit();

    const donateWithCUSD = async (to: string, amount: string) => {
        try {
          await performActions(async (kit) => {
            const cUSD = await kit.contracts.getStableToken();
            const value = kit.web3.utils.toWei(amount, 'ether');
    
            await cUSD
              .transfer(
                to,
                value
              )
              .sendAndWaitForReceipt({
                from: kit.defaultAccount,
                gasPrice: kit.gasPrice,
              });
          });
    
          console.log('sendTransaction succeeded');
    
        } catch (e) {
          console.log((e as Error).message);
        } finally {
          console.log('finally');
        }
      };

      return donateWithCUSD;
}

export default useDonateCeloCUSD;