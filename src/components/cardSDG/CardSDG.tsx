import { useIntl } from 'react-intl';
import Icon from '@esolidar/toolkit/build/elements/icon';
import Button from '@esolidar/toolkit/build/elements/button';
import Popover from '@esolidar/toolkit/build/elements/popover';
import getOdsList from '@esolidar/toolkit/build/utils/getOdsList';

interface Props {
  sdgList: any;
}

export type IOdsPopoverLink = {
  [key in string]: string;
};

const odsPopoverLink: IOdsPopoverLink = {
  pt: 'https://www.ods.pt/',
  en: 'https://brasil.un.org/pt-br/',
  br: 'https://sdgs.un.org/goals',
};

const CardSDG = ({ sdgList }: Props) => {
  const intl = useIntl();

  const formattedSDGs = getOdsList(sdgList, intl.locale, intl.formatMessage);

  return (
    <div className="card-sdg">
      <h3 className="card-sdg__header">
        {intl.formatMessage({ id: 'toolkit.accelerator.appForm.form.sdgs' })}
        <Popover
          className="projects-list__filters-popover-body"
          overlayTrigger={<Icon name="InfoBold" size="sm" />}
          size="md"
          popoverBodyChildren={
            <div>
              <h3>{intl.formatMessage({ id: 'toolkit.card-project-detail.sdg.info.title' })}</h3>
              <p>
                {intl.formatMessage({
                  id: 'toolkit.card-project-detail.sdg.info.description',
                })}
              </p>
              <Button
                className="popover-btn"
                extraClass="link"
                href={odsPopoverLink[intl.locale] || odsPopoverLink.en}
                target="_blank"
                text={intl.formatMessage({ id: 'toolkit.learn-more' })}
              />
            </div>
          }
        />
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
    </div>
  );
};

export default CardSDG;
