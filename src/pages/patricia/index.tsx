/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useCallback } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import Button from '@esolidar/toolkit/build/elements/button';
import useDonateCeloCUSD from '../../hooks/useDonate/useDonate';
import DonationModal from '../../components/donationModal';
import ThankYouModal from '../../components/successModal';
import useGetBalance from '../../hooks/useGetBalance/useGetBalance';
import { Form } from '../../components/donationModal/DonationModal.types';

const Home = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(true);

  const toMitch = '0x05acb060719720756973ac0F943EbaD3D3A2CCBA';

  const donateWithCUSD = useDonateCeloCUSD();

  const { balance, getBalances } = useGetBalance();
  const { address, connect } = useContractKit();

  const handledonateWithCUSD = useCallback(
    (form: Form) =>
      donateWithCUSD(toMitch, `${form.amount}`)
        .then(() => {
          if (address) getBalances();
          setOpenSuccess(true);
          setOpenModal(false);
          return Promise.resolve(true);
        })
        .catch(error => Promise.resolve(error)),
    [address, toMitch]
  );

  const handleClickDonate = useCallback(() => {
    if (address) {
      setOpenModal(true);
    } else {
      connect()
        .then(() => setOpenModal(true))
        .catch((e: any) => console.log(e));
    }
  }, [address]);

  useEffect(() => {
    getBalances();
  }, []);

  return (
    <div className="container">
      <main className="main">
        <h1>Patrícia</h1>
        <Button onClick={() => handleClickDonate()} extraClass="primary-full" text="Donate" />

        <DonationModal
          openModal={openModal && !!address}
          balance={balance}
          nonProfitName="Xpto"
          onCloseModal={() => setOpenModal(false)}
          onclickDonate={form => handledonateWithCUSD(form)}
        />
        <ThankYouModal
          transitionID="121212"
          openModal={openSuccess}
          onCloseModal={() => setOpenSuccess(false)}
          shareProps={{ title: 'teste', windowLocationHref: 'loree' }}
        />
      </main>
    </div>
  );
};

export default Home;
