import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, verificationStatus, hasActiveSubscription } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // إذا لم يكن مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // إذا كان Status = New (لم يكمل Onboarding)
  if (verificationStatus === 'New' && location.pathname !== '/business/onboarding') {
    return <Navigate to="/business/onboarding" replace />;
  }

  // إذا كان Status = Pending (في انتظار الموافقة)
  if (
    (verificationStatus === 'Pending' || verificationStatus === 'PendingVerification') &&
    location.pathname !== '/onboarding/pending'
  ) {
    return <Navigate to="/onboarding/pending" replace />;
  }

  // إذا كان Approved/Verified ومفيش اشتراك فعال
  if (
    (verificationStatus === 'Approved' || verificationStatus === 'Verified') &&
    !hasActiveSubscription &&
    location.pathname !== '/subscription-plans' &&
    location.pathname !== '/payment' &&
    location.pathname !== '/payment/success'
  ) {
    return <Navigate to="/subscription-plans" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;