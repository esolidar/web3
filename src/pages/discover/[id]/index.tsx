import { useState, useCallback, useRef } from 'react';
// import { useIntl } from 'react-intl';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useContractKit } from '@celo-tools/use-contractkit';
import CarouselLightbox from '@esolidar/toolkit/build/components/carouselLightbox';
import Breadcrumbs from '@esolidar/toolkit/build/elements/breadcrumbs';
import Title from '@esolidar/toolkit/build/unreleased/title';
import ProfileAvatar from '@esolidar/toolkit/build/components/profileAvatar';
import ShareModal from '@esolidar/toolkit/build/components/shareModal';
import CardContribute from '../../../components/cardContribute/CardContribute';
import CardSDG from '../../../components/cardSDG/CardSDG';
import DonateFooter from '../../../components/donateFooter/DonateFooter';
import useGetInstitutionDetail, {
  useGetInstitutionDetailPrefetch,
} from '../../../api/hooks/useGetInstitutionDetail';
import useToast from '../../../hooks/useToast/useToast';
import getRoute from '../../../routes';
import useIsSSR from '../../../hooks/useIsSSR/useIsSSR';
import Modals from '../../../components/donationModal/Modals';

const formatTextWithParagraphs = (value: string) =>
  // eslint-disable-next-line react/no-array-index-key
  value?.split('\n').map((item, index) => <p key={index}>{item}</p>);

const InstitutionDetail = () => {
  const router = useRouter();
  const {
    query: { id },
    push,
  } = router;
  const toast = useToast();
  const isSSR = useIsSSR();

  const [isOpenShareModal, setIsOpenShareModal] = useState<Boolean>(false);
  const [isOpenDonationModal, setIsOpenDonationModal] = useState<boolean>(false);

  const { address, connect } = useContractKit();
  const { data: institution } = useGetInstitutionDetail({ institutionId: String(id) });
  const nonProfitName = useRef('');
  nonProfitName.current = institution.name;

  const institutionWalletAddress = institution.celo_wallet.find(
    (item: any) => item.default
  ).wallet_address;

  const handleClickDonate = useCallback(() => {
    if (address) {
      setIsOpenDonationModal(true);
    } else {
      connect()
        .then(() => setIsOpenDonationModal(true))
        .catch((e: any) => console.log(e));
    }
  }, [isOpenDonationModal]);

  return (
    <>
      <div className="nonprofit-detail">
        <Breadcrumbs
          breadcrumbs={[
            {
              handleClick: () => push(getRoute.HOME(String(router.locale))),
              title: 'Home',
            },
            {
              handleClick: () => push(getRoute.DISCOVER(String(router.locale))),
              title: 'Discover',
            },
            {
              title: institution.name,
            },
          ]}
        />
        <Title subtitle={institution.location} title={institution.name} />
        <div className="nonprofit-detail__columns">
          <div className="nonprofit-detail__columns--left">
            <CarouselLightbox
              listItems={[
                {
                  url: `${process.env.NEXT_PUBLIC_CDN_UPLOADS_URL}/${institution.s3_cover_key}`,
                  altTag: institution.name,
                  type: 'photo',
                },
              ]}
            />
            <div className="nonprofit-detail__balance">
              <ProfileAvatar
                buttonText={institution.link ? institution.link.replace(/(^\w+:|^)\/\//, '') : ''}
                buttonUrl={institution.link}
                isNameBold
                name={institution.name}
                thumb={institution.thumbs.thumb}
              />
              <div className="nonprofit-detail__balance--amount">
                <div className="body-small">Raised from 342 donors</div>
                <div>23,764.63 cUSD</div>
              </div>
            </div>
            <div className="nonprofit-detail__mission">
              <h3>Mission</h3>
              {!isSSR && institution.about && (
                <p>{formatTextWithParagraphs(institution.about[String(router.locale)])}</p>
              )}
            </div>
          </div>
          <div className="nonprofit-detail__columns--right">
            <CardContribute
              name={institution.name}
              address={institutionWalletAddress}
              onClickDonate={handleClickDonate}
              onClickShare={() => setIsOpenShareModal(true)}
            />
            <CardSDG sdgList={institution.ods} />
          </div>
        </div>
      </div>
      <ShareModal
        openModal={isOpenShareModal}
        title={institution.name}
        windowLocationHref={typeof window !== 'undefined' ? window.location.href : ''}
        onCloseModal={() => setIsOpenShareModal(false)}
        onClickCopyToClipboard={() => toast.success('Successfully copied URL')}
      />
      <DonateFooter
        onClickDonate={handleClickDonate}
        onClickShare={() => setIsOpenShareModal(true)}
      />
      <Modals
        openModal={isOpenDonationModal}
        setOpenModal={setIsOpenDonationModal}
        walletAddress={institutionWalletAddress}
        nonProfitName={nonProfitName.current}
      />
    </>
  );
};

export const getStaticProps = async (context: any) => {
  const id = context.params?.id as string;
  const queryClient = new QueryClient();

  await useGetInstitutionDetailPrefetch(queryClient, id);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export default InstitutionDetail;
