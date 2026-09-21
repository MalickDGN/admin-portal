import { Clock } from "lucide-react";
import clsx from "clsx";
import { Popover } from "@ui/Popover/Popover";
import "./TimePicker.css";

interface TimePickerProps {
  label?: string;
  /** Heure au format "HH:mm", ou null si non renseignée */
  value: string | null;
  onChange: (time: string) => void;
  placeholder?: string;
  /** Pas des minutes proposées (5, 15, 30...) */
  minuteStep?: number;
}

const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"));

function minutesFor(step: number) {
  return Array.from({ length: Math.ceil(60 / step) }, (_, i) => String(i * step).padStart(2, "0"));
}

/**
 * Sélecteur d'heure léger, sans dépendance externe, sur le même principe
 * que DatePicker (Popover + deux colonnes défilantes heures/minutes).
 */
export function TimePicker({ label, value, onChange, placeholder = "hh:mm", minuteStep = 5 }: TimePickerProps) {
  const [hour, minute] = value ? value.split(":") : [null, null];
  const minutes = minutesFor(minuteStep);

  function select(nextHour: string, nextMinute: string) {
    onChange(`${nextHour}:${nextMinute}`);
  }

  return (
    <div className="time-picker-field">
      {label && <label className="time-picker-field__label">{label}</label>}
      <Popover
        trigger={({ onClick, ref }) => (
          <button type="button" ref={ref as never} className="time-picker-field__trigger" onClick={onClick}>
            <Clock size={16} />
            <span className={clsx(!value && "time-picker-field__placeholder")}>{value ?? placeholder}</span>
          </button>
        )}
      >
        <div className="time-picker">
          <div className="time-picker__column" role="listbox" aria-label="Heures">
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                className={clsx("time-picker__option", h === hour && "time-picker__option--active")}
                onClick={() => select(h, minute ?? minutes[0])}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="time-picker__column" role="listbox" aria-label="Minutes">
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                className={clsx("time-picker__option", m === minute && "time-picker__option--active")}
                onClick={() => select(hour ?? HOURS[0], m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
}
