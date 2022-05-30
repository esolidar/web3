/* eslint-disable jsx-a11y/anchor-is-valid */

import { useEffect, useState, useContext } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@esolidar/toolkit/build/elements/button';
import Icon from '@esolidar/toolkit/build/elements/icon';
import DropdownLabelGroup from '@esolidar/toolkit/build/elements/dropdownLabelGroup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import useGetBalance from '../../hooks/useGetBalance/useGetBalance';
import truncateAddress from '../../utils/truncateAddress';
import getRoute from '../../routes';
import LogoWhite from './LogoWhite';
import AppContext from '../../contexts/AppContext';
import rampCheckout from '../../utils/rampCheckout';
import openCeloAddress from '../../utils/openCeloAddress';

interface WalletProps {
  address: any;
  balance: any;
  destroy(): void;
  connect: any;
  setIsNavVisible(val: boolean): void;
  isBottonsTransparent: boolean;
  fullWidth: boolean;
}

interface Props {
  isHeaderTransparent: boolean;
  isBottonsTransparent: boolean;
}

const Wallet = ({
  address,
  balance,
  destroy,
  connect,
  setIsNavVisible,
  isBottonsTransparent,
  fullWidth,
}: WalletProps) => {
  const intl = useIntl();

  const { getBalances } = useGetBalance();

  return (
    <div className="wallet">
      {address ? (
        <DropdownLabelGroup
          dropdownItems={[
            {
              id: 0,
              leftIcon: 'ExternalLink',
              text: intl.formatMessage({ id: 'web3.view.celo' }),
              onClick: () => {
                setIsNavVisible(false);
                openCeloAddress(address);
              },
            },
            {
              id: 1,
              leftIcon: 'X',
              text: intl.formatMessage({ id: 'web3.disconect' }),
              onClick: () => {
                setIsNavVisible(false);
                destroy();
              },
            },
            {
              id: 2,
              divider: true,
            },
            {
              id: 3,
              leftIcon: 'CreditCard',
              text: intl.formatMessage({ id: 'web3.add.founs' }),
              onClick: () => {
                setIsNavVisible(false);
                rampCheckout(getBalances, address, 'PT');
              },
            },
          ]}
          dropdownText={truncateAddress(address, 5)}
          labelText={balance !== null ? `${balance} cUSD` : '•••'}
          transparent={isBottonsTransparent}
          fullWidth={fullWidth}
        />
      ) : (
        <Button
          extraClass="secondary"
          text={intl.formatMessage({ id: 'web3.connect.wallet' })}
          size="md"
          onClick={() => {
            setIsNavVisible(false);
            connect().catch((e: any) => console.log(e));
          }}
        />
      )}
    </div>
  );
};

const Header = ({ isHeaderTransparent, isBottonsTransparent }: Props) => {
  const router = useRouter();
  const { address, connect, destroy } = useContractKit();

  const { getBalances } = useGetBalance();
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const dynamicRoute = useRouter().asPath;

  const context = useContext(AppContext);
  const { balance } = context;

  useEffect(() => {
    setIsNavVisible(false);
  }, [dynamicRoute]);

  useEffect(() => {
    if (address) getBalances();
  }, [address]);

  const locationIncludes = (path: string) =>
    typeof window !== 'undefined' ? window.location.href.includes(path) : '';

  return (
    <header
      className={classnames(
        'header',
        { 'home-page-header': isHeaderTransparent },
        { 'home-page-header-buttons': isBottonsTransparent }
      )}
    >
      <Link href={getRoute.HOME(String(router.locale))}>
        <a className="home-logo">
          <div className="logo logo-web">
            {isHeaderTransparent && <LogoWhite />}
            {!isHeaderTransparent && (
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/logo/esolidar-web3-desk.svg`}
                className="white"
                alt="esolidar"
              />
            )}
          </div>

          <img
            src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/logo/esolidar-web3-mobile.svg`}
            className="logo logo-mobile"
            alt="esolidar"
          />
        </a>
      </Link>
      <nav className="header__menu">
        <div className={classnames('header__menu-item', { active: locationIncludes('discover') })}>
          <Link href={getRoute.DISCOVER(String(router.locale))}>
            <a>
              <FormattedMessage id="web3.institution.list.title" />
            </a>
          </Link>
        </div>
        {/* <div
          className={classnames('header__menu-item', { active: locationIncludes('how-it-works') })}
        >
          <Link href="/how-it-works">
            <a>How it works</a>
          </Link>
        </div> */}
        <div className="header__menu-connect-button">
          <Wallet
            address={address}
            balance={balance}
            destroy={destroy}
            connect={connect}
            setIsNavVisible={setIsNavVisible}
            isBottonsTransparent={isBottonsTransparent}
            fullWidth={false}
          />
        </div>
      </nav>

      <div className="mobile-menu-burger">
        <Button
          extraClass="primary-full"
          ghost
          icon={<Icon size="sm" name={isNavVisible ? 'X' : 'AlignJustify'} />}
          isLoading={false}
          onClick={() => setIsNavVisible(!isNavVisible)}
          size="sm"
          theme="light"
          type="icon"
        />
      </div>

      {isNavVisible && (
        <div className="mobile-menu">
          <nav>
            <Wallet
              address={address}
              balance={balance}
              destroy={destroy}
              connect={connect}
              setIsNavVisible={setIsNavVisible}
              isBottonsTransparent={false}
              fullWidth
            />
            <div
              className={classnames('header__menu-item', { active: locationIncludes('discover') })}
            >
              <Link href={getRoute.DISCOVER(String(router.locale))}>
                <a>
                  <FormattedMessage id="web3.institution.list.title" />
                </a>
              </Link>
            </div>
            {/* <div
              className={classnames('header__menu-item', {
                active: locationIncludes('how-it-works'),
              })}
            >
              <Link href="/how-it-works">
                <a>How it works</a>
              </Link>
            </div> */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
