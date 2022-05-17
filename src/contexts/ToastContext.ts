import { createContext } from 'react';
import Alert from '../interfaces/alert';

interface ToastContext {
  list: Alert[];
  add(alert: Alert): void;
  remove(id: number): void;
}

const defaultValue: ToastContext = {
  list: [],
  add: () => null,
  remove: () => null,
};

export default createContext(defaultValue);
