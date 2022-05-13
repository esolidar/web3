import { useIntl } from 'react-intl';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKit } from '@celo/contractkit';
import { dehydrate, QueryClient } from 'react-query';
import Link from 'next/link';
import useGetInstitutionList, {
  useGetInstitutionListPrefetch,
} from '../../api/hooks/useGetInstitutionList';
import styles from '../../assets/styles/components/Home.module.scss';
import useCeloWalletBalance from '../../api/hooks/useCeloWalletBalance';
import useDonateCeloCUSD from '../../hooks/useDonate/useDonate';
import truncateAddress from '../../utils/truncateAddress';

// TODO: gas price
// TODO: success / error das transactions

const Home = () => {
  const intl = useIntl();
  const toAccount = '0x7F38B1585d55A9bc881da27e2FB927d0db30fD41';
  const toMitch = '0x7335966f30FC589347793e3C2FE378549b8604B4';

  const { address, connect, destroy, performActions, } = useContractKit();

  const donateWithCUSD = useDonateCeloCUSD();

  const { data: institutionList } = useGetInstitutionList({});
  console.log(institutionList);

  const { data: nonprofitBalance } = useCeloWalletBalance({ wallet: toMitch, balanceOf: 'cusd'});
  console.log(nonprofitBalance);

  const getTotalBalance = async () => {
    await performActions(async (kit) => {
      const totalBalance = await kit.getTotalBalance(toMitch);

      console.log(totalBalance);
    });
  }

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

  const valora = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=celo://wallet/pay?address=0x7F38B1585d55A9bc881da27e2FB927d0db30fD41&displayName=esolidar&chld=L%7C0`;
  const metamask = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=wc:099df4c1-8d6d-4432-b6b1-f8fe5e243efe@1?bridge=https%3A%2F%2Fz.bridge.walletconnect.org&key=2625629f0670a8a5d660471621a727effbdaf28d32b23fa7a34ccfa143779bb7
  &displayName=esolidar&chld=L%7C0`;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{intl.formatMessage({ id: 'home-page' })}</h1>
        <Link
          href={{
            pathname: '/institution/[id]',
            query: { id: 51 },
          }}
        >
          <p>Go to institution 51</p>
        </Link>
        <Link
          href={{
            pathname: '/institution/[id]',
            query: { id: 54 },
          }}
        >
          <p>Go to institution 54</p>
        </Link>
        {address ? (
          <>
            <p>My address</p>
            {address}
            <button type="button" onClick={getBalances}>
              getBalances
            </button>
            <button type="button" onClick={() => donateWithCUSD(toMitch, "1")}>
              Transfer
            </button>
            <button type="button" onClick={destroy}>
              Disconnect
            </button>
            <h2>Address truncated:</h2>
            <p>{truncateAddress(toMitch, 5)}</p>
            <h2>Account summary:</h2>
          </>
        ) : (
          <>
          <button type="button" onClick={() => connect().catch(e => console.log(e))}>
            Connect wallet
          </button>
          <h3> Total balance of an account:</h3>
          <button type="button" onClick={getTotalBalance}>
            Total balance of: ${toMitch}
          </button>
          </>
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
