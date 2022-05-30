import { QueryClient, useQuery } from 'react-query';
import axios from 'axios';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  institutionId: string;
  enabled?: boolean;
  onSuccess?(data: any): void;
}

const queryKey: string = 'getInstitutionDetail';
const url = (institutionId: string): string => `${ROOT_URL}institutions/${institutionId}/public`;

const useGetInstitutionDetail = ({ institutionId, enabled = true, onSuccess }: Args) =>
  useQuery(
    queryKey,
    async () => {
      const { data: response } = await axios.get(url(institutionId));
      return response.data;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
      enabled,
    }
  );

export const useGetInstitutionDetailPrefetch = async (
  queryClient: QueryClient,
  institutionId: string
) => {
  await queryClient.prefetchQuery(queryKey, async () => {
    const { data: response } = await axios.get(url(institutionId));
    return response.data;
  });
};

export default useGetInstitutionDetail;
