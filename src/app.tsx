import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppLayout } from "@/pages/_layouts/app";
import { AuthLayout } from "@/pages/_layouts/auth";
import { NotFound } from "@/pages/404";
import { Dashboard } from "@/pages/app/dashboard/dashboard";
import { Orders } from "@/pages/app/orders/orders";
import { SignIn } from "@/pages/auth/sign-in";
import { SignUp } from "@/pages/auth/sign-up";

import { queryClient } from "./lib/react-query";
import { ErrorPage } from "./pages/error";

export function App() {
  return (
    <>
      <HelmetProvider>
        <ThemeProvider defaultTheme="dark" storageKey="pizzashop-theme">
          <Helmet titleTemplate="%s | pizza.shop" />
          <Toaster richColors />
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <ErrorBoundary FallbackComponent={ErrorPage}>
                <Routes>
                  {/* Rotas da Aplicação (Dashboard, etc) */}
                  <Route path="/" element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                  </Route>

                  {/* Rotas de Autenticação */}
                  <Route path="/" element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                  </Route>

                  {/* Rota 404 (Catch-all) */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}
