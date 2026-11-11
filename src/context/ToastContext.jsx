import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Check, CircleAlert, X } from 'lucide-react';

const ToastContext = createContext(null);
const TOAST_DURATION_MS = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  /** showToast('Added to cart', { tone: 'success' | 'info', action: { label, onClick } }) */
  const showToast = useCallback(
    (message, { tone = 'success', action } = {}) => {
      const id = ++nextId.current;
      // Keep at most three toasts on screen; newest last.
      setToasts((current) => [...current.slice(-2), { id, message, tone, action }]);
      timers.current.set(id, setTimeout(() => dismiss(id), TOAST_DURATION_MS));
    },
    [dismiss],
  );

  const clearToasts = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setToasts([]);
  }, []);

  const api = useMemo(() => ({ showToast, clearToasts }), [showToast, clearToasts]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tone}`}>
            {toast.tone === 'success' ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <CircleAlert size={16} aria-hidden="true" />
            )}
            <span className="toast__message">{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                className="toast__action"
                onClick={() => {
                  toast.action.onClick();
                  dismiss(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              className="toast__close"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook lives beside its provider; fast refresh still works for the provider.
// oxlint-disable-next-line react/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context.showToast;
}

// oxlint-disable-next-line react/only-export-components
export function useClearToasts() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useClearToasts must be used inside ToastProvider');
  return context.clearToasts;
}
