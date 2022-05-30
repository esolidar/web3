import React from 'react';
import { useIntl } from 'react-intl';
import { useContractKit } from '@celo-tools/use-contractkit';
import { dehydrate, QueryClient } from 'react-query';
import useGetInstitutionList, {
  useGetInstitutionListPrefetch,
} from '../../api/hooks/useGetInstitutionList';
import useCeloWalletBalance from '../../api/hooks/useCeloWalletBalance';
import useDonateCeloCUSD from '../../hooks/useDonate/useDonate';
import truncateAddress from '../../utils/truncateAddress';

const Home = () => {
  const intl = useIntl();
  const toMitch = '0x7335966f30FC589347793e3C2FE378549b8604B4';

  const { address, connect, destroy, performActions } = useContractKit();

  const donateWithCUSD = useDonateCeloCUSD();

  const { data: institutionList } = useGetInstitutionList({});
  console.log(institutionList);

  const { data: nonprofitBalance } = useCeloWalletBalance({ wallet: toMitch, balanceOf: 'cusd' });
  console.log(nonprofitBalance);

  const getTotalBalance = async () => {
    await performActions(async kit => {
      const totalBalance = await kit.getTotalBalance(toMitch);

      console.log(totalBalance);
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
    <div className="container">
      <main className="main">
        <h1>{intl.formatMessage({ id: 'home-page' })}</h1>
        {address ? (
          <>
            <p>My address</p>
            {address}
            <button type="button" onClick={getBalances}>
              getBalances
            </button>
            <button type="button" onClick={() => donateWithCUSD(toMitch, '1')}>
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

  await useGetInstitutionListPrefetch({ queryClient });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export default Home;
