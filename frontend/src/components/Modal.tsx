import React, { useEffect } from 'react';

// 1. Define component props interface
interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export function Modal({
  open,
  title,
  children,
  onClose,
  className = "",
}: ModalProps) {
  // 2. Close modal on "Escape" key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Backdrop overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Dialog Content */}
      <div
        className={`
          w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto
          ${className}
        `.trim()}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 text-gray-700">{children}</div>
      </div>
    </div>
  );
}

export default Modal;