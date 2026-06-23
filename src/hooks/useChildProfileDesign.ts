import { useSyncExternalStore } from "react";

export type ChildProfileDesign = "new" | "classic";

const STORAGE_KEY = "childProfileDesign";

const readInitial = (): ChildProfileDesign => {
  if (typeof window === "undefined") return "new";
  return (sessionStorage.getItem(STORAGE_KEY) as ChildProfileDesign) || "new";
};

let designValue: ChildProfileDesign = readInitial();
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
};

const getSnapshot = () => designValue;

export const setChildProfileDesign = (value: ChildProfileDesign) => {
  if (designValue === value) return;
  designValue = value;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, value);
  }
  listeners.forEach((l) => l());
};

export const useChildProfileDesign = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
