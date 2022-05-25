import { useRef, useState, useCallback } from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useContractKit } from '@celo-tools/use-contractkit';
import Icon from '@esolidar/toolkit/build/elements/icon';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import CardNonProfit from '@esolidar/toolkit/build/components/card/nonProfit';
import Button from '@esolidar/toolkit/build/elements/button';
import Hero from '../components/hero/Hero';
import HomeCallout from '../components/homeCallout/HomeCallout';
import useGetInstitutionList, {
  useGetInstitutionListPrefetch,
} from '../api/hooks/useGetInstitutionList';
import getRoute from '../routes';
import Modals from '../components/donationModal/Modals';

const Home = () => {
  const intl: IntlShape = useIntl();
  const { address, connect } = useContractKit();
  const router = useRouter();

  const institutionWalletAddress = useRef<string>('');
  const nonProfitName = useRef<string>('');
  const nonProfitId = useRef<number | null>(null);
  const [isOpenDonationModal, setIsOpenDonationModal] = useState<boolean>(false);

  const { data: institutionList } = useGetInstitutionList({});

  const handleClickDonate = useCallback(
    (institution: any) => {
      nonProfitName.current = institution.name;
      nonProfitId.current = institution.id;
      institutionWalletAddress.current = institution.celo_wallet.find(
        (item: any) => item.default
      ).wallet_address;

      if (address) setIsOpenDonationModal(true);
      else
        connect()
          .then(() => setIsOpenDonationModal(true))
          .catch((e: any) => console.log(e));
    },
    [isOpenDonationModal]
  );

  const handleClickThumb = (institution: any) => {
    router.push(getRoute.nonProfit.DETAIL(String(router.locale), institution.id));
  };

  const handleClickViewMore = () => {
    router.push(getRoute.DISCOVER(String(router.locale)));
  };

  return (
    <>
      <Hero />
      <Viewport centred size="xl">
        <div className="home-content">
          <div className="home-content__section">
            <FormattedMessage id="Featured" />
            <div className="home-content__section-hr" />
            <Button
              extraClass="primary-full"
              onClick={handleClickViewMore}
              iconRight={<Icon name="ArrowRight" />}
              text={intl.formatMessage({ id: 'web3.view.more' })}
              ghost
            />
          </div>
          {institutionList.data.length > 0 && (
            <div className="home-content__npo-cards">
              {institutionList.data.map((institution: any) => (
                <CardNonProfit
                  key={institution.id}
                  npo={institution}
                  onClickDonate={() => handleClickDonate(institution)}
                  onClickThumb={() => handleClickThumb(institution)}
                />
              ))}
            </div>
          )}
          <div className="home-content__section top">
            <div className="home-content__section-left">
              <FormattedMessage id="web3.homepage.support.title" />
            </div>
            <div className="home-content__section-hr" />
            <div className="home-content__section-right">
              <FormattedMessage id="web3.homepage.support.subtitle" />
            </div>
          </div>
          <div className="home-content__section-columns">
            <HomeCallout
              color="green"
              title="web3.homepage.box1.title"
              description="web3.homepage.box1.subtitle"
            />
            <HomeCallout
              color="yellow"
              title="web3.homepage.box2.title"
              description="web3.homepage.box2.subtitle"
            />
            <HomeCallout
              color="green"
              title="web3.homepage.box3.title"
              description="web3.homepage.box3.subtitle"
            />
            <HomeCallout
              color="yellow"
              title="web3.homepage.box4.title"
              description="web3.homepage.box4.subtitle"
            />
          </div>
          <div className="home-content__section">
            <FormattedMessage id="web3.homepage.partners" />
            <div className="home-content__section-hr" />
          </div>
          <div style={{ marginTop: '78px', display: 'flex', gap: '24px' }}>
            <div style={{ border: '1px solid #ccc', width: '100px', height: '35px' }} />
            <div style={{ border: '1px solid #ccc', width: '100px', height: '35px' }} />
            <div style={{ border: '1px solid #ccc', width: '100px', height: '35px' }} />
            <div style={{ border: '1px solid #ccc', width: '100px', height: '35px' }} />
          </div>
        </div>
      </Viewport>
      <Modals
        openModal={isOpenDonationModal}
        setOpenModal={setIsOpenDonationModal}
        walletAddress={institutionWalletAddress.current}
        nonProfitName={nonProfitName.current}
        nonProfitId={nonProfitId.current}
      />
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await useGetInstitutionListPrefetch({ queryClient, perPage: 3, search: null });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};
