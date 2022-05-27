import { useState, useCallback, useRef } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import Head from 'next/head';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useContractKit } from '@celo-tools/use-contractkit';
import Icon from '@esolidar/toolkit/build/elements/icon';
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
import useCeloWalletBalance from '../../../api/hooks/useCeloWalletBalance';
import { DAPP_NAME } from '../../../constants/dapp';

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

  const institutionWalletAddress = institution.celo_wallet.find(
    (item: any) => item.default
  ).wallet_address;

  const { data: nonprofitBalance } = useCeloWalletBalance({
    wallet: institutionWalletAddress,
    balanceOf: 'cusd',
  });

  const intl: IntlShape = useIntl();
  const nonProfitName = useRef(institution.name || '');
  const nonProfitId = useRef(institution.id || null);

  const handleClickDonate = useCallback(() => {
    if (address) {
      setIsOpenDonationModal(true);
    } else {
      connect()
        .then(() => setIsOpenDonationModal(true))
        .catch((e: any) => console.log(e));
    }
  }, [isOpenDonationModal]);

  const urlNoImage: string = `${process.env.NEXT_PUBLIC_CDN_STATIC_URL}/frontend/assets/placeholders/image.svg`;

  return (
    <>
      <Head>
        <title key="title">{institution?.name}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@esolidar" />
        <meta name="twitter:title" content={DAPP_NAME} />
        <meta
          name="twitter:description"
          content={institution?.about?.[String(router.locale)].substring(0, 120)}
        />
        <meta name="twitter:creator" content="@esolidar" />
        <meta
          name="twitter:image:src"
          content={
            institution?.s3_cover_key
              ? `${process.env.NEXT_PUBLIC_CDN_UPLOADS_URL}/${institution.s3_cover_key}`
              : urlNoImage
          }
        />
        <meta key="og:title" property="og:title" content={institution?.name} />
        <meta
          key="og:description"
          property="og:description"
          content={institution?.about?.[String(router.locale)].substring(0, 120)}
        />

        <meta
          key="description"
          name="description"
          content={institution?.about?.[String(router.locale)].substring(0, 120)}
        />
        <meta
          key="og:image"
          property="og:image"
          content={
            institution?.s3_cover_key
              ? `${process.env.NEXT_PUBLIC_CDN_UPLOADS_URL}/${institution.s3_cover_key}`
              : urlNoImage
          }
        />
        <meta key="keywords" name="keywords" content={institution?.name} />
        <meta
          key="og:url"
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/${String(router.locale)}/discover/${
            institution?.id
          }`}
        />
        <link
          key="canonical"
          href={`${process.env.NEXT_PUBLIC_DOMAIN}${String(router.locale)}/discover/${
            institution?.id
          }`}
          rel="canonical"
        />
      </Head>
      <div className="nonprofit-detail">
        <Breadcrumbs
          breadcrumbs={[
            {
              handleClick: () => push(getRoute.HOME(String(router.locale))),
              title: intl.formatMessage({ id: 'web3.home' }),
            },
            {
              handleClick: () => push(getRoute.DISCOVER(String(router.locale))),
              title: intl.formatMessage({ id: 'web3.institution.list.title' }),
            },
            {
              title: institution?.name,
            },
          ]}
        />
        <Title subtitle={institution?.location} title={institution?.name} />
        <div className="nonprofit-detail__columns">
          <div className="nonprofit-detail__columns--left">
            <CarouselLightbox
              listItems={[
                {
                  url: institution?.s3_cover_key
                    ? `${process.env.NEXT_PUBLIC_CDN_UPLOADS_URL}/${institution.s3_cover_key}`
                    : urlNoImage,
                  altTag: institution?.name,
                  type: 'photo',
                },
              ]}
            />
            <div className="nonprofit-detail__balance">
              <ProfileAvatar
                buttonText={institution?.link ? institution.link.replace(/(^\w+:|^)\/\//, '') : ''}
                buttonUrl={institution?.link}
                buttonIconRight={<Icon name="ExternalLink" size="xs" />}
                isNameBold
                name={institution?.name}
                thumb={institution?.s3_image_key === '0' ? urlNoImage : institution?.thumbs.thumb}
              />

              {nonprofitBalance !== undefined && nonprofitBalance > 0 && (
                <div className="nonprofit-detail__balance--amount">
                  <div className="body-small">{intl.formatMessage({ id: 'web3.raised' })}</div>
                  <div>{`${nonprofitBalance} cUSD`}</div>
                </div>
              )}
            </div>
            <div className="nonprofit-detail__mission">
              <h3>{intl.formatMessage({ id: 'web3.mission' })}</h3>
              {!isSSR && institution?.about && (
                <div>{formatTextWithParagraphs(institution?.about?.[String(router.locale)])}</div>
              )}
            </div>
          </div>
          <div className="nonprofit-detail__columns--right">
            <CardContribute
              name={institution?.name}
              address={institutionWalletAddress}
              onClickDonate={handleClickDonate}
              onClickShare={() => setIsOpenShareModal(true)}
            />
            <CardSDG sdgList={institution?.ods} />
          </div>
        </div>
      </div>
      <ShareModal
        openModal={isOpenShareModal}
        title={institution?.name}
        windowLocationHref={typeof window !== 'undefined' ? window.location.href : ''}
        onCloseModal={() => setIsOpenShareModal(false)}
        onClickCopyToClipboard={() => toast.success(intl.formatMessage({ id: 'web3.copied' }))}
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
        nonProfitId={nonProfitId.current}
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
