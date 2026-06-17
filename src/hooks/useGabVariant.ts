import { useSyncExternalStore } from "react";

export type GabVariant = "arc" | "grid" | "pills";

const STORAGE_KEY = "gabVariant";

const readInitial = (): GabVariant => {
  if (typeof window === "undefined") return "pills";
  return (sessionStorage.getItem(STORAGE_KEY) as GabVariant) || "pills";
};

let variantValue: GabVariant = readInitial();
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => variantValue;

export const setGabVariant = (value: GabVariant) => {
  if (variantValue === value) return;
  variantValue = value;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, value);
  }
  listeners.forEach((l) => l());
};

export const useGabVariant = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
