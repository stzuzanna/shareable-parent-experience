import { useSyncExternalStore } from 'react';

let autopayValue = false;
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => autopayValue;

export const setAutopay = (value: boolean) => {
  if (autopayValue === value) return;
  autopayValue = value;
  listeners.forEach((l) => l());
};

export const useAutopayState = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
