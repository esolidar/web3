import Link from 'next/link';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import useGetInstitutionDetail, {
  useGetInstitutionDetailPrefetch,
} from '../../api/hooks/useGetInstitutionDetail';
import styles from '../../assets/styles/components/InstitutionDetail.module.scss';

const InstitutionDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: institutionDetail } = useGetInstitutionDetail({ institutionId: String(id) });
  console.log(institutionDetail);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Link href="/">
          <p>Go to home page</p>
        </Link>
        <h1>Institution detail</h1>
        <p>{JSON.stringify(institutionDetail)}</p>
      </main>
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
