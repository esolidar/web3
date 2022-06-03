import { useIntl, FormattedMessage, IntlShape } from 'react-intl';
import { useRouter } from 'next/router';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import Button from '@esolidar/toolkit/build/elements/button';
import { useContractKit } from '@celo-tools/use-contractkit';
import getRoute from '../../routes';
import useIsSSR from '../../hooks/useIsSSR/useIsSSR';

const Hero = () => {
  const intl: IntlShape = useIntl();
  const router = useRouter();
  const { address, connect } = useContractKit();
  const isSSR = useIsSSR();

  const handleClickDiscover = () => {
    router.push(getRoute.DISCOVER(String(router.locale)));
  };

  return (
    <div className="hero">
      <div className="hero__background" />
      <img
        src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/hero/hero-blur.svg`}
        alt="hero-blur"
        id="shape-1"
      />

      <Viewport centred size="xl">
        <div className="hero__content">
          <div>
            <h1>
              <FormattedMessage id="web3.hero.title" />
              <span>
                <FormattedMessage id="web3.hero.title.help" />
              </span>
            </h1>
            <p>
              <FormattedMessage id="web3.hero.subtitle" />
            </p>
            <div className="hero__content--actions">
              {!isSSR && (
                <Button
                  disabled={address}
                  extraClass="primary-full"
                  text={
                    address
                      ? intl.formatMessage({ id: 'web3.connected.wallet' })
                      : intl.formatMessage({ id: 'web3.connect.wallet' })
                  }
                  size="lg"
                  onClick={() => {
                    connect().catch((e: any) => console.log(e));
                  }}
                />
              )}
              <Button
                extraClass="secondary"
                text={intl.formatMessage({ id: 'web3.hero.causes' })}
                size="lg"
                onClick={handleClickDiscover}
                ghost
              />
            </div>
          </div>
          <div className="hero__content--illustration">
            <img
              src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/hero/hero-illustration.svg`}
              alt="hero-illustration"
            />
          </div>
        </div>
      </Viewport>
    </div>
  );
};

export default Hero;
