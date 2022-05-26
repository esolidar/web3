import { useIntl, FormattedMessage, IntlShape } from 'react-intl';
import { useRouter } from 'next/router';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import Button from '@esolidar/toolkit/build/elements/button';
import { useContractKit } from '@celo-tools/use-contractkit';
import getRoute from '../../routes';
import useIsSSR from '../../hooks/useIsSSR/useIsSSR';
import HomeIllustration from '../homeIllustration/HomeIllustration';

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
      <svg
        id="shape-1"
        width="932"
        height="1101"
        viewBox="0 0 932 1101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.32" filter="url(#filter0_f_11391_391272)">
          <path
            d="M630.998 844.343L541.267 640.2L256.812 510.51L421.139 256.722L733.623 335.072L892.312 760.977L630.998 844.343Z"
            fill="#FFCB77"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_11391_391272"
            x="0.811646"
            y="0.72168"
            width="1147.5"
            height="1099.62"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="128" result="effect1_foregroundBlur_11391_391272" />
          </filter>
        </defs>
      </svg>
      <svg
        id="shape-2"
        width="1121"
        height="1179"
        viewBox="0 0 1121 1179"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.32" filter="url(#filter0_f_11391_391271)">
          <path
            d="M354.435 344.591L727.667 385.613L1156.27 80L1388 533.292L1010.67 923L256 795.832L354.435 344.591Z"
            fill="#93EDE3"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_11391_391271"
            x="0"
            y="-176"
            width="1644"
            height="1355"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="128" result="effect1_foregroundBlur_11391_391271" />
          </filter>
        </defs>
      </svg>

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
            <HomeIllustration />
          </div>
        </div>
      </Viewport>
    </div>
  );
};

export default Hero;
