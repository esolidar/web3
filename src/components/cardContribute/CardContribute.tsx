import Icon from '@esolidar/toolkit/build/elements/icon';
import Button from '@esolidar/toolkit/build/elements/button';
import truncateAddress from '../../utils/truncateAddress';
import useToast from '../../hooks/useToast/useToast';

interface Props {
  name: string;
  address: string;
  onClickDonate(): void;
  onClickShare(): void;
}

const CardContribute = ({ name, address, onClickDonate, onClickShare }: Props) => {
  const toast = useToast();

  // const valora = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=celo://wallet/pay?address=0x7F38B1585d55A9bc881da27e2FB927d0db30fD41&displayName=esolidar&chld=L%7C0`;
  const metamask = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=wc:099df4c1-8d6d-4432-b6b1-f8fe5e243efe@1?bridge=https%3A%2F%2Fz.bridge.walletconnect.org&key=2625629f0670a8a5d660471621a727effbdaf28d32b23fa7a34ccfa143779bb7
  &displayName=esolidar&chld=L%7C0`;

  const handleClickAddress = () => {
    // const url = `https://explorer.celo.org/address/${address}/transactions`;
    const url = String(process.env.NEXT_PUBLIC_ADDRESS_DETAILS_URL).replace('{{address}}', address);
    window.open(url, '_blank');
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Successfully copied address');
  };

  return (
    <div className="card-contribute">
      <h3 className="card-contribute__header">Contribute in Celo Dollar </h3>
      <p className="card-contribute__header-description body-small">
        100% of your donation goes to {name}
      </p>
      <img className="card-contribute__qr-code" alt={String(address)} src={metamask} />
      <div className="card-contribute__address">
        <Button extraClass="link" text={truncateAddress(address, 5)} onClick={handleClickAddress} />
        <Button
          extraClass="primary-full"
          icon={<Icon name="Copy" size="sm" />}
          onClick={handleCopyAddress}
          ghost
          size="sm"
          type="icon"
        />
      </div>
      <div className="card-contribute__actions">
        <Button
          extraClass="primary-full"
          text="Donate cUSD"
          onClick={onClickDonate}
          size="lg"
          fullWidth
        />
        <Button
          extraClass="secondary"
          text="Share"
          onClick={onClickShare}
          size="lg"
          iconLeft={<Icon name="Share3" />}
          fullWidth
        />
      </div>
    </div>
  );
};

export default CardContribute;
