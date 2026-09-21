import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import clsx from "clsx";
import type { SelectOption } from "./Select";
import "./Select.css";

interface MultiSelectProps {
  label?: string;
  options: SelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ label, options, values, onChange, placeholder = "Sélectionner..." }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOptions = options.filter((o) => values.includes(o.value));

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function toggleValue(value: string) {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  }

  return (
    <div className="select-field" ref={containerRef}>
      {label && <label className="select-field__label">{label}</label>}
      <button type="button" className="select-field__trigger" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span className={clsx("select-field__tags", !selectedOptions.length && "select-field__placeholder")}>
          {selectedOptions.length ? (
            selectedOptions.map((o) => (
              <span key={o.value} className="select-field__tag">
                {o.label}
                <X
                  size={12}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleValue(o.value);
                  }}
                />
              </span>
            ))
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown size={16} className={clsx("select-field__chevron", open && "select-field__chevron--open")} />
      </button>
      {open && (
        <ul className="select-field__menu" role="listbox">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={clsx("select-field__option", values.includes(option.value) && "select-field__option--active")}
                role="option"
                aria-selected={values.includes(option.value)}
                onClick={() => toggleValue(option.value)}
              >
                {option.label}
                {values.includes(option.value) && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
