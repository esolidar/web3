import { useRef, useState, useCallback } from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useContractKit } from '@celo-tools/use-contractkit';
import Icon from '@esolidar/toolkit/build/elements/icon';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import CardNonProfit from '@esolidar/toolkit/build/components/card/nonProfit';
import Button from '@esolidar/toolkit/build/elements/button';
import Hero from '../components/Hero';
import { useGetInstitutionListPrefetch } from '../api/hooks/useGetInstitutionList';
import getRoute from '../routes';
import Modals from '../components/donationModal/Modals';

const DiscoverPage = ({ dehydratedState }: any) => {
  const [isOpenDonationModal, setIsOpenDonationModal] = useState<boolean>(false);
  const { data } = dehydratedState?.queries?.[0].state.data.institutions || '';
  const router = useRouter();
  const intl: IntlShape = useIntl();
  const { address, connect } = useContractKit();

  const institutionWalletAddress = useRef('');
  const nonProfitName = useRef('');
  const nonProfitId = useRef(null);

  const handleClickDonate = useCallback(
    (institution: any) => {
      nonProfitName.current = institution.name;
      nonProfitId.current = institution.id;
      institutionWalletAddress.current = institution.celo_wallet.find(
        (item: any) => item.default
      ).wallet_address;

      if (address) {
        setIsOpenDonationModal(true);
      } else {
        connect()
          .then(() => setIsOpenDonationModal(true))
          .catch((e: any) => console.log(e));
      }
    },
    [isOpenDonationModal]
  );

  const handleClickThumb = (institution: any) => {
    router.push(getRoute.nonProfit.DETAIL(String(router.locale), institution.id));
  };

  return (
    <>
      <Hero />
      <Viewport centred size="xl">
        <div className="home-content">
          <div className="home-content__section">
            <FormattedMessage id="Featured" />
            <div className="home-content__section-hr" />
            <div className="home-content__section-view-more">
              <Button
                extraClass="link"
                fullWidth={false}
                ghost={false}
                href={getRoute.DISCOVER(String(router.locale))}
                iconRight={<Icon name="ArrowRight" />}
                isLoading={false}
                size="md"
                text={intl.formatMessage({ id: 'web3.view.more' })}
                theme="light"
                type="button"
              />
            </div>
          </div>
          <div className="home-content__npo-cards">
            {data.map((institution: any) => (
              <CardNonProfit
                key={institution.id}
                npo={institution}
                onClickDonate={() => handleClickDonate(institution)}
                onClickThumb={() => handleClickThumb(institution)}
              />
            ))}
          </div>
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
            <div className="home-content__section-columns-item green">
              <h4>
                <FormattedMessage id="web3.homepage.box1.title" />
              </h4>
              <p>
                <FormattedMessage id="web3.homepage.box1.subtitle" />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
            <div className="home-content__section-columns-item yellow">
              <h4>
                <FormattedMessage id="web3.homepage.box2.title" />
              </h4>
              <p>
                <FormattedMessage id="web3.homepage.box2.subtitle" />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
            <div className="home-content__section-columns-item yellow">
              <h4>
                <FormattedMessage id="web3.homepage.box3.title" />
              </h4>
              <p>
                <FormattedMessage id="web3.homepage.box3.subtitle" />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
            <div className="home-content__section-columns-item green">
              <h4>
                <FormattedMessage id="web3.homepage.box4.title" />
              </h4>
              <p>
                <FormattedMessage id="web3.homepage.box4.subtitle" />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
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

export default DiscoverPage;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await useGetInstitutionListPrefetch(queryClient, 3);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};
