import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useContractKit } from '@celo-tools/use-contractkit';
import { dehydrate, QueryClient } from 'react-query';
import Title from '@esolidar/toolkit/build/unreleased/title';
import Breadcrumbs from '@esolidar/toolkit/build/elements/breadcrumbs';
import CardNonProfit from '@esolidar/toolkit/build/components/card/nonProfit';
import useDonateCeloCUSD from '../hooks/useDonate/useDonate';
import useGetBalance from '../hooks/useGetBalance/useGetBalance';
import useGetInstitutionList, {
  useGetInstitutionListPrefetch,
} from '../api/hooks/useGetInstitutionList';

// TODO: gas price
// TODO: success / error das transactions

const Home = () => {
  const intl = useIntl();
  const router = useRouter();
  const { address, connect, destroy } = useContractKit();
  const donateCeloCUSD = useDonateCeloCUSD();
  const getBalance = useGetBalance();

  const {
    data: { institutions: institutionList },
  } = useGetInstitutionList({});
  console.log({ institutionList });

  const handleClickDonate = (institution: any) => {
    const institutionWalletAddress = institution.celo_wallet.find(
      (item: any) => item.default
    ).wallet_address;

    donateCeloCUSD(institutionWalletAddress, '1');
  };

  const handleClickThumb = (institution: any) => {
    router.push(`/institution/${institution.id}`);
  };

  return (
    <div className="home">
      <Breadcrumbs
        breadcrumbs={[
          {
            handleClick: () => {},
            title: 'Home',
          },
          {
            title: 'Discover',
          },
        ]}
      />
      <Title
        subtitle={intl.formatMessage({ id: 'web3.institution.list.subtitle' })}
        title={intl.formatMessage({ id: 'web3.institution.list.title' })}
      />
      {institutionList.data.length > 0 && (
        <div className="home__grid">
          {institutionList.data.map((institution: any) => (
            <CardNonProfit
              npo={institution}
              handleClickDonate={() => handleClickDonate(institution)}
              handleClickThumb={() => handleClickThumb(institution)}
            />
          ))}
        </div>
      )}
      {
        // address ? (
        //   <>
        //     <p>My address</p>
        //     {address}
        //     <button type="button" onClick={getBalance.getBalances}>
        //       getBalances
        //     </button>
        //     {/* <button type="button" onClick={transfer}>
        //       Transfer
        //     </button> */}
        //     <button type="button" onClick={destroy}>
        //       Disconnect
        //     </button>
        //   </>
        // ) : (
        //   <button type="button" onClick={() => connect().catch(e => console.log(e))}>
        //     Connect wallet
        //   </button>
        // )
      }
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
