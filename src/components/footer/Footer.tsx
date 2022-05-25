import Icon from '@esolidar/toolkit/build/elements/icon';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import Dropdown from '@esolidar/toolkit/build/elements/dropdown';
import Button from '@esolidar/toolkit/build/elements/button';
import { SUPPORTED_LOCALES } from '../../constants/locales';
import SOCIAL_MEDIA from '../../constants/socialMedia';

const Footer = () => {
  const router = useRouter();
  const intl = useIntl();
  const {
    query: { id },
    pathname,
  } = router;

  const handleChangeLang = (locale: string) => {
    const newRoute = `/${locale}${pathname}`;
    router.push(
      {
        pathname: newRoute,
        query: { id },
      },
      newRoute,
      { locale }
    );
  };

  const year: number = new Date().getFullYear();
  const isInstitutionDetailPage: boolean = pathname === '/discover/[id]';
  const currentLocale = Object.values(SUPPORTED_LOCALES).find(
    i => i.id === String(router.locale)
  )?.name;

  return (
    <footer className={`footer-component ${isInstitutionDetailPage && 'footer-component__detail'}`}>
      <div className="footer-component__copyright">
        <FormattedMessage id="web3.copyright.note" />
      </div>

      <div className="footer-component__menu">
        <div>
          {intl.formatMessage(
            {
              id: 'web3.all.right.reserved',
            },
            { year }
          )}
        </div>
        <div className="footer-component__menu-item">
          <a
            href={`${process.env.NEXT_PUBLIC_ESOLIDAR_URL}policy`}
            target="_blank"
            rel="noreferrer"
          >
            <FormattedMessage id="web3.privacy.policy" />
          </a>
        </div>
        <div className="footer-component__menu-item">
          <a href={`${process.env.NEXT_PUBLIC_ESOLIDAR_URL}terms`} target="_blank" rel="noreferrer">
            <FormattedMessage id="web3.terms.conditions" />
          </a>
        </div>
        <div className="footer-component__menu-item">
          <a
            href={`${process.env.NEXT_PUBLIC_ESOLIDAR_URL}cookies`}
            target="_blank"
            rel="noreferrer"
          >
            <FormattedMessage id="web3.cookie.policy" />
          </a>
        </div>
        <div className="footer-component__menu-item-separator" />
        <div className="power-by-esolidar">
          Powered by <strong>esolidar</strong>
        </div>

        <div className="change-language">
          <div className="power-by-esolidar-mobile">
            Powered by <strong>esolidar</strong>
          </div>
          <div className="change-lang">
            <Icon name="Language" />
            <Dropdown
              customButton={
                <Button
                  extraClass="primary-full btn-change-lang"
                  ghost
                  iconRight={<Icon name="ChevronDown" />}
                  isLoading={false}
                  onClick={() => {}}
                  size="sm"
                  text={currentLocale}
                  theme="light"
                  type="button"
                  withLoading={false}
                />
              }
              items={[
                {
                  id: 0,
                  onClick: () => handleChangeLang(SUPPORTED_LOCALES.PT.id),
                  text: SUPPORTED_LOCALES.PT.name,
                },
                {
                  id: 0,
                  onClick: () => handleChangeLang(SUPPORTED_LOCALES.BR.id),
                  text: SUPPORTED_LOCALES.BR.name,
                },
                {
                  id: 0,
                  onClick: () => handleChangeLang(SUPPORTED_LOCALES.EN.id),
                  text: SUPPORTED_LOCALES.EN.name,
                },
              ]}
            />
          </div>
        </div>
        <div className="footer-component__social-icons">
          <Button
            href={SOCIAL_MEDIA.twitter}
            target="_blank"
            rel="noreferrer"
            size="sm"
            type="link"
            icon={<Icon name="Twitter" size="md" />}
          />
          <Button
            href={SOCIAL_MEDIA.linkedin}
            target="_blank"
            rel="noreferrer"
            size="sm"
            type="link"
            icon={<Icon name="Linkedin" size="md" />}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
