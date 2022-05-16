/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContractKit } from '@celo-tools/use-contractkit';
import Button from '@esolidar/toolkit/build/elements/button';
import DropdownLabelGroup from '@esolidar/toolkit/build/elements/dropdownLabelGroup';
import Link from 'next/link';
import classnames from 'classnames';
import { useEffect } from 'react';
import useGetBalance from '../hooks/useGetBalance/useGetBalance';
import truncateAddress from '../utils/truncateAddress';

const Header = () => {
  const { address, connect, destroy } = useContractKit();
  const { balance, getBalances } = useGetBalance();

  useEffect(() => {
    if (address) getBalances();
  }, [address]);

  const locationIncludes = (path: string) =>
    typeof window !== 'undefined' ? window.location.href.includes(path) : '';

  return (
    <header className="header">
      <Link href="/">
        <a className="home-logo">
          <img
            src="https://static.esolidar.com/frontend/logo/esolidar/logo.svg"
            className="logo"
            alt=""
          />
        </a>
      </Link>

      <div className="header__menu">
        <div className={classnames('header__menu-item', { active: locationIncludes('discover') })}>
          <Link href="/discover">
            <a>Discover</a>
          </Link>
        </div>
        <div
          className={classnames('header__menu-item', { active: locationIncludes('how-it-works') })}
        >
          <Link href="/how-it-works">
            <a>How it works</a>
          </Link>
        </div>
        <div className="header__menu-connect-button">
          {address && balance ? (
            <DropdownLabelGroup
              dropdownItems={[
                {
                  id: 0,
                  leftIcon: 'DeleteCircle',
                  text: 'Disconect',
                  onClick: destroy,
                },
              ]}
              dropdownText={truncateAddress(address, 5)}
              labelText={`${balance} cUSD`}
            />
          ) : (
            <Button
              extraClass="secondary"
              text="Connect wallet"
              size="md"
              onClick={() => connect().catch(e => console.log(e))}
            />
            // <button type="button" onClick={() => connect().catch(e => console.log(e))}>
            //   Connect wallet
            // </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
