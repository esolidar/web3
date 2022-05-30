import { QueryClient, useQuery, useInfiniteQuery } from 'react-query';
import axios from 'axios';
import queryString from 'query-string';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  search?: string;
  odsId?: any[];
  perPage?: number;
  onSuccess?(data: any): void;
}

interface ArgsPrefetch {
  queryClient: QueryClient;
  search?: string | null;
  perPage?: number;
}

const queryKey: string = 'getInstitutionList';
const url = (params: string): string => `${ROOT_URL}institutions${params && `?${params}`}`;

const useGetInstitutionList = ({ search, odsId = [], perPage = 3, onSuccess }: Args) =>
  useQuery(
    [queryKey, search, odsId],
    async () => {
      const params: string = queryString.stringify({
        has_celo_wallet: Number(true),
        name: search ? `%${search}%` : undefined,
        ods_id: odsId.length > 0 ? odsId.join(',') : undefined,
        per_page: perPage,
      });
      const { data: response } = await axios.get(url(params));
      return response.data.institutions;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
    }
  );

export const useGetInstitutionListPrefetch = async ({
  queryClient,
  perPage = 6,
  search = '',
}: ArgsPrefetch) => {
  await queryClient.prefetchQuery([queryKey, search, []], async () => {
    const params: string = queryString.stringify({
      has_celo_wallet: Number(true),
      per_page: perPage,
    });
    const { data: response } = await axios.get(url(params));
    return response.data.institutions;
  });
};

export const useGetInstitutionListInfinite = ({ search, odsId = [], onSuccess }: Args) =>
  useInfiniteQuery(
    [queryKey, search, odsId],
    async ({ pageParam = 1 }) => {
      const params: string = queryString.stringify({
        has_celo_wallet: Number(true),
        name: search ? `%${search}%` : undefined,
        ods_id: odsId.length > 0 ? odsId.join(',') : undefined,
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
        total: data.pages?.[0].institutions.total,
        pages: data.pages.flatMap((item: any) => [item.institutions.data]),
        pageParams: [...data.pageParams],
      }),
    }
  );

export default useGetInstitutionList;
