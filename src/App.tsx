import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLockScreen } from "@/components/AppLockScreen";
import { useAppLock } from "@/hooks/useAppLock";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PreTesting from "./pages/PreTesting";
import BetaPortal from "./pages/BetaPortal";
import TransactionTesting from "./pages/TransactionTesting";





const queryClient = new QueryClient();

const AppContent = () => {
  const { isLocked, unlock } = useAppLock();

  return (
    <>
      {isLocked && <AppLockScreen onUnlock={unlock} />}
      <Toaster />
      <Sonner />
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Index />} />
          <Route path="/subscriptions" element={<Index />} />
          <Route path="/pre-testing" element={<PreTesting />} />
          <Route path="/beta" element={<BetaPortal />} />
          <Route path="/transaction-testing" element={<TransactionTesting />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />



        </Routes>

      </BrowserRouter>
    </>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);


export default App;

