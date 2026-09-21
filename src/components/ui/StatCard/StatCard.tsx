import type { ReactNode } from "react";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "../Card/Card";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}

// Composant réutilisable, ex. d'usage :
// <StatCard title="Revenue" value="125 000 €" trend="+12.5%" trendType="positive" />
export function StatCard({ title, value, trend, trendType = "neutral", icon }: StatCardProps) {
  return (
    <Card className="stat-card">
      <div className="stat-card__row">
        <div>
          <p className="stat-card__title">{title}</p>
          <p className="stat-card__value">{value}</p>
        </div>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>
      {trend && (
        <span className={clsx("stat-card__trend", `stat-card__trend--${trendType}`)}>
          {trendType === "positive" && <ArrowUpRight size={14} />}
          {trendType === "negative" && <ArrowDownRight size={14} />}
          {trend}
        </span>
      )}
    </Card>
  );
}
