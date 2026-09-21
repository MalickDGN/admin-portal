import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./Drawer.css";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  side?: "left" | "right";
}

export function Drawer({ open, onClose, title, children, side = "right" }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="drawer__overlay" onMouseDown={onClose} role="presentation">
      <div
        className={`drawer drawer--${side}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="drawer__header">
          <h3 className="drawer__title">{title}</h3>
          <button type="button" className="drawer__close" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
