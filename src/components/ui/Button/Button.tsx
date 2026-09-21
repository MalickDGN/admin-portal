import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import "./Button.css";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={clsx("btn", `btn--${variant}`, `btn--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden /> : null}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
