import { useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ethers } from 'ethers';
import NumberFormat from 'react-number-format';
import Tabs from '@esolidar/toolkit/build/elements/tabs';
import Navbar from '../../../components/sweepstake/Navbar';
import Sweepstake from '../../../abi/EsolidarSweepstake.json';
import getAddressToken from '../../../utils/getAddressToken';
import getERC20Token from '../../../utils/getERC20Token';
import useWithdraw from '../../../hooks/useWithdraw/useWithdraw';
import useGetAllSweepstakesContract from '../../../api/hooks/useGetAllSweepstakesContract';

interface NFT {
  nftID: string;
  nftTokenURI: string;
  nftOwner: string;
  nftErc20token: string;
  nftDuration: string;
  nftTotalStaked: string;
  nftWinner: string;
  nftDrawTimestamp: string;
  nftActive: string;
  nftDestroyed: string;
}

interface CardProps {
  nft: NFT;
}

const Card = ({ nft }: CardProps) => {
  const {
    nftID,
    nftTokenURI,
    nftOwner,
    nftErc20token,
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
          <span className="font-bold mr-3">Total Donated:</span>
          {nftTotalStaked}
        </div>
        <div>
          <span className="font-bold mr-3">Metadado: {nftTokenURI}</span>
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
          {nftActive}
        </div>
        <div>
          <span className="font-bold mr-3">Destroyed:</span>
          {nftDestroyed}
        </div>
      </div>
    </div>
  );
};

const arrayColumn = (array: any[], column: number) => array.map(item => item[column]);
const buttonStyle = { border: '1px solid cyan', borderRadius: '4px', padding: '5px' };

const MyDonors = () => {
  const getAllSweepstakesContract = useGetAllSweepstakesContract();
  const withdraw = useWithdraw();
  const { address, kit } = useContractKit();

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const [allSweepstakes, setAllSweepstakes] = useState<any>([]);
  const [tokensToWithDraw, setTokensToWithDraw] = useState<any>([]);

  const [activeDonations, setActiveDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [winningDonations, setWinningDonations] = useState([]);
  const [canceledDonations, setCanceledDonations] = useState([]);

  useEffect(() => {
    if (allSweepstakes.length === 0) return;

    // Get tokens of all sweepstakes
    const sweepstakesArray: any[] = [];
    allSweepstakes.forEach((sweepstakeResult: any) => {
      if (
        !sweepstakeResult[9] &&
        !sweepstakeResult[10] &&
        !sweepstakesArray.includes(sweepstakeResult[3])
      )
        sweepstakesArray.push(sweepstakeResult[3]);
    });

    // Get balanceOf() of user in all tokens sweepstakes
    const balanceOfTokens: any[] = [];
    sweepstakesArray.forEach(async (sweepstakeToken: any) => {
      const balance = await contractSweepstake.methods.balanceOf(address, sweepstakeToken).call();
      if (Number(ethers.utils.formatEther(balance)) > 0)
        balanceOfTokens.push([sweepstakeToken, balance]);
    });

    setTokensToWithDraw(balanceOfTokens);
  }, [allSweepstakes]);

  useEffect(() => {
    if (address !== undefined)
      getAllSweepstakesContract({ onSuccess: res => setAllSweepstakes(res) });
  }, [address]);

  useEffect(() => {
    if (allSweepstakes.length === 0) return;

    setActiveDonations(
      allSweepstakes?.filter(
        (token: any) =>
          token[8].length >= 1 &&
          arrayColumn(token[8], 0).includes(address) &&
          !!token[9] &&
          !token[10]
      )
    );

    setCompletedDonations(
      allSweepstakes?.filter(
        (token: any) =>
          token[8].length >= 1 &&
          !token[10] &&
          !token[9] &&
          arrayColumn(token[8], 0).includes(address)
      )
    );

    setWinningDonations(
      allSweepstakes?.filter(
        (token: any) => token[8].length >= 1 && !token[9] && !token[10] && token[6] === address
      )
    );

    setCanceledDonations(
      allSweepstakes?.filter(
        (token: any) =>
          token[8].length >= 1 &&
          !!token[10] &&
          !token[9] &&
          arrayColumn(token[8], 0).includes(address)
      )
    );
  }, [allSweepstakes]);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex justify-center my-2">
        <h1 className="text-3xl">My Donations</h1>
      </div>
      <div className="flex flex-col flex-wrap justify-around">
        <div className="flex justify-around">
          {tokensToWithDraw?.map((token: any) => (
            <button
              type="button"
              className="d-flex flex-column align-items-center"
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
        </div>
      </div>

      <Tabs
        defaultActiveKey="active"
        tabsList={[
          {
            key: 'active',
            title: 'Active',
            content:
              address && activeDonations.length > 0 ? (
                activeDonations?.map(token => (
                  <Card
                    nft={{
                      nftID: token[0],
                      nftTokenURI: token[1],
                      nftOwner: token[2],
                      nftErc20token: token[3],
                      nftDuration: token[4],
                      nftTotalStaked: ethers.utils.formatEther(token[5]),
                      nftWinner: token[6],
                      nftDrawTimestamp: token[7],
                      nftActive: token[9] ? 'Active' : 'Inactive',
                      nftDestroyed: token[10] ? 'Destoyed' : 'Not destroyed',
                    }}
                  />
                ))
              ) : (
                <h2>You dont have active donations</h2>
              ),
          },
          {
            key: 'completed',
            title: 'Completed',
            content:
              address && completedDonations.length > 0 ? (
                completedDonations?.map(token => (
                  <Card
                    nft={{
                      nftID: token[0],
                      nftTokenURI: token[1],
                      nftOwner: token[2],
                      nftErc20token: token[3],
                      nftDuration: token[4],
                      nftTotalStaked: ethers.utils.formatEther(token[5]),
                      nftWinner: token[6],
                      nftDrawTimestamp: token[7],
                      nftActive: token[9] ? 'Active' : 'Inactive',
                      nftDestroyed: token[10] ? 'Destoyed' : 'Not destroyed',
                    }}
                  />
                ))
              ) : (
                <h2>You dont have completed donations</h2>
              ),
          },
          {
            key: 'wins',
            title: 'My wins',
            content:
              address && winningDonations.length > 0 ? (
                winningDonations?.map(token => (
                  <Card
                    nft={{
                      nftID: token[0],
                      nftTokenURI: token[1],
                      nftOwner: token[2],
                      nftErc20token: token[3],
                      nftDuration: token[4],
                      nftTotalStaked: ethers.utils.formatEther(token[5]),
                      nftWinner: token[6],
                      nftDrawTimestamp: token[7],
                      nftActive: token[9] ? 'Active' : 'Inactive',
                      nftDestroyed: token[10] ? 'Destoyed' : 'Not destroyed',
                    }}
                  />
                ))
              ) : (
                <h2>You dont have winning donations</h2>
              ),
          },
          {
            key: 'cancelled',
            title: 'Cancelled',
            content:
              address && canceledDonations.length > 0 ? (
                canceledDonations?.map(token => (
                  <Card
                    nft={{
                      nftID: token[0],
                      nftTokenURI: token[1],
                      nftOwner: token[2],
                      nftErc20token: token[3],
                      nftDuration: token[4],
                      nftTotalStaked: ethers.utils.formatEther(token[5]),
                      nftWinner: token[6],
                      nftDrawTimestamp: token[7],
                      nftActive: token[9] ? 'Active' : 'Inactive',
                      nftDestroyed: token[10] ? 'Destoyed' : 'Not destroyed',
                    }}
                  />
                ))
              ) : (
                <h2>You dont have canceled donations</h2>
              ),
          },
        ]}
      />
    </div>
  );
};

export default MyDonors;
