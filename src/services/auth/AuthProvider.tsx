import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "ADMIN" | "MANAGER" | "USER" | "READ_ONLY";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Couche RBAC volontairement indépendante du backend :
// remplacer login()/logout() par de vrais appels API sans toucher au reste de l'app.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (u, token) => {
        localStorage.setItem("adaa-auth-token", token);
        setUser(u);
      },
      logout: () => {
        localStorage.removeItem("adaa-auth-token");
        setUser(null);
      },
      hasRole: (roles) => {
        if (!user) return false;
        const list = Array.isArray(roles) ? roles : [roles];
        return list.includes(user.role);
      },
      hasPermission: (permission) => Boolean(user?.permissions.includes(permission)),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
