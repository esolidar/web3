import { useContractKit } from '@celo-tools/use-contractkit';
import { AbiItem } from 'web3-utils';
import Sweepstake from '../../abi/EsolidarSweepstake.json';
import useToast from '../useToast/useToast';

interface Args {
  erc20: string;
  onSuccess: () => void;
  onError?: (e: any) => void;
}

const useWithdraw = () => {
  const { address, performActions, kit } = useContractKit();
  const toast = useToast();

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const withdraw = async ({ erc20, onSuccess, onError }: Args) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractSweepstake.methods.withdraw(erc20).estimateGas();
        await contractSweepstake.methods.withdraw(erc20).send({ from: address, gasLimit });

        toast.success('Your withdraw was successful!');
        onSuccess();
      });
    } catch (e) {
      if (onError) onError(e);
      console.log(e);
    }
  };

  return withdraw;
};

export default useWithdraw;
