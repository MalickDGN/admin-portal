import type { HTMLAttributes } from "react";
import clsx from "clsx";
import "./Badge.css";

type BadgeTone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span className={clsx("badge", `badge--${tone}`, className)} {...rest}>
      {children}
    </span>
  );
}
