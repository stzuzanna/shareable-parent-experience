import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface GlobalUiContextValue {
  hideGlobalFab: boolean;
  setHideGlobalFab: (hidden: boolean) => void;
  openAddSheet: () => void;
  registerAddSheetOpener: (opener: (() => void) | null) => void;
}

const GlobalUiContext = createContext<GlobalUiContextValue | null>(null);

export const GlobalUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideGlobalFab, setHideGlobalFabState] = useState(false);
  const openerRef = useRef<(() => void) | null>(null);

  const setHideGlobalFab = useCallback((hidden: boolean) => {
    setHideGlobalFabState(hidden);
  }, []);

  const registerAddSheetOpener = useCallback((opener: (() => void) | null) => {
    openerRef.current = opener;
  }, []);

  const openAddSheet = useCallback(() => {
    openerRef.current?.();
  }, []);

  const value = useMemo(
    () => ({ hideGlobalFab, setHideGlobalFab, openAddSheet, registerAddSheetOpener }),
    [hideGlobalFab, setHideGlobalFab, openAddSheet, registerAddSheetOpener],
  );

  return <GlobalUiContext.Provider value={value}>{children}</GlobalUiContext.Provider>;
};

export const useGlobalUi = (): GlobalUiContextValue => {
  const ctx = useContext(GlobalUiContext);
  if (!ctx) {
    throw new Error("useGlobalUi must be used within GlobalUiProvider");
  }
  return ctx;
};
