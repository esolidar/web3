import { useContext } from 'react';
import ToastContext from '../../contexts/ToastContext';

const useToast = () => {
  const toast = useContext(ToastContext);

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
