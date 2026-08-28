import React, { useEffect } from 'react';

// 1. Define allowed toast types strictly
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// 2. Define component props interface
interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // Auto-dismiss duration in milliseconds (e.g. 3000)
  onClose?: () => void;
  className?: string;
}

// 3. Move style lookup outside the render loop
const TOAST_STYLES: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-amber-600 text-white',
};

export function Toast({
  message,
  type = 'success',
  duration,
  onClose,
  className = '',
}: ToastProps) {
  // Optional auto-dismiss functionality
  useEffect(() => {
    if (!duration || !onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Fallback styling if an untyped value gets passed
  const colorStyle = TOAST_STYLES[type] ?? TOAST_STYLES.success;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed bottom-5 right-5 z-50
        flex items-center gap-3
        rounded-lg px-5 py-3
        shadow-lg transition-all
        ${colorStyle}
        ${className}
      `.trim()}
    >
      <span>{message}</span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-2 rounded-md p-1 hover:bg-black/10 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Toast;