import React, { createContext, useCallback, useContext, useState } from "react";
import { Toast } from "../components/Toast/Toast";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  id: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  /** `absolute` inside device frame, `fixed` on mobile viewport */
  position?: "absolute" | "fixed";
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "fixed",
}) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    const newToast: ToastState = { message, type, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`${position} top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none`}>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              inline
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useAppToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useAppToast must be used within ToastProvider");
  }
  return ctx;
};
