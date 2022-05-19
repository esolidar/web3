/* eslint-disable jsx-a11y/anchor-is-valid */

import { useEffect, useState } from 'react';
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
import Logo from './Logo';

interface WalletProps {
  address: any;
  balance: any;
  destroy(): void;
  connect: any;
  setIsNavVisible(val: boolean): void;
}

interface Props {
  isHeaderTransparent: boolean;
  isBottonsTransparent: boolean;
}

const Wallet = ({ address, balance, destroy, connect, setIsNavVisible }: WalletProps) => {
  const intl = useIntl();

  return (
    <div className="wallet">
      {address && balance ? (
        <DropdownLabelGroup
          dropdownItems={[
            {
              id: 0,
              leftIcon: 'DeleteCircle',
              text: intl.formatMessage({ id: 'web3.disconect' }),
              onClick: () => {
                setIsNavVisible(false);
                destroy();
              },
            },
          ]}
          dropdownText={truncateAddress(address, 5)}
          labelText={`${balance} cUSD`}
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
  const intl = useIntl();
  const { address, connect, destroy } = useContractKit();
  const { balance, getBalances } = useGetBalance();
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const dynamicRoute = useRouter().asPath;

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
      <Link href={getRoute.HOME(intl.locale)}>
        <a className="home-logo">
          <div className="logo logo-web">
            {isHeaderTransparent && <LogoWhite />}
            {!isHeaderTransparent && <Logo />}
          </div>

          <img
            src="https://static.esolidar.com/frontend/logo/esolidar/logo-xsmall.svg"
            className="logo logo-mobile"
            alt="esolidar"
          />
        </a>
      </Link>

      <nav className="header__menu">
        <div className={classnames('header__menu-item', { active: locationIncludes('discover') })}>
          <Link href={getRoute.DISCOVER(intl.locale)}>
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
            />
            <div
              className={classnames('header__menu-item', { active: locationIncludes('discover') })}
            >
              <Link href={getRoute.DISCOVER(intl.locale)}>
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
