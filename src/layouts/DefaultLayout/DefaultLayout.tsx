import { Outlet } from "react-router-dom";
import { Header } from "@/components/navigation/Header/Header";

// Layout public (hors dashboard), sans sidebar.
export function DefaultLayout() {
  return (
    <div>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
