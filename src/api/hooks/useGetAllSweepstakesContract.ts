import isDefined from '@esolidar/toolkit/build/utils/isDefined';
import { useContractKit } from '@celo-tools/use-contractkit';
import { CeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { ethers } from 'ethers';
import { AbiItem } from 'web3-utils';
import Sweepstake from '../../abi/EsolidarSweepstake.json';

interface Args {
  onSuccess: (res: any) => void;
  onError?: (e: any) => void;
}

const useGetAllSweepstakesContract = () => {
  const { address, performActions, kit } = useContractKit();

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const getAllSweepstakesContract = async ({ onSuccess, onError }: Args) => {
    if (isDefined(address))
      try {
        await performActions(async () => {
          const res = await contractSweepstake.methods.getAllSweepstakes().call();
          onSuccess(res);
        });
      } catch (e) {
        if (onError) onError(e);
        console.log(e);
      }
    else {
      const JsonRpcProvider = new CeloProvider(process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER);
      const contract = new ethers.Contract(
        String(process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE),
        Sweepstake,
        JsonRpcProvider
      );
      const res = await contract.getAllSweepstakes();
      onSuccess(res);
    }
  };

  return getAllSweepstakesContract;
};

export default useGetAllSweepstakesContract;
