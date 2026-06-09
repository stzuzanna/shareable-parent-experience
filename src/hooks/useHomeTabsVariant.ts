import { useSyncExternalStore } from "react";

export type HomeTabsVariant = "underline" | "pills";

const STORAGE_KEY = "homeTabsVariant";

const readInitial = (): HomeTabsVariant => {
  if (typeof window === "undefined") return "underline";
  return (sessionStorage.getItem(STORAGE_KEY) as HomeTabsVariant) || "underline";
};

let variantValue: HomeTabsVariant = readInitial();
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => variantValue;

export const setHomeTabsVariant = (value: HomeTabsVariant) => {
  if (variantValue === value) return;
  variantValue = value;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, value);
  }
  listeners.forEach((l) => l());
};

export const useHomeTabsVariant = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
