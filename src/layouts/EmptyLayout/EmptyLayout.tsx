import { Outlet } from "react-router-dom";

// Layout sans sidebar/header, pour écrans plein cadre (ex. impression, onboarding).
export function EmptyLayout() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Outlet />
    </div>
  );
}
