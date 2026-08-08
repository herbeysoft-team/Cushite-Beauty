import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";

function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3
              className="text-xl font-bold text-[var(--primary)]"
              style={{ fontFamily: "Playfair Display" }}
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto text-[var(--text-light)] hover:text-[var(--text)]"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
