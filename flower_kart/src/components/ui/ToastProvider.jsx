import { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    badge: "bg-emerald-500/12 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  error: {
    badge: "bg-rose-500/12 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  info: {
    badge: "bg-slate-900 text-white border-slate-900",
    dot: "bg-white",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (toasts.length === 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 3200);

    return () => clearTimeout(timer);
  }, [toasts]);

  const notify = ({ title, message, type = "info" }) => {
    setToasts((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        message,
        type,
      },
    ]);
  };

  const dismiss = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex flex-col items-center gap-3 px-4">
        {toasts.map((toast) => {
          const styles = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-3xl border px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur ${styles.badge}`}
            >
              <span className={`mt-1 h-2.5 w-2.5 flex-none rounded-full ${styles.dot}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? (
                  <p className="mt-1 text-sm opacity-85">{toast.message}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-full p-1 text-current/70 transition hover:bg-black/5 hover:text-current"
                aria-label="Dismiss notification"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
