import Icon from '@esolidar/toolkit/build/elements/icon';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import Dropdown from '@esolidar/toolkit/build/elements/dropdown';
import Button from '@esolidar/toolkit/build/elements/button';
import { SUPPORTED_LOCALES } from '../../constants/locales';

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
        <FormattedMessage
          id="web3.copyright.note"
          defaultMessage="Information provided is general and educational in nature. It is not intended to be, and should not be construed as, legal or tax advice. Rules and regulations regarding tax deductions for charitable giving vary at the country and state level, and laws of a specific country, state or laws relevant to a particular situation may affect the applicability, accuracy, or completeness of the information provided. Please consult a tax advisor about the legal or tax consequences of donating in cryptocurrency. All organization names, logos, and brands are property of their respective owners, and are used on this website for identification purposes only. Use of these names, logos, and brands does not imply endorsement."
        />
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
                  iconRight={<Icon name="ChevronUp" />}
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
      </div>
    </footer>
  );
};

export default Footer;
