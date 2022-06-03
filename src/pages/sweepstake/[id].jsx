import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ethers } from 'ethers';
import { Card, ListGroup, ListGroupItem, Table } from 'react-bootstrap';
import Sweepstake from '../../abi/EsolidarSweepstake.json';
import Navbar from '../../components/sweepstake/Navbar';

const searchTokenByID = () => {
  const { query } = useRouter();
  const { kit } = useContractKit();

  const [currentNft, setCurrentNft] = useState(0);

  const contractSweepstake = new kit.web3.eth.Contract(
    Sweepstake,
    process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE
  );

  const getNftDetails = async () => {
    const nftDetails = await contractSweepstake.methods.getSweepstakeWithDonors(query.id).call();
    setCurrentNft(nftDetails);
  };

  useEffect(() => {
    if (query.id !== null || query.id !== undefined) getNftDetails();
  }, [query.id]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div>
        <Navbar />
      </div>
      <div>
        <h1>Token Details</h1>
      </div>

      <div className="d-flex flex-column">
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>NFT ID: {currentNft[0]}</Card.Title>
            <Card.Text>Owner: {currentNft[2]}</Card.Text>
            <Card.Text>Token: {currentNft[3]}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Duration: {currentNft[4]}</ListGroupItem>
            <ListGroupItem>Total Staked: {currentNft[5]}</ListGroupItem>
            <ListGroupItem>Winner: {currentNft[6]}</ListGroupItem>
            <ListGroupItem>DrawTimeStamp: {currentNft[7]}</ListGroupItem>
            <ListGroupItem>Active: {currentNft[9] ? 'Active' : 'Deactive'}</ListGroupItem>
            <ListGroupItem>
              Destroyed: {currentNft[10] ? 'Destroyed' : 'Not Destroyed'}
            </ListGroupItem>
            <ListGroupItem>Metadado: {currentNft[1]}</ListGroupItem>
          </ListGroup>
        </Card>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Address:</th>
            <th>Value staked:</th>
          </tr>
        </thead>
        <tbody>
          {currentNft[8]?.map(donor => (
            <tr>
              <td>{donor[0]}</td>
              <td>{ethers.utils.formatEther(donor[1])}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default searchTokenByID;
