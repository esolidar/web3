import { QueryClient, useQuery } from 'react-query';
import axios from 'axios';
import queryString from 'query-string';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  // eslint-disable-next-line no-unused-vars
  onSuccess?(data: any): void;
}

const queryKey = 'getInstitutionList';
const params = queryString.stringify({});
const url = `${ROOT_URL}institutions${params}`;

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
