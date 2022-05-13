/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContractKit } from '@celo-tools/use-contractkit';
import Button from '@esolidar/toolkit/build/elements/button';
import DropdownLabelGroup from '@esolidar/toolkit/build/elements/dropdownLabelGroup';
import Link from 'next/link';
import { useEffect } from 'react';
import useGetBalance from '../hooks/useGetBalance/useGetBalance';

const Header = () => {
  const { address, connect, destroy } = useContractKit();
  const { balance, getBalances } = useGetBalance();

  useEffect(() => {
    if (address) getBalances();
  }, [address]);

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
        <div className="header__menu-item active">
          <Link href="/">
            <a>Discover</a>
          </Link>
        </div>
        <div className="header__menu-item">
          <Link href="/">
            <a>How it works</a>
          </Link>
        </div>
        <div className="header__menu-connect-button">
          {address ? (
            <DropdownLabelGroup
              dropdownItems={[
                {
                  id: 0,
                  leftIcon: 'DeleteCircle',
                  text: 'Disconect',
                },
              ]}
              dropdownText={address}
              labelText={`${balance}cUSD`}
            />
          ) : (
            //   <>
            //     {address}
            //     <button
            //       type="button"
            //       onClick={() => {
            //         debugger;
            //         getBalances();
            //       }}
            //     >
            //       getBalances
            //     </button>
            //     {/* <button type="button" onClick={transfer}>
            //   Transfer
            // </button> */}
            //     <button type="button" onClick={destroy}>
            //       Disconnect
            //     </button>
            //   </>
            <Button
              extraClass="secondary"
              text="Connect wallet"
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
