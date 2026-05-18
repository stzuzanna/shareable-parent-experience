import { useSyncExternalStore } from 'react';

let isPaidValue = false;
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => isPaidValue;

export const setPaid = (value: boolean) => {
  if (isPaidValue === value) return;
  isPaidValue = value;
  listeners.forEach((l) => l());
};

export const usePaymentState = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
