/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Icon from '@esolidar/toolkit/build/elements/icon';
import Button from '@esolidar/toolkit/build/elements/button';
import CustomModal from '@esolidar/toolkit/build/elements/customModal';
import getOdsList from '@esolidar/toolkit/build/utils/getOdsList';
import odsExternasLinks from '../../constants/odsExternalLinks';

interface Props {
  sdgList: any;
}

const CardSDG = ({ sdgList }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const intl = useIntl();
  const router = useRouter();

  const formattedSDGs = getOdsList(sdgList, String(router.locale), intl.formatMessage);

  return (
    <div className="card-sdg">
      <h3 className="card-sdg__header">
        {intl.formatMessage({ id: 'toolkit.accelerator.appForm.form.sdgs' })}
        <a
          className="card-sdg__info-icon"
          onClick={() => setOpenModal(true)}
          onKeyDown={() => setOpenModal(true)}
          role="presentation"
        >
          <Icon name="InfoBold" size="sm" />
        </a>
      </h3>
      <p className="card-sdg__header-description body-small">
        This charity or cause supports the following UN SDGs to achieve a better and more
        sustainable future for all
      </p>
      <div className="card-project-detail__ods-section--list">
        {formattedSDGs.map((sdg: any) => (
          <img key={sdg.id} src={sdg.image} alt={sdg.name} data-testid="ods-image" />
        ))}
      </div>
      <CustomModal
        show={openModal}
        onHide={() => setOpenModal(false)}
        size="md"
        title={intl.formatMessage({ id: 'toolkit.card-project-detail.sdg.info.title' })}
        dialogClassName="card-sdg__info-modal"
        backdrop="static"
        showFooter={false}
        bodyChildren={
          <div>
            <p>
              {intl.formatMessage({
                id: 'toolkit.card-project-detail.sdg.info.description',
              })}
            </p>
            <Button
              className="popover-btn m-0 p-0"
              extraClass="link"
              href={odsExternasLinks[String(router.locale)] || odsExternasLinks}
              target="_blank"
              text={intl.formatMessage({ id: 'toolkit.learn-more' })}
              size="sm"
            />
          </div>
        }
      />
    </div>
  );
};

export default CardSDG;
