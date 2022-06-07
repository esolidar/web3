import Icon from '@esolidar/toolkit/build/elements/icon';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import Dropdown from '@esolidar/toolkit/build/elements/dropdown';
import Button from '@esolidar/toolkit/build/elements/button';
import { SUPPORTED_LOCALES } from '../../constants/locales';
import SOCIAL_MEDIA from '../../constants/socialMedia';
import useIsSSR from '../../hooks/useIsSSR/useIsSSR';

const footerItems = [
  {
    id: 0,
    href: `${process.env.NEXT_PUBLIC_COMMUNITY_URL}policy`,
    text: 'web3.privacy.policy',
  },
  {
    id: 1,
    href: `${process.env.NEXT_PUBLIC_COMMUNITY_URL}terms`,
    text: 'web3.terms.conditions',
  },
  {
    id: 2,
    href: `${process.env.NEXT_PUBLIC_COMMUNITY_URL}cookies`,
    text: 'web3.cookie.policy',
  },
];

const Footer = () => {
  const router = useRouter();
  const intl = useIntl();
  const isSSR = useIsSSR();
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
    <footer className={classnames('footer', { 'footer-detail': isInstitutionDetailPage })}>
      <div className="footer-copyright">
        <FormattedMessage id="web3.copyright.note" />
      </div>

      <div className="footer-menu">
        <div>
          {intl.formatMessage(
            {
              id: 'web3.all.right.reserved',
            },
            { year }
          )}
        </div>
        {footerItems.map(item => (
          <div className="footer-menu__item" key={item.id}>
            <a href={item.href} target="_blank" rel="noreferrer">
              <FormattedMessage id={item.text} />
            </a>
          </div>
        ))}
        <div className="footer-menu__item--separator" />
        <div className="powered-by-esolidar">
          Powered by{' '}
          <a href={process.env.NEXT_PUBLIC_ESOLIDAR_URL} target="_blank" rel="noreferrer">
            esolidar
          </a>
        </div>

        <div className="footer-menu__lang">
          <div className="powered-by-esolidar mobile">
            Powered by{' '}
            <a href={process.env.NEXT_PUBLIC_ESOLIDAR_URL} target="_blank" rel="noreferrer">
              esolidar
            </a>
          </div>
          {!isSSR && (
            <div className="footer-menu__lang--dropdown">
              <Icon name="Language" />
              <Dropdown
                customButton={
                  <Button
                    extraClass="primary-full"
                    text={currentLocale}
                    iconRight={<Icon name="ChevronDown" />}
                    size="sm"
                    ghost
                    onClick={() => {}}
                  />
                }
                items={[
                  {
                    id: 0,
                    onClick: () => handleChangeLang(SUPPORTED_LOCALES.PT.id),
                    text: SUPPORTED_LOCALES.PT.name,
                  },
                  {
                    id: 1,
                    onClick: () => handleChangeLang(SUPPORTED_LOCALES.BR.id),
                    text: SUPPORTED_LOCALES.BR.name,
                  },
                  {
                    id: 2,
                    onClick: () => handleChangeLang(SUPPORTED_LOCALES.EN.id),
                    text: SUPPORTED_LOCALES.EN.name,
                  },
                ]}
              />
            </div>
          )}
        </div>
        <div className="footer-menu__social">
          <Button
            extraClass="primary-full"
            type="icon"
            icon={<Icon name="Twitter" size="md" />}
            onClick={() => window.open(SOCIAL_MEDIA.twitter, '_blank')}
            ghost
          />
          <Button
            extraClass="primary-full"
            type="icon"
            icon={<Icon name="Linkedin" size="md" />}
            onClick={() => window.open(SOCIAL_MEDIA.linkedin, '_blank')}
            ghost
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
