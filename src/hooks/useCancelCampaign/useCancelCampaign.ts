import { useContractKit } from '@celo-tools/use-contractkit';
import { AbiItem } from 'web3-utils';
import ERC721EsolidarSweepstake from '../../abi/ERC721EsolidarSweepstake.json';
import useToast from '../useToast/useToast';

interface Args {
  nftID: number;
  onSuccess: () => void;
  onError?: (e: any) => void;
}

const useCancelCampaign = () => {
  const { address, performActions, kit } = useContractKit();
  const toast = useToast();

  const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(
    ERC721EsolidarSweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE
  );

  const cancelCampaign = async ({ nftID, onSuccess, onError }: Args) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractERC721EsolidarSweepstake.methods.burn(nftID).estimateGas();

        const res = await contractERC721EsolidarSweepstake.methods
          .burn(nftID)
          .send({ from: address, gasLimit });

        if (res.status) {
          toast.success('Your campaign was canceled successfully!');
          onSuccess();
        } else {
          toast.error('Your campaign was not canceled!');
          if (onError) onError(res);
        }
      });
    } catch (e) {
      if (onError) onError(e);
      console.log(e);
    }
  };

  return cancelCampaign;
};

export default useCancelCampaign;
