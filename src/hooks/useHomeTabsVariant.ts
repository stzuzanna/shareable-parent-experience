import { useSyncExternalStore } from "react";

// "sidekick" is a slightly hidden third version of the prototype, reached by
// tapping the "Ask Sidekick for help" bar inside the pills GAB. It renders a
// dedicated SidekickHome canvas used for in-context sidekick explorations.
export type HomeTabsVariant = "underline" | "pills" | "sidekick";

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
