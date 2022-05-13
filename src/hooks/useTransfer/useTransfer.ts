import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKit } from '@celo/contractkit';

const useTransfer = () => {
  const { address, performActions } = useContractKit();

  const transfer = async (destinationAddress: string) => {
    await performActions(async (kit: ContractKit) => {
      let account: string = '';
      const stableToken = await kit.contracts.getStableToken();
      const amount = kit.web3.utils.toWei('1', 'ether');

      if (address) account = address;
      const gasLimit = await kit.connection.estimateGas({
        to: destinationAddress,
        from: account,
        value: amount,
      });

      const gasPrice = '500000000';
      const adjustedGasLimit = gasLimit * 2;

      // try {
      //   gasPrice = await kit.connection.gasPrice.toString();
      // } catch (_) {}

      const tx = await stableToken
        .transfer(destinationAddress, amount)
        .send({ from: account, feeCurrency: stableToken.address, gas: adjustedGasLimit, gasPrice });

      // const hash = await tx.getHash();
      const receipt = await tx.waitReceipt();
      if (receipt.status) alert('success');
      else alert('error');
    });
  };

  return transfer;
};

export default useTransfer;
