import { QueryClient, useQuery, useInfiniteQuery } from 'react-query';
import axios from 'axios';
import queryString from 'query-string';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  search?: string;
  odsId?: any[];
  onSuccess?(data: any): void;
}

const queryKey: string = 'getInstitutionList';
const url = (params: string): string => `${ROOT_URL}institutions${params && `?${params}`}`;

const useGetInstitutionList = ({ search, odsId = [], onSuccess }: Args) =>
  useQuery(
    [queryKey, search, odsId],
    async () => {
      const params: string = queryString.stringify({
        has_celo_wallet: Number(true),
        name: search ? `%${search}%` : undefined,
        ods_id: odsId.length > 0 ? odsId.flatMap(i => i.value).join() : undefined,
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

export const useGetInstitutionListInfinite = ({ search, odsId = [], onSuccess }: Args) =>
  useInfiniteQuery(
    [queryKey, search, odsId],
    async ({ pageParam = 1 }) => {
      const params: string = queryString.stringify({
        has_celo_wallet: Number(true),
        name: search ? `%${search}%` : undefined,
        ods_id: odsId.length > 0 ? odsId.flatMap(i => i.value).join() : undefined,
        page: pageParam,
      });
      const { data: response } = await axios.get(url(params));
      return response.data;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
      getPreviousPageParam: data => {
        const page = data.institutions.current_page - 1;
        return page ?? undefined;
      },
      getNextPageParam: data => {
        const page =
          data.institutions.current_page < data.institutions.last_page
            ? data.institutions.current_page + 1
            : undefined;

        return page ?? false;
      },
      select: (data: any) => ({
        total: data.pages[0].institutions.total,
        pages: data.pages.flatMap((item: any) => [item.institutions.data]),
        pageParams: [...data.pageParams],
      }),
    }
  );
