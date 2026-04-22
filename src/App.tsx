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
import SubscriptionPlans from "./pages/SubscriptionPlans";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import BrandColors from "./pages/BrandColors";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardPosts from "./pages/DashboardPosts";
import DashboardComments from "./pages/DashboardComments";
import DashboardPlaces from "./pages/DashboardPlaces";

import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider defaultLanguage="en">
        <ThemeProvider defaultTheme="light" storageKey="hayy-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes - No Subscription Required */}
                <Route
                  path="/profile-setup"
                  element={
                    <ProtectedRoute>
                      <ProfileSetup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/business/onboarding"
                  element={
                      <BusinessOnboarding />
                  }
                />
                <Route
                  path="/onboarding/pending"
                  element={
                    <ProtectedRoute>
                      <OnboardingPending />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription-plans"
                  element={
                    <ProtectedRoute>
                      <SubscriptionPlans />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/success"
                  element={
                    <ProtectedRoute>
                      <PaymentSuccess />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes - Subscription Required */}
                <Route
  path="/dashboard"
  element={
    <ProtectedRoute requireSubscription={false}>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  {/* ✅ Nested Routes */}
  <Route index element={<Dashboard />} />
  <Route path="posts" element={<DashboardPosts />} />
  <Route path="comments" element={<DashboardComments />} />
  <Route path="places" element={<DashboardPlaces />} />
  {/* <Route path="ratings" element={<DashboardRatings />} />
  <Route path="colors" element={<BrandColors />} />
  <Route path="settings" element={<DashboardSettings />} /> */}
</Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </Provider>
  </GoogleOAuthProvider>

);

export default App;