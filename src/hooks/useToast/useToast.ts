import { useContext } from 'react';
import AppContext from '../../contexts/AppContext';

const useToast = () => {
  const toast = useContext(AppContext);

  return {
    success: (title: string) => {
      toast.add({
        type: 'toast',
        variant: 'snack-bar',
        status: 'success',
        title,
      });
    },
    error: (title: string = 'toolkit.alert.error.unexpected') => {
      toast.add({
        type: 'toast',
        variant: 'snack-bar',
        status: 'danger',
        title,
      });
    },
  };
};

export default useToast;
