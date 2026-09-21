import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout/AuthLayout";
import { PageLoader } from "@ui/PageLoader/PageLoader";

// Lazy loading : chaque feature/page est chargée à la demande (code splitting).
const DashboardPage = lazy(() => import("@features/dashboard/DashboardPage"));
const ProductsPage = lazy(() => import("@features/ecommerce/products/ProductsPage"));
const OrdersPage = lazy(() => import("@features/ecommerce/orders/OrdersPage"));
const CustomersPage = lazy(() => import("@features/ecommerce/customers/CustomersPage"));
const SettingsPage = lazy(() => import("@features/settings/SettingsPage"));
const LoginPage = lazy(() => import("@features/settings/LoginPage"));
const NotFoundPage = lazy(() => import("@ui/ErrorPages/NotFoundPage"));
const ForbiddenPage = lazy(() => import("@ui/ErrorPages/ForbiddenPage"));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

export function AppRoutes() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [{ path: "login", element: withSuspense(<LoginPage />) }],
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: withSuspense(<DashboardPage />) },
        {
          path: "ecommerce",
          children: [
            { index: true, element: <Navigate to="products" replace /> },
            { path: "products", element: withSuspense(<ProductsPage />) },
            { path: "orders", element: withSuspense(<OrdersPage />) },
            {
              path: "customers",
              element: (
                <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                  {withSuspense(<CustomersPage />)}
                </ProtectedRoute>
              ),
            },
          ],
        },
        { path: "settings", element: withSuspense(<SettingsPage />) },
      ],
    },
    { path: "/403", element: withSuspense(<ForbiddenPage />) },
    { path: "*", element: withSuspense(<NotFoundPage />) },
  ]);
}
