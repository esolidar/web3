import { IntlShape, useIntl } from 'react-intl';
import Icon from '@esolidar/toolkit/build/elements/icon';
import Tooltip from '@esolidar/toolkit/build/elements/tooltip';
import Button from '@esolidar/toolkit/build/elements/button';
import truncateAddress from '../../utils/truncateAddress';
import useToast from '../../hooks/useToast/useToast';
import openCeloAddress from '../../utils/openCeloAddress';
import generateValoraQRCode from '../../utils/generateValoraQRCode';

interface Props {
  name: string;
  address: string;
  onClickDonate(): void;
  onClickShare(): void;
}

const CardContribute = ({ name, address, onClickDonate, onClickShare }: Props) => {
  const intl: IntlShape = useIntl();
  const toast = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success(intl.formatMessage({ id: 'web3.copied' }));
  };

  const qrCode = generateValoraQRCode(address, name);

  return (
    <div className="card-contribute">
      <h3 className="card-contribute__header">
        {intl.formatMessage({ id: 'web3.CardContribute.title' })}
        <Tooltip
          overlay={intl.formatMessage({ id: 'web3.CardContribute.popover' })}
          trigger={['hover', 'click']}
          tooltipBodyChild={<Icon name="InfoBold" size="sm" />}
        />
      </h3>
      <p className="card-contribute__header-description body-small">
        {intl.formatMessage({ id: 'web3.CardContribute.subtitle' }, { nonProfitName: name })}
      </p>
      <img className="card-contribute__qr-code" alt={String(address)} src={qrCode} />
      <div className="card-contribute__address">
        <Button
          extraClass="link"
          text={truncateAddress(address, 5)}
          onClick={() => openCeloAddress(address)}
        />
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
          text={`${intl.formatMessage({ id: 'web3.donate' })} cUSD`}
          onClick={onClickDonate}
          size="lg"
          fullWidth
        />
        <Button
          extraClass="secondary"
          text={intl.formatMessage({ id: 'web3.share' })}
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
