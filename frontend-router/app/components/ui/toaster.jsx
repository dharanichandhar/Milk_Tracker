import * as React from 'react';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

const ToastContext = React.createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    const handler = (e) => addToast(e.detail);
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex w-auto max-w-[420px] mx-auto sm:left-auto sm:right-4 sm:mx-0 flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        >
          <ToastTitle>{toast.title}</ToastTitle>
          {toast.description && (
            <ToastDescription>{toast.description}</ToastDescription>
          )}
        </Toast>
      ))}
    </div>
  );
}

export const toast = {
  success: (title, description) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { variant: 'success', title, description },
      })
    );
  },
  error: (title, description) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { variant: 'destructive', title, description },
      })
    );
  },
  warning: (title, description) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { variant: 'warning', title, description },
      })
    );
  },
  default: (title, description) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { variant: 'default', title, description },
      })
    );
  },
};
