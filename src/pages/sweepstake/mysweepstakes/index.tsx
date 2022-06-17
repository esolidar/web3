import { useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import { useContractKit } from '@celo-tools/use-contractkit';
import Button from '@esolidar/toolkit/build/elements/button';
import Tabs from '@esolidar/toolkit/build/elements/tabs';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import NumberFormat from 'react-number-format';
import CountdownTimer from '../../../components/countdownTimer/CountdownTimer';
import Navbar from '../../../components/sweepstake/Navbar';
import ERC721EsolidarSweepstake from '../../../abi/ERC721EsolidarSweepstake.json';
import Sweepstake from '../../../abi/EsolidarSweepstake.json';
import { sweetAlertError, sweetAlertSuccess } from '../../../utils/sweepstake/sweetalert';
import useDrawSweepstake from '../../../hooks/useDrawSweepstake/useDrawSweepstake';
import useGetAllSweepstakesContract from '../../../api/hooks/useGetAllSweepstakesContract';
import tokenMap from '../../../constants/sweepstake';
import getAddressToken from '../../../utils/getAddressToken';
import getERC20Token from '../../../utils/getERC20Token';
import useWithdraw from '../../../hooks/useWithdraw/useWithdraw';
import useCancelCampaign from '../../../hooks/useCancelCampaign/useCancelCampaign';
import NFT from '../../../interfaces/nft';

export declare type ISweepstake = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string[],
  string,
  string
];

interface CardProps {
  nft: NFT;
  onClickDraw(nftID: number): void;
  onClickCancelCampaign(nftID: number): void;
}

const buttonStyle = { border: '1px solid cyan', borderRadius: '4px', padding: '5px' };

export const convertSweepstakeToNFT = (sweepstake: ISweepstake): NFT => ({
  nftID: Number(sweepstake[0]),
  nftTokenURI: sweepstake[1],
  nftOwner: sweepstake[2],
  nftErc20token: sweepstake[3],
  nftDuration: Number(sweepstake[4]),
  nftTotalStaked: ethers.utils.formatEther(sweepstake[5]),
  nftWinner: sweepstake[6],
  nftDrawTimestamp: sweepstake[7],
  nftActive: Boolean(sweepstake[9]),
  nftDestroyed: Boolean(sweepstake[10]),
});

const Card = ({ nft, onClickDraw, onClickCancelCampaign }: CardProps) => {
  const {
    nftID,
    nftTokenURI,
    nftOwner,
    nftErc20token,
    nftDuration,
    nftTotalStaked,
    nftWinner,
    nftDrawTimestamp,
    nftActive,
    nftDestroyed,
  } = nft;

  return (
    <div className="card my-3">
      <div className="card-body">
        <h2 className="card-title">NFT ID: {nftID}</h2>
        <div>
          <span className="font-bold mr-3">Owner:</span> {nftOwner}
        </div>
        <div>
          <span className="font-bold mr-3">Token:</span>
          {getERC20Token(nftErc20token)}
        </div>
        <div>
          <span className="font-bold mr-3">Duration:</span>
          <CountdownTimer date={nftDuration * 1000} />
        </div>
        <div>
          <span className="font-bold mr-3">Total Donated:</span>
          {nftTotalStaked}
        </div>
        <div>
          <span className="font-bold mr-3">Metadata: {nftTokenURI}</span>
        </div>
        <div>
          <span className="font-bold mr-3">Winner:</span>
          {nftWinner}
        </div>
        <div>
          <span className="font-bold mr-3">DrawTimeStamp:</span>
          {nftDrawTimestamp}
        </div>
        <div>
          <span className="font-bold mr-3">Active:</span>
          {String(nftActive)}
        </div>
        <div>
          <span className="font-bold mr-3">Destroyed:</span>
          {String(nftDestroyed)}
        </div>
        <div>
          {nftActive && (
            <Button
              extraClass="primary-full"
              className="mr-2 mt-2"
              onClick={() => onClickDraw(nftID)}
              text="Draw"
            />
          )}
          {nftActive && !nftDestroyed && (
            <Button
              extraClass="negative-full"
              className="mr-2 mt-2"
              onClick={() => onClickCancelCampaign(nftID)}
              text="Cancel"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const MySweepstakes = () => {
  const draw = useDrawSweepstake();
  const getAllSweepstakesContract = useGetAllSweepstakesContract();
  const withdraw = useWithdraw();
  const cancelCampaign = useCancelCampaign();
  const { performActions, address, account, kit } = useContractKit();

  const [tokensToWithDraw, setTokensToWithDraw] = useState<any>([]);
  const [allSweepstakes, setAllSweepstakes] = useState<ISweepstake[]>([]);
  const [activeSweepstakes, setActiveSweepstakes] = useState<ISweepstake[]>([]);
  const [completedSweepstakes, setCompletedSweepstakes] = useState<ISweepstake[]>([]);
  const [canceledSweepstakes, setCanceledSweepstakes] = useState<ISweepstake[]>([]);

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );
  const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(
    ERC721EsolidarSweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE
  );

  useEffect(() => {
    getAllSweepstakesContract({ onSuccess: res => setAllSweepstakes(res) });
  }, [account]);

  useEffect(() => {
    if (allSweepstakes.length === 0) return;

    // Get tokens of all sweepstakes
    const sweepstakeTokensArray: string[] = [];
    allSweepstakes.forEach((sweepstake: ISweepstake) => {
      if (!sweepstake[9] && !sweepstake[10] && !sweepstakeTokensArray.includes(sweepstake[3]))
        sweepstakeTokensArray.push(sweepstake[3]);
    });

    // Get balanceOf() of user in all tokens sweepstakes
    const balanceOfTokens: any[] = [];
    sweepstakeTokensArray.forEach(async (sweepstakeToken: string) => {
      const balance = await contractSweepstake.methods.balanceOf(address, sweepstakeToken).call();
      if (Number(ethers.utils.formatEther(balance)) > 0)
        balanceOfTokens.push([sweepstakeToken, balance]);
    });

    setTokensToWithDraw(balanceOfTokens);

    setActiveSweepstakes(
      allSweepstakes?.filter(
        (sweepstake: ISweepstake) => sweepstake[2] === address && !!sweepstake[9] && !sweepstake[10]
      )
    );

    setCompletedSweepstakes(
      allSweepstakes?.filter(
        (sweepstake: ISweepstake) => sweepstake[2] === address && !sweepstake[9] && !sweepstake[10]
      )
    );

    setCanceledSweepstakes(
      allSweepstakes?.filter(
        (sweepstake: ISweepstake) => sweepstake[2] === address && !sweepstake[9] && !!sweepstake[10]
      )
    );
  }, [allSweepstakes]);

  const createCampaign = async () => {
    await Swal.fire({
      title: 'Create a new campaign',
      showCancelButton: true,
      html:
        '<div class="d-flex flex-column">' +
        '<select id="selectToken" class="my-1 py-2">' +
        '<option disabled selected>Select a token</option>' +
        '<option>pBRL</option>' +
        '<option>pUSD</option>' +
        '<option>pEUR</option>' +
        '</select>' +
        `<input id="inputTokenURI" required class="my-1 py-2" type="text" placeholder="token URI"/>` +
        '<input id="inputDuration" required class="my-1 py-2" type="text" placeholder="duration (in minutes)" />' +
        '</div>',
      focusConfirm: false,
      preConfirm: async () => {
        try {
          const token =
            tokenMap[(document.getElementById('selectToken') as HTMLInputElement).value] || null;
          const inputTokenURI = (document.getElementById('inputTokenURI') as HTMLInputElement)
            .value;
          const duration = Number(
            (document.getElementById('inputDuration') as HTMLInputElement).value
          );

          if (token == null) return;

          await performActions(async () => {
            Swal.close();

            const gasLimit = await contractERC721EsolidarSweepstake.methods
              .mint(inputTokenURI, token, duration * 60)
              .estimateGas();

            await contractERC721EsolidarSweepstake.methods
              .mint(inputTokenURI, token, duration * 60)
              .send({ from: address, gasLimit });

            sweetAlertSuccess('Your campaign was created successfully!', '');

            getAllSweepstakesContract({ onSuccess: res => setAllSweepstakes(res) });
          });
        } catch (e: any) {
          if (
            e?.reason?.includes(
              '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
            )
          )
            sweetAlertError('You need to be a Charity to create a campaign', '');
        }
      },
    });
  };

  const handleClickDraw = (nftID: number) => {
    draw({
      nftID,
      onSuccess: () => getAllSweepstakesContract({ onSuccess: res => setAllSweepstakes(res) }),
      onError: () => getAllSweepstakesContract({ onSuccess: res => setAllSweepstakes(res) }),
    });
  };

  const handleClickCancelCampaign = (nftID: number) => {
    cancelCampaign({
      nftID,
      onSuccess: () =>
        getAllSweepstakesContract({
          onSuccess: res => setAllSweepstakes(res),
        }),
      onError: () => getAllSweepstakesContract({ onSuccess: res => setAllSweepstakes(res) }),
    });
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      {/* Withdraw button */}
      {tokensToWithDraw?.map((token: any) => (
        <button
          type="button"
          className="d-flex flex-column align-items-center rounded-4"
          style={buttonStyle}
          onClick={() =>
            withdraw({
              erc20: token[0],
              onSuccess: () =>
                getAllSweepstakesContract({ onSuccess: res => setAllSweepstakes(res) }),
            })
          }
        >
          <span>Claim {getAddressToken(token[0])}</span>
          <NumberFormat
            value={ethers.utils.formatEther(token[1])}
            displayType="text"
            thousandSeparator
            decimalScale={4}
          />
        </button>
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginRight: '25px',
          marginBottom: '50px',
        }}
      >
        <Button extraClass="primary-full" onClick={() => createCampaign()} text="Create campaign" />
      </div>

      <Tabs
        defaultActiveKey="active"
        tabsList={[
          {
            key: 'active',
            title: 'Active',
            content:
              activeSweepstakes.length > 0 &&
              activeSweepstakes.map((sweepstake: ISweepstake) => (
                <Card
                  nft={convertSweepstakeToNFT(sweepstake)}
                  onClickDraw={handleClickDraw}
                  onClickCancelCampaign={handleClickCancelCampaign}
                />
              )),
          },
          {
            key: 'completed',
            title: 'Completed',
            content:
              completedSweepstakes.length > 0 &&
              completedSweepstakes.map((sweepstake: ISweepstake) => (
                <Card
                  nft={convertSweepstakeToNFT(sweepstake)}
                  onClickDraw={handleClickDraw}
                  onClickCancelCampaign={handleClickCancelCampaign}
                />
              )),
          },
          {
            key: 'cancelled',
            title: 'Cancelled',
            content:
              canceledSweepstakes.length > 0 &&
              canceledSweepstakes.map((sweepstake: ISweepstake) => (
                <Card
                  nft={convertSweepstakeToNFT(sweepstake)}
                  onClickDraw={handleClickDraw}
                  onClickCancelCampaign={handleClickCancelCampaign}
                />
              )),
          },
        ]}
      />
    </div>
  );
};

export default MySweepstakes;
