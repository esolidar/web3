import { Alert as AlertBTS } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import ToastToolkit from '@esolidar/toolkit/build/elements/toast';
import Banner from '@esolidar/toolkit/build/elements/banner';
import useInterval from '@esolidar/toolkit/build/hooks/useInterval';
import IAlert from '../../interfaces/alert';

interface Props {
  alert: IAlert;
  onRemove(id: number): void;
}

const Alert = ({ alert, onRemove }: Props) => {
  const intl = useIntl();
  const { id, type = 'banner', status = 'success', title, subtitle, onClose, variant } = alert;

  useInterval(() => {
    onRemove(Number(id));
  }, 5000);

  const handleClose = () => {
    if (onClose) onClose();
    onRemove(Number(id));
  };

  return (
    <div>
      {type === 'toast' ? (
        <AlertBTS style={{ justifyContent: variant === 'description' ? 'end' : 'center' }}>
          <ToastToolkit
            variant={variant}
            status={status}
            title={title ? intl.formatMessage({ id: title }) : undefined}
            subtitle={subtitle ? intl.formatMessage({ id: subtitle }) : undefined}
            onClose={handleClose}
            boxShadow
          />
        </AlertBTS>
      ) : (
        <AlertBTS>
          <Banner
            variant={variant}
            status={status}
            title={title ? intl.formatMessage({ id: title }) : undefined}
            subtitle={subtitle ? intl.formatMessage({ id: subtitle }) : undefined}
            boxShadow
          />
        </AlertBTS>
      )}
    </div>
  );
};

export default Alert;
