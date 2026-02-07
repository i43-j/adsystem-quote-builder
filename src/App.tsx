import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/LoginScreen";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import QuotationPage from "./pages/QuotationPage";
import InvoicePage from "./pages/InvoicePage";
import PurchaseOrderPage from "./pages/PurchaseOrderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LoginRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/quotation" replace />;
  return <LoginScreen />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/quotation" element={<QuotationPage />} />
              <Route path="/invoice" element={<InvoicePage />} />
              <Route path="/purchase-order" element={<PurchaseOrderPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
