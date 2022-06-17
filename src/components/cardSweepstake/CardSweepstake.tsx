import { Card } from 'react-bootstrap';
import { ethers } from 'ethers';
import Button from '@esolidar/toolkit/build/elements/button';
import CountdownTimer from '../countdownTimer/CountdownTimer';
import truncateAddress from '../../utils/truncateAddress';
import getAddressToken from '../../utils/getAddressToken';
import { ISweepstake } from '../../pages/sweepstake/mysweepstakes';

interface Props {
  sweepstake: ISweepstake;
  beforeStake(nftID: number, token: string): any;
  address: string;
  onClickDraw(nftID: number): any;
}

const CardSweepstake = ({ sweepstake, beforeStake, address, onClickDraw }: Props) => {
  const nftID = typeof sweepstake[0] === 'object' ? Number(sweepstake[0]) : sweepstake[0];
  const isOwner = sweepstake[2] === address;

  return (
    <Card style={{ width: '18rem', borderRadius: '10px' }}>
      <Card.Body>
        <Card.Title>NFT ID: {nftID}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {isOwner ? (
            <span>You are the owner</span>
          ) : (
            <span>Owner: {truncateAddress(sweepstake[2], 5)}</span>
          )}
        </Card.Subtitle>
        <Card.Text>Token: {getAddressToken(sweepstake[3])}</Card.Text>
        <Card.Text>Total Donated: {ethers.utils.formatEther(sweepstake[5])}</Card.Text>
        <Card.Text>
          Time: <CountdownTimer date={Number(sweepstake[4]) * 1000} />
        </Card.Text>
        <Card.Text>
          <span>Metadata: {sweepstake[1]}</span>
        </Card.Text>
        <Button
          extraClass="primary-full"
          onClick={() => beforeStake(Number(nftID), getAddressToken(sweepstake[3]))}
          text="Donate"
          fullWidth
        />
        {isOwner && (
          <Button
            extraClass="primary-full"
            className="mt-2"
            onClick={() => onClickDraw(Number(sweepstake[0]))}
            text="Draw"
            fullWidth
          />
        )}
        <Button
          extraClass="primary-full"
          className="mt-2"
          href={`/sweepstake/${nftID}`}
          text="NFT Details"
          fullWidth
          ghost
        />
      </Card.Body>
    </Card>
  );
};

export default CardSweepstake;
