import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import "./Card.css";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  actions?: ReactNode;
  noPadding?: boolean;
}

export function Card({ title, actions, noPadding, className, children, ...rest }: CardProps) {
  return (
    <div className={clsx("card", className)} {...rest}>
      {(title || actions) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      <div className={clsx("card__body", noPadding && "card__body--flush")}>{children}</div>
    </div>
  );
}
