import { useSyncExternalStore } from "react";

export type ProfileVariant = "v1" | "v2";

const STORAGE_KEY = "profileVariant";

const readInitial = (): ProfileVariant => {
  if (typeof window === "undefined") return "v1";
  return (sessionStorage.getItem(STORAGE_KEY) as ProfileVariant) || "v1";
};

let variantValue: ProfileVariant = readInitial();
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => variantValue;

export const setProfileVariant = (value: ProfileVariant) => {
  if (variantValue === value) return;
  variantValue = value;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, value);
  }
  listeners.forEach((l) => l());
};

export const useProfileVariant = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
