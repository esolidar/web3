/* eslint-disable */
import { useEffect, useState } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
// import Countdown from 'react-countdown';
import { ethers } from 'ethers';
import NumberFormat from 'react-number-format';
import Tabs from '@esolidar/toolkit/build/elements/tabs';
import truncateAddress from '../../../utils/truncateAddress';
import Navbar from '../../../components/sweepstake/Navbar';
import Sweepstake from '../../../abi/EsolidarSweepstake.json';
import { sweetAlertSuccess } from '../../../utils/sweepstake/sweetalert';

// interface NFT {
//   nftID: string;
//   nftTokenURI: string;
//   nftOwner: string;
//   nftErc20token: string;
//   nftDuration: string;
//   nftTotalStaked: string;
//   nftWinner: string;
//   nftDrawTimestamp: string;
//   nftActive: string;
//   nftDestroyed: string;
// }

// interface CardProps {
//   nft: NFT;
// }

const tokenMap = {
  pEUR: String(process.env.NEXT_PUBLIC_CEUR),
  pUSD: String(process.env.NEXT_PUBLIC_CUSD),
  pBRL: String(process.env.NEXT_PUBLIC_CBRL),
};

const getAddressToken = address => {
  const tokenList = Object.values(tokenMap);
  const addressIsValidToken = tokenList.some(token => token === address);

  if (addressIsValidToken) {
    const index = tokenList.findIndex(token => token === address);
    return Object.keys(tokenMap)[index];
  }
  return truncateAddress(address, 5);
};

const getERC20Token = address => {
  const tokenList = Object.values(tokenMap);
  const addressIsValidToken = tokenList.some(token => token === address);

  if (addressIsValidToken) {
    const index = tokenList.findIndex(token => token === address);
    return `${address} (${Object.keys(tokenMap)[index]})`;
  }
  return null;
};

const Card = ({ nft }) => {
  const {
    nftID,
    nftTokenURI,
    nftOwner,
    nftErc20token,
    // nftDuration,
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
        {/* {false === true ? (
          <div>
            <span className="font-bold mr-3">Duration:</span>
            {Countdown(nftDuration * 1000)}
          </div>
        ) : null} */}
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

const arrayColumn = (array, column) => array.map(item => item[column]);

const MyDonors = () => {
  const buttonStyle = { border: '1px solid cyan', borderRadius: '4px', padding: '5px' };

  const { performActions, address, kit } = useContractKit();

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake,
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const [allSweepstakes, setAllSweepstakes] = useState([]);
  const [tokensToWithDraw, setTokensToWithDraw] = useState([]);

  const [activeDonations, setActiveDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [winningDonations, setWinningDonations] = useState([]);
  const [canceledDonations, setCanceledDonations] = useState([]);

  const getAllSweepstakesContract = async () => {
    try {
      await performActions(async () => {
        const res = await contractSweepstake.methods.getAllSweepstakes().call();
        setAllSweepstakes(res);

        // Get tokens of all sweepstakes
        const sweepstakesArray = [];
        for (const sweepstakeResult of res) {
          if (sweepstakeResult[9] == false && sweepstakeResult[10] == false) {
            if (sweepstakesArray.includes(sweepstakeResult[3])) continue;
            sweepstakesArray.push(sweepstakeResult[3]);
          }
        }

        // Get balanceOf() of user in all tokens sweepstakes
        const balanceOfTokens = [];
        for (const sweepstakeToken of sweepstakesArray) {
          const balance = await contractSweepstake.methods
            .balanceOf(address, sweepstakeToken)
            .call();
          if (ethers.utils.formatEther(balance) > 0) {
            balanceOfTokens.push([sweepstakeToken, balance]);
          }
        }
        setTokensToWithDraw(balanceOfTokens);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (address !== undefined) {
      getAllSweepstakesContract();
    }
  }, [address]);

  useEffect(() => {
    setActiveDonations(
      allSweepstakes?.filter(
        token =>
          token[8].length >= 1 &&
          arrayColumn(token[8], 0).includes(address) &&
          !!token[9] &&
          !token[10]
      )
    );

    setCompletedDonations(
      allSweepstakes?.filter(
        token =>
          token[8].length >= 1 &&
          !token[10] &&
          !token[9] &&
          arrayColumn(token[8], 0).includes(address)
      )
    );
    setWinningDonations(
      allSweepstakes?.filter(
        token => token[8].length >= 1 && !token[9] && !token[10] && token[6] === address
      )
    );

    setCanceledDonations(
      allSweepstakes?.filter(
        token =>
          token[8].length >= 1 &&
          !!token[10] &&
          !token[9] &&
          arrayColumn(token[8], 0).includes(address)
      )
    );
  }, [allSweepstakes]);

  const withdraw = async erc20 => {
    try {
      await performActions(async () => {
        const gasLimit = await contractSweepstake.methods.withdraw(erc20).estimateGas();

        await contractSweepstake.methods.withdraw(erc20).send({ from: address, gasLimit });

        sweetAlertSuccess('Success', 'Your withdraw was successful!');
        getAllSweepstakesContract();
      });
    } catch (e) {
      console.log(e);
    }
  };

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
          {tokensToWithDraw?.map(token => (
            <button
              type="button"
              className="d-flex flex-column align-items-center"
              style={buttonStyle}
              onClick={() => withdraw(token[0])}
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
        onChange={() => {}}
        tabsList={[
          {
            key: 'active',
            title: 'Active',
            content: (
              <>
                {address && activeDonations.length > 0 ? (
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
                )}
              </>
            ),
          },
          {
            key: 'completed',
            title: 'Completed',
            content: (
              <>
                {address && completedDonations.length > 0 ? (
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
                )}
              </>
            ),
          },
          {
            key: 'wins',
            title: 'My wins',
            content: (
              <>
                {address && winningDonations.length > 0 ? (
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
                )}
              </>
            ),
          },
          {
            key: 'cancelled',
            title: 'Cancelled',
            content: (
              <>
                {address && canceledDonations.length > 0 ? (
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
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default MyDonors;
