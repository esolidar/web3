import { useState, useMemo } from 'react';
import lastElemOf from '@esolidar/toolkit/build/utils/lastElemOf';
import ToastContext from '../contexts/ToastContext';
import Alert from '../components/alert/Alert';
import IAlert from '../interfaces/alert';

/* eslint-disable no-undef */
interface Props {
  children: React.ReactNode;
}

const ToastProvider = ({ children }: Props) => {
  const [list, setList] = useState<IAlert[]>([]);

  const handleAdd = (alert: IAlert) => {
    const id: number = Number(lastElemOf(list)?.id) + 1 || 1;

    if (!list.length) setList([{ ...alert, id }]);
    else setList([...list, { ...alert, id }]);
  };

  const handleRemove = (id: number) => setList(list.filter(alert => alert.id !== id));

  const toastProviderValue = useMemo(
    () => ({
      list,
      add: handleAdd,
      remove: handleRemove,
    }),
    [list, handleAdd, handleRemove]
  );

  return (
    <ToastContext.Provider value={toastProviderValue}>
      <div className="alert-container">
        {list.length > 0 &&
          list.map(alert => <Alert key={alert.id} alert={alert} onRemove={handleRemove} />)}
      </div>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
