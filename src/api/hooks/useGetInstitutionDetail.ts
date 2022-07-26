import { useQuery } from 'react-query';
import axios from 'axios';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  institutionId: string;
  enabled?: boolean;
  onSuccess?(data: any): void;
}

const url = (institutionId: string): string => `${ROOT_URL}institutions/${institutionId}/public`;

const useGetInstitutionDetail = ({ institutionId, enabled = true, onSuccess }: Args) =>
  useQuery(
    'getInstitutionDetail',
    async () => {
      const { data: response } = await axios.get(url(institutionId));
      return response.data;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
      enabled,
      initialData: {},
    }
  );

export default useGetInstitutionDetail;
