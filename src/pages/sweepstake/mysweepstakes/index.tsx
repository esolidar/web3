import { useEffect, useState } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import Countdown from 'react-countdown';
import NumberFormat from 'react-number-format';
import Navbar from '../../../components/sweepstake/Navbar';
import truncateAddress from '../../../utils/truncateAddress';
import ERC721EsolidarSweepstake from '../../../abi/ERC721EsolidarSweepstake.json';
import Sweepstake from '../../../abi/EsolidarSweepstake.json';
import { sweetAlertError, sweetAlertSuccess } from '../../../utils/sweepstake/sweetalert';

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
  draw(nftID: number): void;
  cancelCampaing(nftID: number): void;
}

const tokenMap = {
  pEUR: String(process.env.NEXT_PUBLIC_CEUR),
  pUSD: String(process.env.NEXT_PUBLIC_CUSD),
  pBRL: String(process.env.NEXT_PUBLIC_CBRL),
};

const getAddressToken = (address: string) => {
  const tokenList = Object.values(tokenMap);
  const addressIsValidToken = tokenList.some(token => token === address);

  if (addressIsValidToken) {
    const index = tokenList.findIndex(token => token === address);
    return Object.keys(tokenMap)[index];
  }
  return truncateAddress(address, 5);
};

const getERC20Token = (address: string) => {
  const tokenList = Object.values(tokenMap);
  const addressIsValidToken = tokenList.some(token => token === address);

  if (addressIsValidToken) {
    const index = tokenList.findIndex(token => token === address);
    return `${address} (${Object.keys(tokenMap)[index]})`;
  }
  return null;
};

const CountdownTimer = (date: string | number | Date) => (
  <Countdown
    autoStart
    date={date}
    renderer={({ days, hours, minutes, seconds, completed }) => {
      if (completed) return 'Completed';
      if (days > 1 && hours > 1)
        return (
          <span>
            {days}d {hours}h
          </span>
        );
      return (
        <span className="">
          {minutes}m {seconds}s
        </span>
      );
    }}
  />
);

const buttonStyle = { border: '1px solid cyan', borderRadius: '4px', padding: '5px' };

const Card = ({ nft, draw, cancelCampaing }: CardProps) => {
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
          {CountdownTimer(Number(nftDuration) * 1000)}
        </div>
        <div>
          <span className="font-bold mr-3">Total Staked:</span>
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
          {nftActive}
        </div>
        <div>
          <span className="font-bold mr-3">Destroyed:</span>
          {nftDestroyed}
        </div>
        <div>
          {nftActive === 'Active' ? (
            <button type="button" className="mr-2 mt-2" onClick={() => draw(Number(nftID))}>
              DRAW
            </button>
          ) : null}
          {nftDestroyed === 'Not destroyed' && nftActive === 'Active' ? (
            <button
              type="button"
              className="mr-2 mt-2"
              onClick={() => cancelCampaing(Number(nftID))}
            >
              CANCEL
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const MySweepstakes = () => {
  const { performActions, address, account, kit } = useContractKit();

  const [showActive, setShowActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [tokensToWithDraw, setTokensToWithDraw] = useState([]);
  const [allSweepstakes, setAllSweepstakes] = useState([]);

  const renderCampaings = (campaing: 'active' | 'completed' | 'canceled') => {
    if (campaing === 'active') {
      setShowActive(true);
      setShowCompleted(false);
      setShowCanceled(false);
    } else if (campaing === 'completed') {
      setShowActive(false);
      setShowCompleted(true);
      setShowCanceled(false);
    } else if (campaing === 'canceled') {
      setShowActive(false);
      setShowCompleted(false);
      setShowCanceled(true);
    }
  };

  const getAllSweepstakesContract = async () => {
    try {
      await performActions(async () => {
        const res = await contractSweepstake.methods.getAllSweepstakes().call();
        setAllSweepstakes(res);

        // Get tokens of all sweepstakes
        const sweepstakesArray = [];
        for (const sweepstakeResult of res) {
          if (!sweepstakeResult[9] && !sweepstakeResult[10]) {
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
    getAllSweepstakesContract();
  }, [account]);

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake,
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );
  const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(
    ERC721EsolidarSweepstake,
    process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE
  );

  const createCampaing = async () => {
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
          const token = tokenMap[document.getElementById('selectToken').value] || null;
          const inputTokenURI = document.getElementById('inputTokenURI').value;
          const duration = Number(document.getElementById('inputDuration').value);

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

            getAllSweepstakesContract();
          });
        } catch (e: any) {
          if (
            e?.reason?.includes(
              '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
            )
          ) {
            sweetAlertError('You need to be a Charity to create a campaing', '');
          }
        }
      },
    });
  };

  const cancelCampaing = async (nftID: number) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractERC721EsolidarSweepstake.methods.burn(nftID).estimateGas();

        const res = await contractERC721EsolidarSweepstake.methods
          .burn(nftID)
          .send({ from: address, gasLimit });

        if (res.status === true) {
          sweetAlertSuccess('Your campaign was canceled successfully!', '');
          getAllSweepstakesContract();
        } else {
          sweetAlertError('Your campaign was not canceled!', '');
          getAllSweepstakesContract();
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const draw = async (nftID: number) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractSweepstake.methods.draw(Number(nftID)).estimateGas();

        const res = await contractSweepstake.methods
          .draw(Number(nftID))
          .send({ from: address, gasLimit });

        if (res.status === true) {
          sweetAlertSuccess('Success', '');
          getAllSweepstakesContract();
        } else {
          sweetAlertError('Error', '');
          getAllSweepstakesContract();
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const withdraw = async (erc20: string) => {
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
      {/* Navbar */}
      <div>
        <Navbar />
      </div>

      {/* Withdraw button */}
      {tokensToWithDraw?.map(token => (
        <button
          type="button"
          className="d-flex flex-column align-items-center rounded-4"
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

      {/* Create Campaing button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginRight: '25px',
          marginBottom: '50px',
        }}
      >
        <button type="button" style={buttonStyle} onClick={() => createCampaing()}>
          Create Campaing
        </button>
      </div>

      {/* Switch buttons */}
      <div className="flex justify-around mt-10">
        <button type="button" className="border mx-1" onClick={() => renderCampaings('active')}>
          Active
        </button>
        <button type="button" className="border mx-1" onClick={() => renderCampaings('completed')}>
          Completed
        </button>
        <button type="button" className="border mx-1" onClick={() => renderCampaings('canceled')}>
          Cancelled
        </button>
      </div>

      {/* Actives */}
      {allSweepstakes &&
        showActive &&
        allSweepstakes
          .filter(sweepstake => sweepstake[2] === address)
          .filter(sweepstake => !!sweepstake[9])
          .filter(sweepstake => !sweepstake[10])
          .map(sweepstake => (
            <Card
              nft={{
                nftID: sweepstake[0],
                nftTokenURI: sweepstake[1],
                nftOwner: sweepstake[2],
                nftErc20token: sweepstake[3],
                nftDuration: sweepstake[4],
                nftTotalStaked: ethers.utils.formatEther(sweepstake[5]),
                nftWinner: sweepstake[6],
                nftDrawTimestamp: sweepstake[7],
                nftActive: sweepstake[9] ? 'Active' : 'Inactive',
                nftDestroyed: sweepstake[10] ? 'Destoyed' : 'Not destroyed',
              }}
              draw={draw}
              cancelCampaing={cancelCampaing}
            />
          ))}

      {/* Completed */}
      {allSweepstakes &&
        showCompleted &&
        allSweepstakes
          .filter(sweepstake => sweepstake[2] === address)
          .filter(sweepstake => !sweepstake[9])
          .filter(sweepstake => !sweepstake[10])
          .map(sweepstake => (
            <Card
              nft={{
                nftID: sweepstake[0],
                nftTokenURI: sweepstake[1],
                nftOwner: sweepstake[2],
                nftErc20token: sweepstake[3],
                nftDuration: sweepstake[4],
                nftTotalStaked: ethers.utils.formatEther(sweepstake[5]),
                nftWinner: sweepstake[6],
                nftDrawTimestamp: sweepstake[7],
                nftActive: sweepstake[9] ? 'Active' : 'Inactive',
                nftDestroyed: sweepstake[10] ? 'Destoyed' : 'Not destroyed',
              }}
              draw={draw}
              cancelCampaing={cancelCampaing}
            />
          ))}

      {/* Canceled */}
      {allSweepstakes &&
        showCanceled &&
        allSweepstakes
          .filter(sweepstake => sweepstake[2] === address)
          .filter(sweepstake => !sweepstake[9])
          .filter(sweepstake => !!sweepstake[10])
          .map(sweepstake => (
            <Card
              nft={{
                nftID: sweepstake[0],
                nftTokenURI: sweepstake[1],
                nftOwner: sweepstake[2],
                nftErc20token: sweepstake[3],
                nftDuration: sweepstake[4],
                nftTotalStaked: ethers.utils.formatEther(sweepstake[5]),
                nftWinner: sweepstake[6],
                nftDrawTimestamp: sweepstake[7],
                nftActive: sweepstake[9] ? 'Active' : 'Inactive',
                nftDestroyed: sweepstake[10] ? 'Destoyed' : 'Not destroyed',
              }}
              draw={draw}
              cancelCampaing={cancelCampaing}
            />
          ))}
    </div>
  );
};

export default MySweepstakes;
