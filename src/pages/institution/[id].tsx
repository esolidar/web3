import { dehydrate, QueryClient } from 'react-query';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ContractKit } from '@celo/contractkit';
import { useRouter } from 'next/router';
import CarouselLightbox from '@esolidar/toolkit/build/components/carouselLightbox';
import Breadcrumbs from '@esolidar/toolkit/build/elements/breadcrumbs';
import Title from '@esolidar/toolkit/build/unreleased/title';
import useGetInstitutionDetail, {
  useGetInstitutionDetailPrefetch,
} from '../../api/hooks/useGetInstitutionDetail';

const InstitutionDetail = () => {
  const { address, performActions } = useContractKit();
  const router = useRouter();
  const { id } = router.query;

  const { data: institutionDetail } = useGetInstitutionDetail({ institutionId: String(id) });
  console.log(institutionDetail);

  const institutionWalletAddress = institutionDetail.celo_wallet.find(
    (item: any) => item.default
  ).wallet_address;

  const transfer = async () => {
    await performActions(async (kit: ContractKit) => {
      let account: string = '';
      const stableToken = await kit.contracts.getStableToken();
      const amount = kit.web3.utils.toWei('1', 'ether');

      if (address) account = address;
      const gasLimit = await kit.connection.estimateGas({
        to: institutionWalletAddress,
        from: account,
        value: amount,
      });

      const gasPrice = '500000000';
      const adjustedGasLimit = gasLimit * 2;

      // try {
      //   gasPrice = await kit.connection.gasPrice.toString();
      // } catch (_) {}

      const tx = await stableToken
        .transfer(institutionWalletAddress, amount)
        .send({ from: account, feeCurrency: stableToken.address, gas: adjustedGasLimit, gasPrice });

      // const hash = await tx.getHash();
      const receipt = await tx.waitReceipt();
      if (receipt.status) alert('success');
      else alert('error');
    });
  };

  const valora = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=celo://wallet/pay?address=0x7F38B1585d55A9bc881da27e2FB927d0db30fD41&displayName=esolidar&chld=L%7C0`;
  const metamask = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=wc:099df4c1-8d6d-4432-b6b1-f8fe5e243efe@1?bridge=https%3A%2F%2Fz.bridge.walletconnect.org&key=2625629f0670a8a5d660471621a727effbdaf28d32b23fa7a34ccfa143779bb7
  &displayName=esolidar&chld=L%7C0`;

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
      <CarouselLightbox
        listItems={[
          {
            url: `${process.env.NEXT_PUBLIC_CDN_UPLOADS_URL}/${institutionDetail.s3_cover_key}`,
            altTag: institutionDetail.name,
            type: 'photo',
          },
        ]}
      />
      <p>{institutionWalletAddress}</p>
      <button type="button" onClick={transfer}>
        Donate $cUSD
      </button>
      <h2>Opens valora</h2>
      <img alt={String(address)} src={valora} />
      <h2>Opens metamask</h2>
      <img alt={String(address)} src={metamask} />
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
