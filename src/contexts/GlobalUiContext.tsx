import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

interface GlobalUiContextValue {
  hideGlobalFab: boolean;
  setHideGlobalFab: (hidden: boolean) => void;
}

const GlobalUiContext = createContext<GlobalUiContextValue | null>(null);

export const GlobalUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideGlobalFab, setHideGlobalFabState] = useState(false);

  const setHideGlobalFab = useCallback((hidden: boolean) => {
    setHideGlobalFabState(hidden);
  }, []);

  const value = useMemo(
    () => ({ hideGlobalFab, setHideGlobalFab }),
    [hideGlobalFab, setHideGlobalFab],
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
