/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import Button from '@esolidar/toolkit/build/elements/button';
import useDonateCeloCUSD from '../../hooks/useDonate/useDonate';
import DonationModal from '../../components/donationModal';
import ThankYouModal from '../../components/successModal';
import useGetBalance from '../../hooks/useGetBalance/useGetBalance';

const Home = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const toMitch = '0x7335966f30FC589347793e3C2FE378549b8604B4';

  const donateWithCUSD = useDonateCeloCUSD();

  const { balance, getBalances } = useGetBalance();
  const { address, connect } = useContractKit();

  useEffect(() => {
    getBalances();
  }, []);

  return (
    <div className="container">
      <main className="main">
        <h1>Patrícia</h1>
        <Button
          onClick={() => {
            if (address) {
              setOpenModal(true);
            } else {
              connect()
                .then(() => setOpenModal(true))
                .catch((e: any) => console.log(e));
            }
          }}
          extraClass="primary-full"
          text="Donate"
        />

        <Button onClick={() => console.log('teste')} extraClass="primary-full" text="Approve" />

        <DonationModal
          openModal={openModal && !!address}
          balance={balance}
          nonProfitName="Xpto"
          onCloseModal={() => setOpenModal(false)}
          onclickDonate={form =>
            donateWithCUSD(toMitch, `${form.amount}`)
              .then(() => {
                if (address) getBalances();
                setOpenSuccess(true);
                setOpenModal(false);
                return Promise.resolve(true);
              })
              .catch(error => Promise.resolve(error))
          }
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
