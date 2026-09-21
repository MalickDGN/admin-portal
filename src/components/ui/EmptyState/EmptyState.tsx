import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import "./EmptyState.css";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * État vide illustré, générique (§14 — gestion des états). À utiliser
 * partout où une liste ou un résultat de recherche peut être vide :
 * DataTable, résultats de recherche, dashboards sans données, etc.
 */
export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
