import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfileSetup from "./pages/ProfileSetup";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import OnboardingPending from "./pages/OnboardingPending";
import Dashboard from "./pages/Dashboard";
import BrandColors from "./pages/BrandColors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider defaultLanguage="en">
        <ThemeProvider defaultTheme="light" storageKey="hayy-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/business/onboarding" element={<BusinessOnboarding />} />
                <Route path="/onboarding/pending" element={<OnboardingPending />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/colors" element={<BrandColors />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;