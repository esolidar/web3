/* eslint-disable no-use-before-define */
import { useState, useEffect, useCallback, useContext } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
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
  nonProfitId: number | null;
  setOpenModal(value: boolean): void;
}

const Modals = ({
  openModal = false,
  walletAddress,
  nonProfitName,
  nonProfitId,
  setOpenModal,
}: Props) => {
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

  const { balance } = useContext(AppContext);
  const queryClient = useQueryClient();

  const intl: IntlShape = useIntl();
  const donateWithCUSD = useDonateCeloCUSD();
  const { getBalances } = useGetBalance();
  const { address } = useContractKit();

  useEffect(() => {
    if (address) getBalances();
  }, [openModal]);

  const handledonateWithCUSD = useCallback(
    (form: Form) =>
      donateWithCUSD(walletAddress, `${form.amount}`).then((value: any) => {
        if (!(value instanceof Error)) {
          if (address) getBalances();
          queryClient.refetchQueries('celoWalletBalance');
          setIsOpenSuccess(true);
          setOpenModal(false);
          setTransactionHash(value);
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
        transactionID={`${transactionHash}`}
        nonProfitName={nonProfitName}
        openModal={isOpenSuccess}
        onCloseModal={() => setIsOpenSuccess(false)}
        shareProps={{
          title: intl.formatMessage({ id: 'web3.share.text' }, { nonProfitName }),
          windowLocationHref: `${process.env.NEXT_PUBLIC_DOMAIN}/${String(
            intl.locale
          )}/discover/${nonProfitId}`,
        }}
      />
    </>
  );
};

export default Modals;
