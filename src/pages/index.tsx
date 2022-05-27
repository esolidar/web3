import { useRef, useState, useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
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
  const queryClient = useQueryClient();
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

  useEffect(() => {
    queryClient.setQueryData('celoWalletBalance', 0);
  }, []);

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
        <div className="home">
          <div className="home-section">
            <div className="home-section__title">
              <FormattedMessage id="web3.featured" />
              <div className="home-section__title--hr" />
            </div>
            <Button
              extraClass="primary-full"
              onClick={handleClickViewMore}
              iconRight={<Icon name="ArrowRight" />}
              text={intl.formatMessage({ id: 'web3.view.more' })}
              ghost
            />
          </div>

          {institutionList?.data.length > 0 && (
            <div className="home-npo-cards">
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

          <div className="home-section second-section">
            <div className="home-section__title">
              <span>
                <FormattedMessage id="web3.homepage.support.title" />
              </span>
              <div className="home-section__title--hr" />
            </div>
            <div className="home-section__title">
              <span>
                <FormattedMessage id="web3.homepage.support.subtitle" />
              </span>
            </div>
          </div>

          <div className="home-callout-grid">
            <HomeCallout
              color="green"
              title="web3.homepage.box1.title"
              description="web3.homepage.box1.subtitle"
              image={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/benefits/maximize.png`}
            />
            <HomeCallout
              color="yellow"
              title="web3.homepage.box2.title"
              description="web3.homepage.box2.subtitle"
              image={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/benefits/donate.png`}
            />
            <HomeCallout
              color="yellow"
              title="web3.homepage.box3.title"
              description="web3.homepage.box3.subtitle"
              image={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/benefits/fees.png`}
            />
            <HomeCallout
              color="green"
              title="web3.homepage.box4.title"
              description="web3.homepage.box4.subtitle"
              image={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/benefits/transparency.png`}
            />
          </div>

          <div className="home-section">
            <div className="home-section__title">
              <FormattedMessage id="web3.homepage.partners" />
              <div className="home-section__title--hr" />
            </div>
          </div>

          <div className="home-partners-grid">
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/partners/celo.svg`}
                className="partner-image"
                alt="celo"
              />
            </div>
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/partners/harmony.svg`}
                className="partner-image"
                alt="harmony"
              />
            </div>
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/partners/impact-market.svg`}
                className="partner-image"
                alt="impact-market"
              />
            </div>
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/web3/partners/clabs.svg`}
                className="partner-image"
                alt="clabs"
              />
            </div>
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
