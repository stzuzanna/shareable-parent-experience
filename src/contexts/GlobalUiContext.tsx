import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface GlobalUiContextValue {
  hideGlobalFab: boolean;
  setHideGlobalFab: (hidden: boolean) => void;
  openAddSheet: () => void;
  closeAddSheet: () => void;
  toggleAddSheet: () => void;
  addSheetOpen: boolean;
  registerAddSheetOpener: (opener: (() => void) | null) => void;
  registerAddSheetCloser: (closer: (() => void) | null) => void;
  setAddSheetOpen: (open: boolean) => void;
}

const GlobalUiContext = createContext<GlobalUiContextValue | null>(null);

export const GlobalUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideGlobalFab, setHideGlobalFabState] = useState(false);
  const [addSheetOpen, setAddSheetOpenState] = useState(false);
  const openerRef = useRef<(() => void) | null>(null);
  const closerRef = useRef<(() => void) | null>(null);

  const setHideGlobalFab = useCallback((hidden: boolean) => {
    setHideGlobalFabState(hidden);
  }, []);

  const registerAddSheetOpener = useCallback((opener: (() => void) | null) => {
    openerRef.current = opener;
  }, []);

  const registerAddSheetCloser = useCallback((closer: (() => void) | null) => {
    closerRef.current = closer;
  }, []);

  const setAddSheetOpen = useCallback((open: boolean) => {
    setAddSheetOpenState(open);
  }, []);

  const openAddSheet = useCallback(() => {
    openerRef.current?.();
    setAddSheetOpenState(true);
  }, []);

  const closeAddSheet = useCallback(() => {
    closerRef.current?.();
    setAddSheetOpenState(false);
  }, []);

  const toggleAddSheet = useCallback(() => {
    if (addSheetOpen) {
      closerRef.current?.();
      setAddSheetOpenState(false);
    } else {
      openerRef.current?.();
      setAddSheetOpenState(true);
    }
  }, [addSheetOpen]);

  const value = useMemo(
    () => ({
      hideGlobalFab,
      setHideGlobalFab,
      openAddSheet,
      closeAddSheet,
      toggleAddSheet,
      addSheetOpen,
      registerAddSheetOpener,
      registerAddSheetCloser,
      setAddSheetOpen,
    }),
    [hideGlobalFab, setHideGlobalFab, openAddSheet, closeAddSheet, toggleAddSheet, addSheetOpen, registerAddSheetOpener, registerAddSheetCloser, setAddSheetOpen],
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
