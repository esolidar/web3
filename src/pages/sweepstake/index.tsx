import { useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import ERC20 from '../../abi/ERC20.json';
import {
  SwalQuestion,
  sweetAlertError,
  sweetAlertSuccess,
} from '../../utils/sweepstake/sweetalert';
import Navbar from '../../components/sweepstake/Navbar';
import useDrawSweepstake from '../../hooks/useDrawSweepstake/useDrawSweepstake';
import useGetAllSweepstakesContract from '../../api/hooks/useGetAllSweepstakesContract';
import useStakeNFT from '../../hooks/useStakeNFT/useStakeNFT';
import CardSweepstake from '../../components/cardSweepstake/CardSweepstake';
import tokenMap from '../../constants/sweepstake';

const Home = () => {
  const draw = useDrawSweepstake();
  const getAllSweepstakesContract = useGetAllSweepstakesContract();
  const stakeNFT = useStakeNFT();
  const { performActions, address, kit } = useContractKit();

  const [sweepstakesList, setSweepstakesList] = useState([]);

  useEffect(() => {
    getAllSweepstakesContract({ onSuccess: res => setSweepstakesList(res) });
  }, [address]);

  const addMoreAllowance = async (
    amount: number,
    token: any,
    currentAllowance: number,
    nftID: number
  ) => {
    const remaining = amount - currentAllowance;

    try {
      const question = await SwalQuestion(
        'Insufficient Allowance',
        `You need to add ${remaining} more allowance to continue. Do you want to add more?`
      );

      if (question === true)
        await performActions(async () => {
          const gasLimit = await token.methods
            .increaseAllowance(
              process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE,
              ethers.utils.parseEther(remaining.toString())
            )
            .estimateGas();

          await token.methods
            .increaseAllowance(
              process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE,
              ethers.utils.parseEther(remaining.toString())
            )
            .send({ from: address, gasLimit });
          sweetAlertSuccess('Success', 'Allowance was added successfully');

          setTimeout(async () => {
            const question = await SwalQuestion('Do you want to donate now?', '');
            if (question)
              stakeNFT({
                nftID,
                amount: String(amount),
                onSuccess: () =>
                  getAllSweepstakesContract({ onSuccess: res => setSweepstakesList(res) }),
              });
          }, 2000);
        });
      else return;
    } catch (e) {
      sweetAlertError('Error', 'Something went wrong');
      console.log(e);
    }
  };

  const beforeStake = async (nftID: number, token: string) => {
    await Swal.fire({
      title: token,
      input: 'text',
      inputLabel: 'Amount to donate',
      inputPlaceholder: '0.00',

      preConfirm: async amount => {
        const contractERC20 = new kit.web3.eth.Contract(ERC20 as AbiItem[], tokenMap[token]);

        let amountOfToken;
        let amountOfAllowance;

        await performActions(async () => {
          const res = await contractERC20.methods.balanceOf(address).call();
          amountOfToken = ethers.utils.formatEther(res);
        });

        await performActions(async () => {
          const res = await contractERC20.methods
            .allowance(address, process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE)
            .call();
          amountOfAllowance = ethers.utils.formatEther(res);
        });

        amount = amount.replace(',', '.');

        if (amount.match(/[^0-9.]/g)) {
          sweetAlertError('Error', 'Please enter a valid amount');
          return;
        }
        if (amount.match(/[a-z]/i)) {
          sweetAlertError('Error', 'Please enter a valid amount');
          return;
        }

        try {
          if (Number(amount) > Number(amountOfToken)) {
            sweetAlertError('Insufficient Balance', 'You need to have more balance to donate');
            return;
          }
          if (Number(amount) > Number(amountOfAllowance)) {
            addMoreAllowance(amount, contractERC20, Number(amountOfAllowance), nftID);
            return;
          }

          stakeNFT({
            nftID,
            amount,
            onSuccess: () =>
              getAllSweepstakesContract({ onSuccess: res => setSweepstakesList(res) }),
          });
        } catch (e) {
          console.table(e);
        }
      },
    });
  };

  const handleClickDraw = (nftID: number) => {
    draw({
      nftID,
      onSuccess: () => getAllSweepstakesContract({ onSuccess: res => setSweepstakesList(res) }),
      onError: () => getAllSweepstakesContract({ onSuccess: res => setSweepstakesList(res) }),
    });
  };

  return (
    <div>
      <div className="row">
        <div>
          <Navbar />
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>Active campaigns</h1>
        </div>
        {sweepstakesList.length > 0 &&
          sweepstakesList
            .filter(sweepstake => !!sweepstake[9])
            .map((sweepstake: any) => (
              <div key={sweepstake.tokenId} className="col-md-4 my-4">
                <CardSweepstake
                  sweepstake={sweepstake}
                  beforeStake={beforeStake}
                  address={String(address)}
                  onClickDraw={handleClickDraw}
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default Home;
