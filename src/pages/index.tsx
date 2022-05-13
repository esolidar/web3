import { useIntl } from 'react-intl';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKit } from '@celo/contractkit';
import { dehydrate, QueryClient } from 'react-query';
import Link from 'next/link';
import Title from '@esolidar/toolkit/build/unreleased/title';
import useGetInstitutionList, {
  useGetInstitutionListPrefetch,
} from '../api/hooks/useGetInstitutionList';
import styles from '../assets/styles/components/Home.module.scss';

// TODO: gas price
// TODO: success / error das transactions

const Home = () => {
  const intl = useIntl();
  const toAccount = '0x7F38B1585d55A9bc881da27e2FB927d0db30fD41';
  const { address, connect, destroy, performActions } = useContractKit();

  const { data: institutionList } = useGetInstitutionList({});
  console.log(institutionList);

  const transfer = async () => {
    await performActions(async (kit: ContractKit) => {
      let account: string = '';
      const stableToken = await kit.contracts.getStableToken();
      const amount = kit.web3.utils.toWei('1', 'ether');

      if (address) account = address;
      const gasLimit = await kit.connection.estimateGas({
        to: toAccount,
        from: account,
        value: amount,
      });

      const gasPrice = '500000000';
      const adjustedGasLimit = gasLimit * 2;

      // try {
      //   gasPrice = await kit.connection.gasPrice.toString();
      // } catch (_) {}

      const tx = await stableToken
        .transfer(toAccount, amount)
        .send({ from: account, feeCurrency: stableToken.address, gas: adjustedGasLimit, gasPrice });

      // const hash = await tx.getHash();
      const receipt = await tx.waitReceipt();
      if (receipt.status) alert('success');
      else alert('error');
    });
  };

  const getBalances = async () => {
    await performActions(async kit => {
      let account: string = '';
      const celotoken = await kit.contracts.getGoldToken();
      const cUSDtoken = await kit.contracts.getStableToken();

      if (address) account = address;
      const celoBalance = await celotoken.balanceOf(account);
      const cUSDBalance = await cUSDtoken.balanceOf(account);
      console.log(`Your account CELO balance: ${celoBalance.toString()}`);
      console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Title
          subtitle={intl.formatMessage({ id: 'web3.institution.list.subtitle' })}
          title={intl.formatMessage({ id: 'web3.institution.list.title' })}
        />
        <Link
          href={{
            pathname: '/institution/[id]',
            query: { id: 106 },
          }}
        >
          <p>Go to institution 106</p>
        </Link>
        {address ? (
          <>
            <p>My address</p>
            {address}
            <button type="button" onClick={getBalances}>
              getBalances
            </button>
            <button type="button" onClick={transfer}>
              Transfer
            </button>
            <button type="button" onClick={destroy}>
              Disconnect
            </button>
          </>
        ) : (
          <button type="button" onClick={() => connect().catch(e => console.log(e))}>
            Connect wallet
          </button>
        )}
      </main>
    </div>
  );
};

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await useGetInstitutionListPrefetch(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export default Home;
