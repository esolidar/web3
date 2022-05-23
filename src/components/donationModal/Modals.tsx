/* eslint-disable no-use-before-define */
import { useState, useEffect, useCallback, useContext } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import useDonateCeloCUSD from '../../hooks/useDonate/useDonate';
import DonationModal from '.';
import ThankYouModal from '../successModal';
import useGetBalance from '../../hooks/useGetBalance/useGetBalance';
import { Form } from './DonationModal.types';
import AppContext from '../../contexts/AppContext';

interface Props {
  openModal: boolean;
  walletAddress: string;
  nonProfitName: string;
  setOpenModal(value: boolean): void;
}

const Modals = ({ openModal = false, setOpenModal, walletAddress, nonProfitName }: Props) => {
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const { balance } = useContext(AppContext);

  const donateWithCUSD = useDonateCeloCUSD();
  const { getBalances } = useGetBalance();
  const { address } = useContractKit();

  useEffect(() => {
    if (address) getBalances();
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
      {/* TODO: add text and link to share (waiting for product team) */}
      <ThankYouModal
        transitionID={walletAddress}
        nonProfitName={nonProfitName}
        openModal={isOpenSuccess}
        onCloseModal={() => setIsOpenSuccess(false)}
        shareProps={{ title: 'teste', windowLocationHref: 'loree' }}
      />
    </>
  );
};

export default Modals;
