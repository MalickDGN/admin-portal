import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "@services/auth/AuthProvider";
import { Header } from "./Header";

function AutoLogin({ children }: { children: React.ReactNode }) {
  const { login } = useAuth();
  useEffect(() => {
    login({ id: "1", name: "M.DGN", email: "demo@adaa.sn", role: "ADMIN", permissions: ["*"] }, "mock-token");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof Header> = {
  title: "Navigation/Header",
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/ecommerce/products"]}>
        <AuthProvider>
          <AutoLogin>
            <Story />
          </AutoLogin>
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
