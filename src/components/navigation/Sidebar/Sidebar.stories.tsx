import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "@services/auth/AuthProvider";
import { Sidebar } from "./Sidebar";

// La Sidebar filtre ses entrées selon le rôle courant (voir nav-config.ts) :
// ce petit composant simule une connexion pour que les stories montrent le
// menu complet, plutôt qu'un menu vide (état par défaut de AuthProvider).
function AutoLogin({ role, children }: { role: "ADMIN" | "USER"; children: React.ReactNode }) {
  const { login } = useAuth();
  useEffect(() => {
    login({ id: "1", name: "Demo", email: "demo@adaa.sn", role, permissions: ["*"] }, "mock-token");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

function SidebarDemo({ role }: { role: "ADMIN" | "USER" }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AuthProvider>
        <AutoLogin role={role}>
          <div style={{ height: 520 }}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
          </div>
        </AutoLogin>
      </AuthProvider>
    </MemoryRouter>
  );
}

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          "Le menu (nav-config.ts) filtre ses entrées selon le rôle connecté — comparer les stories Admin et Utilisateur : " +
          "\"Clients\" n'apparaît que pour ADMIN/MANAGER.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const AsAdmin: Story = { render: () => <SidebarDemo role="ADMIN" /> };
export const AsRegularUser: Story = { render: () => <SidebarDemo role="USER" /> };
