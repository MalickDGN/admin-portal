import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import "./FormField.css";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightSlot?: ReactNode;
}

// Wrapper standardisé label + input + message d'erreur, pensé pour React Hook Form :
// <FormField label="Nom" error={errors.name?.message} {...register("name")} />
// forwardRef est indispensable ici : register() renvoie une ref que RHF utilise
// pour lire la valeur de l'input à la soumission (mode non contrôlé). Sans
// transmission de cette ref jusqu'au <input> natif, RHF ne voit jamais ce que
// l'utilisateur a saisi.
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, rightSlot, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-field__label">
          {label}
        </label>
        <div className="form-field__control">
          <input ref={ref} id={inputId} className="form-field__input" aria-invalid={Boolean(error)} {...rest} />
          {rightSlot}
        </div>
        {error && <span className="form-field__error">{error}</span>}
      </div>
    );
  },
);
FormField.displayName = "FormField";
