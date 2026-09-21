import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  name?: string;
}

// Select stylé et accessible au clavier (Entrée/Echap), remplace <select> natif
// quand on veut un rendu cohérent avec le reste du Design System.
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ label, options, value, onChange, placeholder = "Sélectionner...", error, name }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
      if (!open) return;
      function onClickOutside(e: MouseEvent) {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      }
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
      }
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("mousedown", onClickOutside);
        document.removeEventListener("keydown", onKeyDown);
      };
    }, [open]);

    return (
      <div className="select-field" ref={containerRef}>
        {label && <label className="select-field__label">{label}</label>}
        <button
          ref={ref}
          type="button"
          name={name}
          aria-label={label}
          className={clsx("select-field__trigger", error && "select-field__trigger--error")}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={clsx(!selected && "select-field__placeholder")}>{selected ? selected.label : placeholder}</span>
          <ChevronDown size={16} className={clsx("select-field__chevron", open && "select-field__chevron--open")} />
        </button>
        {open && (
          <ul className="select-field__menu" role="listbox">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={clsx("select-field__option", option.value === value && "select-field__option--active")}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  {option.value === value && <Check size={14} />}
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && <span className="select-field__error">{error}</span>}
      </div>
    );
  },
);
Select.displayName = "Select";
