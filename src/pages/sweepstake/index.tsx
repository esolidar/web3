import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { useContractKit } from '@celo-tools/use-contractkit';
import { Card } from 'react-bootstrap';
import { CeloProvider } from '@celo-tools/celo-ethers-wrapper';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import truncateAddress from '../../utils/truncateAddress';
// ABIs
// import ERC721EsolidarSweepstake from '../../abi/ERC721EsolidarSweepstake.json';
import ERC20 from '../../abi/ERC20.json';
import Sweepstake from '../../abi/EsolidarSweepstake.json';

// Sweetalert
import {
  SwalQuestion,
  sweetAlertError,
  sweetAlertSuccess,
} from '../../utils/sweepstake/sweetalert';
import Navbar from '../../components/sweepstake/Navbar';

interface CustomCardProps {
  sweepstake: any;
  beforeStake(nftID: number, token: string): any;
  address: string;
  draw(nftID: number): any;
}

const tokenMap = {
  pEUR: String(process.env.NEXT_PUBLIC_CEUR),
  pUSD: String(process.env.NEXT_PUBLIC_CUSD),
  pBRL: String(process.env.NEXT_PUBLIC_CBRL),
};

const buttonStyle = {
  backgroundColor: 'gray',
  color: 'white',
  width: '100%',
  borderRadius: '10px',
  padding: '10px',
  margin: '2px',
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

const CustomCard = ({ sweepstake, beforeStake, address, draw }: CustomCardProps) => {
  const nftID = typeof sweepstake[0] === 'object' ? Number(sweepstake[0]) : sweepstake[0];

  return (
    <Card style={{ width: '18rem', borderRadius: '10px' }}>
      <Card.Body>
        <Card.Title>NFT ID: {nftID}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {sweepstake[2] === address ? (
            <span>You are the owner</span>
          ) : (
            <span>Owner: {truncateAddress(sweepstake[2], 5)}</span>
          )}
        </Card.Subtitle>
        <Card.Text>Token: {getAddressToken(sweepstake[3])}</Card.Text>
        <Card.Text>Total Staked: {ethers.utils.formatEther(sweepstake[5])}</Card.Text>
        <Card.Text>
          Time:{' '}
          {CountdownTimer(
            typeof sweepstake[4] === 'object' ? Number(sweepstake[4]) * 1000 : sweepstake[4] * 1000
          )}
        </Card.Text>
        <Card.Text>
          <span>Metadata: {sweepstake[1]}</span>
        </Card.Text>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => beforeStake(nftID, getAddressToken(sweepstake[3]))}
        >
          STAKE
        </button>
        {sweepstake[2] === address ? (
          <button style={buttonStyle} onClick={() => draw(sweepstake[0])} type="button">
            DRAW
          </button>
        ) : null}
      </Card.Body>
      <div className="d-flex justify-content-center">
        <Card.Link href={`/sweepstake/${nftID}`}>NFT Details</Card.Link>
      </div>
    </Card>
  );
};

const Home = () => {
  const { performActions, address, kit } = useContractKit();
  const [sweepstakesList, setSweepstakesList] = useState([]);

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake,
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const getAllSweepstakesContract = async () => {
    if (address != null)
      try {
        await performActions(async () => {
          const res = await contractSweepstake.methods.getAllSweepstakes().call();
          setSweepstakesList(res);
        });
      } catch (e) {
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
      setSweepstakesList(res);
    }
  };

  useEffect(() => {
    getAllSweepstakesContract();
  }, [address]);

  // const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(
  //   ERC721EsolidarSweepstake,
  //   process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE
  // );

  const StakeNFT = async (nftID: number, amount: string) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractSweepstake.methods
          .stake(nftID, ethers.utils.parseEther(amount))
          .estimateGas();

        const res = await contractSweepstake.methods
          .stake(nftID, ethers.utils.parseEther(amount))
          .send({ from: address, gasLimit });

        // Test to now if the "res.status" return the status success or error of transacion
        if (res.status === true)
          sweetAlertSuccess(
            'Success',
            `Stake on NFT ${nftID} with amount ${amount} was successful`
          );
        else
          sweetAlertError(
            'Error',
            `Stake on NFT ${nftID} with amount ${amount} was not successful`
          );

        getAllSweepstakesContract();
      });
    } catch (e) {
      console.log(e);
    }
  };

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
            const question = await SwalQuestion('Do you want to stake now?', '');
            if (question === true) {
              StakeNFT(nftID, String(amount));
            }
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
      inputLabel: 'Amount to stake',
      inputPlaceholder: '0.00',

      preConfirm: async amount => {
        const contractERC20 = new kit.web3.eth.Contract(ERC20, tokenMap[token] || null);

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
            sweetAlertError('Insufficient Balance', 'You need to have more balance to stake');
            return;
          }
          if (Number(amount) > Number(amountOfAllowance)) {
            addMoreAllowance(amount, contractERC20, Number(amountOfAllowance), nftID);
            return;
          }

          StakeNFT(nftID, amount);
        } catch (e) {
          console.table(e);
        }
      },
    });
  };

  const draw = async (nftID: number) => {
    try {
      await performActions(async () => {
        const gasLimit = await contractSweepstake.methods.draw(nftID).estimateGas();

        await contractSweepstake.methods.draw(nftID).send({ from: address, gasLimit });

        sweetAlertSuccess('Success', 'Draw was successful');
        getAllSweepstakesContract();
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="row">
        <div>
          <Navbar />
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>Active campaings</h1>
        </div>
        {sweepstakesList.length > 0 &&
          sweepstakesList
            .filter(sweepstake => !!sweepstake[9])
            .map((sweepstake: any) => (
              <div key={sweepstake.tokenId} className="col-md-4 my-4">
                <CustomCard
                  sweepstake={sweepstake}
                  beforeStake={beforeStake}
                  address={String(address)}
                  draw={draw}
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default Home;
