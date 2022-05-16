import { QueryClient, useQuery } from 'react-query';
import axios from 'axios';
import queryString from 'query-string';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  search?: string;
  onSuccess?(data: any): void;
}

const queryKey: string = 'getInstitutionList';
const url = (params: string): string => `${ROOT_URL}institutions${params && `?${params}`}`;

const useGetInstitutionList = ({ search, onSuccess }: Args) =>
  useQuery(
    // [queryKey, search], // FIXME: search is not working here
    queryKey, // FIXME: search is not working here
    async () => {
      const params: string = queryString.stringify({
        has_celo_wallet: Number(true),
        name: search || undefined,
      });
      const { data: response } = await axios.get(url(params));
      return response.data;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
    }
  );

export const useGetInstitutionListPrefetch = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery(queryKey, async () => {
    const params: string = queryString.stringify({ has_celo_wallet: Number(true) });
    const { data: response } = await axios.get(url(params));
    return response.data;
  });
};

export default useGetInstitutionList;
