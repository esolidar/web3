import { useContractKit } from '@celo-tools/use-contractkit';
import { AbiItem } from 'web3-utils';
import { ethers } from 'ethers';
import Sweepstake from '../../abi/EsolidarSweepstake.json';
import useToast from '../useToast/useToast';

interface Args {
  nftID: number;
  amount: string;
  onSuccess: () => void;
  onError?: (e: any) => void;
}

const useStakeNFT = () => {
  const { address, performActions, kit } = useContractKit();
  const toast = useToast();

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const stakeNFT = async ({ nftID, amount, onSuccess, onError }: Args) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractSweepstake.methods
          .stake(nftID, ethers.utils.parseEther(amount))
          .estimateGas();

        const res = await contractSweepstake.methods
          .stake(nftID, ethers.utils.parseEther(amount))
          .send({ from: address, gasLimit });

        if (res.status) {
          toast.success(`Donate on NFT ${nftID} with amount ${amount} was successful`);
          onSuccess();
        } else toast.error(`Donate on NFT ${nftID} with amount ${amount} was not successful`);
      });
    } catch (e) {
      if (onError) onError(e);
      console.log(e);
    }
  };

  return stakeNFT;
};

export default useStakeNFT;
