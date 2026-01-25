import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";

import { AppLayout } from "@/pages/_layouts/app";
import { AuthLayout } from "@/pages/_layouts/auth";
import { Dashboard } from "@/pages/app/dashboard";
import { SignIn } from "@/pages/auth/sign-in";
import { SignUp } from "@/pages/auth/sign-up";

export function App() {
  return (
    <>
      <HelmetProvider>
        <Toaster richColors />
        <Helmet titleTemplate="%s | pizza.shop" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </>
  );
}
