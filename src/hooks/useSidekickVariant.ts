import { useSyncExternalStore } from "react";

export type SidekickVariant = "off" | "on";

const STORAGE_KEY = "sidekickVariant";

const readInitial = (): SidekickVariant => {
  if (typeof window === "undefined") return "off";
  return (sessionStorage.getItem(STORAGE_KEY) as SidekickVariant) || "off";
};

let variantValue: SidekickVariant = readInitial();
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => variantValue;

export const setSidekickVariant = (value: SidekickVariant) => {
  if (variantValue === value) return;
  variantValue = value;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, value);
  }
  listeners.forEach((l) => l());
};

export const useSidekickVariant = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
