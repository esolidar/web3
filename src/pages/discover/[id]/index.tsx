import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import CarouselLightbox from '@esolidar/toolkit/build/components/carouselLightbox';
import Breadcrumbs from '@esolidar/toolkit/build/elements/breadcrumbs';
import Title from '@esolidar/toolkit/build/unreleased/title';
import ProfileAvatar from '@esolidar/toolkit/build/components/profileAvatar';
import CardContribute from '../../../components/cardContribute/CardContribute';
import CardSDG from '../../../components/cardSDG/CardSDG';
import useGetInstitutionDetail, {
  useGetInstitutionDetailPrefetch,
} from '../../../api/hooks/useGetInstitutionDetail';
import useDonateCeloCUSD from '../../../hooks/useDonate/useDonate';

const InstitutionDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const donateCeloCUSD = useDonateCeloCUSD();

  const { data: institutionDetail } = useGetInstitutionDetail({ institutionId: String(id) });
  console.log(institutionDetail);

  const institutionWalletAddress = institutionDetail.celo_wallet.find(
    (item: any) => item.default
  ).wallet_address;

  return (
    <div className="nonprofit-detail">
      <Breadcrumbs
        breadcrumbs={[
          {
            handleClick: () => router.push('/'),
            title: 'Home',
          },
          {
            handleClick: () => router.push('/'),
            title: 'Discover',
          },
          {
            title: institutionDetail.name,
          },
        ]}
      />
      <Title subtitle={institutionDetail.location} title={institutionDetail.name} />
      <div className="nonprofit-detail__columns">
        <div>
          <CarouselLightbox
            listItems={[
              {
                url: `${process.env.NEXT_PUBLIC_CDN_UPLOADS_URL}/${institutionDetail.s3_cover_key}`,
                altTag: institutionDetail.name,
                type: 'photo',
              },
            ]}
          />
          <div className="nonprofit-detail__balance">
            <ProfileAvatar
              buttonText={institutionDetail.link || ''}
              buttonUrl={institutionDetail.link}
              isNameBold
              name={institutionDetail.name}
              thumb={institutionDetail.thumbs.thumb}
            />
            <div className="nonprofit-detail__balance--amount">
              <div className="body-small">Raised from 342 donors</div>
              <div>23,764.63 cUSD</div>
            </div>
          </div>
          <hr />
          <h3>Mission</h3>
          <p className="nonprofit-detail__mission">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the standard dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen. Lorem Ipsum is simply dummy
            text of the printing and typesetting industry. Lorem Ipsum has been the standard dummy
            text ever since the 1500s, when an unknown printer took a galley of type and scrambled
            it to make a type specimen. Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen.
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the standard dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen. What the charity does? Why they
            do it? How they do it? How the money is spent? What they are working on? Real stories as
            examples of success.
          </p>
        </div>
        <div>
          <CardContribute
            name={institutionDetail.name}
            address={institutionWalletAddress}
            onClickDonate={() => donateCeloCUSD(institutionWalletAddress, '1')}
          />
          <CardSDG sdgList={institutionDetail.ods} />
        </div>
      </div>
    </div>
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
