import { createContext } from 'react';
import Alert from '../interfaces/alert';

interface AppContext {
  list: Alert[];
  add(alert: Alert): void;
  remove(id: number): void;
  balance: number | null | undefined;
  changeBalance(value: number): void;
}

const defaultValue: AppContext = {
  list: [],
  add: () => null,
  remove: () => null,
  balance: undefined,
  changeBalance: () => null,
};

export default createContext(defaultValue);
