import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import clsx from "clsx";
import { Popover } from "@ui/Popover/Popover";
import "./DatePicker.css";

interface DatePickerProps {
  label?: string;
  value: string | null;
  onChange: (isoDate: string) => void;
  placeholder?: string;
}

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

// Sélecteur de date léger, sans dépendance externe. Pour un time picker,
// composer avec un <input type="time"> stylé via FormField en attendant
// une variante dédiée.
export function DatePicker({ label, value, onChange, placeholder = "jj/mm/aaaa" }: DatePickerProps) {
  const initial = value ? new Date(value) : new Date();
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() });

  const cells = buildMonthGrid(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  function shiftMonth(delta: number) {
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <div className="date-picker-field">
      {label && <label className="date-picker-field__label">{label}</label>}
      <Popover
        trigger={({ onClick, ref }) => (
          <button type="button" ref={ref as never} className="date-picker-field__trigger" onClick={onClick}>
            <Calendar size={16} />
            <span className={clsx(!value && "date-picker-field__placeholder")}>
              {value ? new Date(value).toLocaleDateString("fr-FR") : placeholder}
            </span>
          </button>
        )}
      >
        <div className="date-picker">
          <div className="date-picker__header">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Mois précédent">
              <ChevronLeft size={16} />
            </button>
            <span>{monthLabel}</span>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="Mois suivant">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="date-picker__weekdays">
            {WEEKDAYS.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
          <div className="date-picker__grid">
            {cells.map((date, i) =>
              date ? (
                <button
                  key={i}
                  type="button"
                  className={clsx("date-picker__day", value === toISODate(date) && "date-picker__day--active")}
                  onClick={() => onChange(toISODate(date))}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
}
