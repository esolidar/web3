import { useState, useMemo } from 'react';
import lastElemOf from '@esolidar/toolkit/build/utils/lastElemOf';
import AppContext from '../contexts/AppContext';
import Alert from '../components/alert/Alert';
import IAlert from '../interfaces/alert';

/* eslint-disable no-undef */
interface Props {
  children: React.ReactNode;
}

const AppProvider = ({ children }: Props) => {
  const [list, setList] = useState<IAlert[]>([]);
  const [balance, setBalance] = useState<number | null>(null);

  const handleAdd = (alert: IAlert) => {
    const id: number = Number(lastElemOf(list)?.id) + 1 || 1;

    if (!list.length) setList([{ ...alert, id }]);
    else setList([...list, { ...alert, id }]);
  };

  const handleRemove = (id: number) => setList(list.filter(alert => alert.id !== id));

  const handleChangeBalance = (value: number) => setBalance(value);

  const contextProviderValue = useMemo(
    () => ({
      balance,
      changeBalance: handleChangeBalance,
      list,
      add: handleAdd,
      remove: handleRemove,
    }),
    [list, handleAdd, handleRemove, balance, handleChangeBalance]
  );

  return (
    <AppContext.Provider value={contextProviderValue}>
      <div className="alert-container">
        {list.length > 0 &&
          list.map(alert => <Alert key={alert.id} alert={alert} onRemove={handleRemove} />)}
      </div>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
