import { useSyncExternalStore } from "react";

let active = false;
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => active;

export const setChildProfileSubpageActive = (value: boolean) => {
  if (active === value) return;
  active = value;
  listeners.forEach((l) => l());
};

export const useChildProfileSubpageActive = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
