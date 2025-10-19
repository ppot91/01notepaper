'use client';

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ToastVariant = "info" | "error" | "success";

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  notify: (message: string, variant?: ToastVariant, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-72 border border-black/15 bg-white px-4 py-3 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-black/70">{toast.variant}</p>
          <p className="mt-1 font-serif text-lg leading-tight text-black">{toast.message}</p>
        </div>
      ))}
    </div>,
    document.body
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, variant: ToastVariant = "info", durationMs = 3200) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, durationMs);
    return () => clearTimeout(timer);
  }, []);

  const value = useMemo(
    () => ({
      notify
    }),
    [notify]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
