import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Popover.css";

interface PopoverProps {
  trigger: (props: { onClick: () => void; ref: React.RefObject<HTMLElement> }) => ReactNode;
  children: ReactNode;
  align?: "start" | "end";
}

/**
 * Popover générique : positionne children sous trigger, se ferme au clic
 * extérieur. Base commune pour les menus, filtres avancés, mini-formulaires.
 */
export function Popover({ trigger, children, align = "start" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function toggle() {
    if (!open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: align === "end" ? rect.right + window.scrollX : rect.left + window.scrollX,
      });
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <>
      {trigger({ onClick: toggle, ref: anchorRef })}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="popover"
            style={{
              top: coords.top,
              left: align === "end" ? undefined : coords.left,
              right: align === "end" ? window.innerWidth - coords.left : undefined,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
