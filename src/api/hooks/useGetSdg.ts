import { useQuery } from 'react-query';
import axios from 'axios';
import ROOT_URL from '../../constants/apiUrl';

interface Args {
  enabled?: boolean;
  onSuccess?(data: any): void;
  onError?(data: any): void;
}

const queryKey: string = 'getSdg';

const useGetSdg = ({ onSuccess, onError }: Args = {}) =>
  useQuery(
    queryKey,
    async () => {
      const url = `${ROOT_URL}ods`;
      const { data } = await axios.get(url);

      return data.data;
    },
    {
      onSuccess: data => onSuccess && onSuccess(data),
      onError: error => onError && onError(error),
    }
  );

export default useGetSdg;
