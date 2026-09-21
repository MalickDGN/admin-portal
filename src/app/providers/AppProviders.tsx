import type { ReactNode } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { AuthProvider } from "@services/auth/AuthProvider";
import { ToastProvider } from "@/components/feedback/Toast/ToastProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// HashRouter uniquement pour les environnements sans réécriture d'URL côté
// serveur (ex. preview statique) — VITE_ROUTER_MODE=hash. Par défaut,
// BrowserRouter (comportement inchangé pour un déploiement normal).
const Router = import.meta.env.VITE_ROUTER_MODE === "hash" ? HashRouter : BrowserRouter;

/**
 * Point d'entrée unique pour tous les providers globaux.
 * Ajouter ici tout nouveau provider transverse (i18n, RBAC, etc.)
 * plutôt que d'empiler des providers dans main.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>{children}</Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
