import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import Icon from '@esolidar/toolkit/build/elements/icon';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import CardNonProfit from '@esolidar/toolkit/build/components/card/nonProfit';
import Button from '@esolidar/toolkit/build/elements/button';
import Hero from '../components/Hero';
import { useGetInstitutionListPrefetch } from '../api/hooks/useGetInstitutionList';
import useDonateCeloCUSD from '../hooks/useDonate/useDonate';
import getRoute from '../routes';

const DiscoverPage = ({ dehydratedState }: any) => {
  const { data } = dehydratedState?.queries?.[0].state.data.institutions || '';
  const router = useRouter();
  const donateCeloCUSD = useDonateCeloCUSD();
  const intl: IntlShape = useIntl();

  const handleClickDonate = (institution: any) => {
    const institutionWalletAddress = institution.celo_wallet.find(
      (item: any) => item.default
    ).wallet_address;
    donateCeloCUSD(institutionWalletAddress, '1');
  };

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
                text={intl.formatMessage({ id: 'View more' })}
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
            <FormattedMessage
              id="We help you support the causes {br} you care about with crypto"
              defaultMessage="We help you support the causes {br} you care about with crypto"
              values={{ br: <br /> }}
            />
            <div className="home-content__section-hr" />
            <div className="home-content__section-right">
              <FormattedMessage id="We are bringing transparency, efficiency, and governance into the philanthropic sector and ESG market, by creating a bridge between organizations, donors, and the crypto community, providing new and engaging ways to support worldwide causes and projects." />
            </div>
          </div>
          <div className="home-content__section-columns">
            <div className="home-content__section-columns-item green">
              <h4>
                <FormattedMessage id="Maximize your impact" />
              </h4>
              <p>
                <FormattedMessage id="Have a real-world impact with your crypto profits, furthering the mission of the causes you donate to" />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
            <div className="home-content__section-columns-item yellow">
              <h4>
                <FormattedMessage id="Donate anonymously" />
              </h4>
              <p>
                <FormattedMessage id="You can donate crypto anonymously. Support the causes you care about and maintain your privacy." />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
            <div className="home-content__section-columns-item yellow">
              <h4>
                <FormattedMessage id="No platform fees" />
              </h4>
              <p>
                <FormattedMessage id="Give crypto directly to a nonprofit, and 100% of your donation can go to the causes you care about" />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
            <div className="home-content__section-columns-item green">
              <h4>
                <FormattedMessage id="Encourage transparency" />
              </h4>
              <p>
                <FormattedMessage id="Help promote transparent giving and encourage wider adoption of crypto" />
              </p>
              <div className="home-content__section-columns-item-footer" />
            </div>
          </div>
          <div className="home-content__section">
            <FormattedMessage id="Supporters & partners" />
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
