/* eslint-disable no-use-before-define */
import { useState, useEffect, useCallback } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import useDonateCeloCUSD from '../../hooks/useDonate/useDonate';
import DonationModal from '.';
import ThankYouModal from '../successModal';
import useGetBalance from '../../hooks/useGetBalance/useGetBalance';
import { Form } from './DonationModal.types';

interface Props {
  openModal: boolean;
  walletAddress: string;
  nonProfitName: string;
  setOpenModal(value: boolean): void;
}

const Modals = ({ openModal = false, setOpenModal, walletAddress, nonProfitName }: Props) => {
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);

  const donateWithCUSD = useDonateCeloCUSD();
  const { balance, getBalances } = useGetBalance();
  const { address } = useContractKit();

  useEffect(() => {
    getBalances();
  }, []);

  useEffect(() => {
    getBalances();
  }, [openModal]);

  const handledonateWithCUSD = useCallback(
    (form: Form) =>
      donateWithCUSD(walletAddress, `${form.amount}`).then((value: any) => {
        if (!value) {
          if (address) getBalances();
          setIsOpenSuccess(true);
          setOpenModal(false);
        }
        return Promise.resolve(value);
      }),
    [address, walletAddress]
  );

  return (
    <>
      <DonationModal
        openModal={openModal && !!address}
        balance={balance}
        nonProfitName={nonProfitName}
        onCloseModal={() => setOpenModal(false)}
        onclickDonate={form => handledonateWithCUSD(form)}
      />
      <ThankYouModal
        transitionID={walletAddress}
        openModal={isOpenSuccess}
        onCloseModal={() => setIsOpenSuccess(false)}
        shareProps={{ title: 'teste', windowLocationHref: 'loree' }}
      />
    </>
  );
};

export default Modals;
