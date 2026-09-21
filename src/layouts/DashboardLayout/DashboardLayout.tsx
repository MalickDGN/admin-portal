import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/navigation/Sidebar/Sidebar";
import { Header } from "@/components/navigation/Header/Header";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell" data-sidebar-collapsed={collapsed}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="app-content">
        <Header />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
