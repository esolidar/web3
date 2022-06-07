import { useContractKit } from '@celo-tools/use-contractkit';
import { AbiItem } from 'web3-utils';
import Sweepstake from '../../abi/EsolidarSweepstake.json';
import useToast from '../useToast/useToast';

interface Args {
  nftID: number;
  onSuccess: () => void;
  onError?: (e: any) => void;
}

const useDrawSweepstake = () => {
  const { address, performActions, kit } = useContractKit();
  const toast = useToast();

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const draw = async ({ nftID, onSuccess, onError }: Args) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractSweepstake.methods.draw(nftID).estimateGas();
        const res = await contractSweepstake.methods.draw(nftID).send({ from: address, gasLimit });

        if (res.status) {
          toast.success('Draw was successful');
          onSuccess();
        } else {
          toast.error('Error');
          if (onError) onError(res);
        }
      });
    } catch (e) {
      if (onError) onError(e);
      console.log(e);
    }
  };

  return draw;
};

export default useDrawSweepstake;
