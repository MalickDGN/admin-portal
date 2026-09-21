import { ShoppingCart, Users, DollarSign, Package } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { StatCard } from "@ui/StatCard/StatCard";
import { Card } from "@ui/Card/Card";
import { revenueSeries, recentOrders } from "./dashboard.mock";
import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Dashboard</h1>

      <div className="dashboard-page__stats">
        <StatCard title="Revenu" value="125 000 €" trend="+12.5%" trendType="positive" icon={<DollarSign size={18} />} />
        <StatCard title="Commandes" value="1 284" trend="+4.1%" trendType="positive" icon={<ShoppingCart size={18} />} />
        <StatCard title="Clients" value="892" trend="-1.2%" trendType="negative" icon={<Users size={18} />} />
        <StatCard title="Produits" value="214" trend="stable" trendType="neutral" icon={<Package size={18} />} />
      </div>

      <div className="dashboard-page__grid">
        <Card title="Évolution du revenu" className="dashboard-page__chart-card">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="url(#revenueGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Commandes récentes" noPadding>
          <table className="dashboard-page__table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`dashboard-page__status dashboard-page__status--${order.status}`}>
                      {order.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
