import { QueryClient, useQuery } from 'react-query';
import axios from 'axios';
import queryString from 'query-string';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  onSuccess?(data: any): void;
}

const queryKey: string = 'getInstitutionList';
const params: string = queryString.stringify({ has_celo_wallet: Number(true) });
const url: string = `${ROOT_URL}institutions${params && `?${params}`}`;

const useGetInstitutionList = ({ onSuccess }: Args) =>
  useQuery(
    queryKey,
    async () => {
      const { data: response } = await axios.get(url);
      return response.data;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
    }
  );

export const useGetInstitutionListPrefetch = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery(queryKey, async () => {
    const { data: response } = await axios.get(url);
    return response.data;
  });
};

export default useGetInstitutionList;
