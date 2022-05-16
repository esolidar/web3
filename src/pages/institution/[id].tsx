import { dehydrate, QueryClient } from 'react-query';
import { useContractKit } from '@celo-tools/use-contractkit';
import { useRouter } from 'next/router';
import CarouselLightbox from '@esolidar/toolkit/build/components/carouselLightbox';
import Breadcrumbs from '@esolidar/toolkit/build/elements/breadcrumbs';
import Title from '@esolidar/toolkit/build/unreleased/title';
import ProfileAvatar from '@esolidar/toolkit/build/components/profileAvatar';
import CardContribute from '../../components/cardContribute/CardContribute';
import useGetInstitutionDetail, {
  useGetInstitutionDetailPrefetch,
} from '../../api/hooks/useGetInstitutionDetail';
import useDonateCeloCUSD from '../../hooks/useDonate/useDonate';

const InstitutionDetail = () => {
  const { address } = useContractKit();
  const router = useRouter();
  const { id } = router.query;
  const donateCeloCUSD = useDonateCeloCUSD();

  const { data: institutionDetail } = useGetInstitutionDetail({ institutionId: String(id) });
  console.log(institutionDetail);

  const institutionWalletAddress = institutionDetail.celo_wallet.find(
    (item: any) => item.default
  ).wallet_address;

  // const transfer = async () => {
  //   await performActions(async (kit: ContractKit) => {
  //     let account: string = '';
  //     const stableToken = await kit.contracts.getStableToken();
  //     const amount = kit.web3.utils.toWei('1', 'ether');

  //     if (address) account = address;
  //     const gasLimit = await kit.connection.estimateGas({
  //       to: institutionWalletAddress,
  //       from: account,
  //       value: amount,
  //     });

  //     const gasPrice = '500000000';
  //     const adjustedGasLimit = gasLimit * 2;

  //     // try {
  //     //   gasPrice = await kit.connection.gasPrice.toString();
  //     // } catch (_) {}

  //     const tx = await stableToken
  //       .transfer(institutionWalletAddress, amount)
  //       .send({ from: account, feeCurrency: stableToken.address, gas: adjustedGasLimit, gasPrice });

  //     // const hash = await tx.getHash();
  //     const receipt = await tx.waitReceipt();
  //     if (receipt.status) alert('success');
  //     else alert('error');
  //   });
  // };

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
              <div>Raised from 342 donors</div>
              <div>23,764.63 cUSD</div>
            </div>
          </div>
          <hr />
          <h3>Mission</h3>
          <p className="nonprofit-detail__mission">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum is
            simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen. Lorem Ipsum is simply dummy
            text of the printing and typesetting industry. Lorem Ipsum has been the industry's
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen. Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
            text ever since the 1500s, when an unknown printer took a galley of type and scrambled
            it to make a type specimen. What the charity does? Why they do it? How they do it? How
            the money is spent? What they are working on? Real stories as examples of success.
          </p>
        </div>
        <div>
          <CardContribute
            address={institutionWalletAddress}
            onClickDonate={() => donateCeloCUSD(institutionWalletAddress, '1')}
          />
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
