import { Link, useNavigate } from "react-router-dom";
import { Clock, Mail, CheckCircle, AlertCircle, XCircle, Pause } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

type VerificationStatus = 'New' | 'Pending' | 'Verified' | 'Rejected' | 'Suspended' | 'Approved';

const OnboardingPending = () => {
  const navigate = useNavigate();
  const { verificationStatus } = useAppSelector((state) => state.auth);

  // إذا كان الستاتس Verified/Approved، توجيه للـ Dashboard
  useEffect(() => {
    if (verificationStatus === 'Verified' || verificationStatus === 'Approved') {
      navigate('/dashboard');
    }
  }, [verificationStatus, navigate]);

  const getStatusConfig = (status: VerificationStatus | null) => {
    switch (status) {
      case 'Pending':
        return {
          icon: Clock,
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          title: 'Application Under Review',
          subtitle: 'Thank you for submitting your business documents!',
          messages: [
            'Our team is reviewing your documents',
            'This usually takes 1-3 business days',
            'You\'ll receive an email notification once approved',
          ],
          color: 'blue',
        };

      case 'Verified':
        return {
          icon: CheckCircle,
          iconBg: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          title: 'Application Verified!',
          subtitle: 'Your business has been successfully verified.',
          messages: [
            'You can now access all features',
            'Start creating your business profile',
            'Welcome to Hayy!',
          ],
          color: 'green',
        };

      case 'Rejected':
        return {
          icon: XCircle,
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          title: 'Application Rejected',
          subtitle: 'Unfortunately, your application could not be approved.',
          messages: [
            'Please review the rejection reason in your email',
            'You can submit again with corrected documents',
            'Contact support if you have any questions',
          ],
          color: 'red',
          showResubmit: true,
        };

      case 'Suspended':
        return {
          icon: Pause,
          iconBg: 'bg-orange-100 dark:bg-orange-900/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
          title: 'Account Suspended',
          subtitle: 'Your account has been temporarily suspended.',
          messages: [
            'Check your email for suspension details',
            'Contact our support team for more information',
            'Your account may be reactivated after review',
          ],
          color: 'orange',
          showSupport: true,
        };

      case 'New':
        return {
          icon: Mail,
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          title: 'Complete Your Profile',
          subtitle: 'Please complete your business profile to get started.',
          messages: [
            'Fill in your business information',
            'Upload required documents',
            'Submit for verification',
          ],
          color: 'blue',
          showOnboarding: true,
        };

      default:
        return {
          icon: Clock,
          iconBg: 'bg-gray-100 dark:bg-gray-900/30',
          iconColor: 'text-gray-600 dark:text-gray-400',
          title: 'Loading...',
          subtitle: 'Please wait...',
          messages: [],
          color: 'gray',
        };
    }
  };

  const config = getStatusConfig(verificationStatus as VerificationStatus);
  const Icon = config.icon;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-300',
      heading: 'text-blue-900 dark:text-blue-300',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-300',
      heading: 'text-green-900 dark:text-green-300',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-300',
      heading: 'text-red-900 dark:text-red-300',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-800 dark:text-orange-300',
      heading: 'text-orange-900 dark:text-orange-300',
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800',
      text: 'text-gray-800 dark:text-gray-300',
      heading: 'text-gray-900 dark:text-gray-300',
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mx-auto`}>
              <Icon className={config.iconColor} size={40} />
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {config.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {config.subtitle}
              </p>
            </div>

            {/* Messages */}
            {config.messages.length > 0 && (
              <div className={`${colors.bg} border ${colors.border} rounded-lg p-6`}>
                <h3 className={`font-semibold ${colors.heading} mb-3 flex items-center justify-center gap-2`}>
                  <Mail size={20} />
                  {verificationStatus === 'Rejected' ? 'Rejection Details' : 'What happens next?'}
                </h3>
                <ul className={`text-left space-y-3 ${colors.text}`}>
                  {config.messages.map((message, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                      <span>{message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              {verificationStatus === 'Verified' || verificationStatus === 'Approved' ? (
                <Link
                  to="/subscription-plans"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Choose Your Plan
                </Link>
              ) : verificationStatus === 'Rejected' ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    You can resubmit your application with corrected documents.
                  </p>
                  <Link
                    to="/business/onboarding"
                    className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Resubmit Application
                  </Link>
                </>
              ) : verificationStatus === 'Suspended' ? (
                <a
                  href="mailto:support@hayy.com"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Contact Support
                </a>
              ) : verificationStatus === 'New' ? (
                <Link
                  to="/business/onboarding"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Continue to Onboarding
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Go to Dashboard
                </Link>
              )}

              {/* Secondary Button */}
              {verificationStatus !== 'Verified' && verificationStatus !== 'Approved' && (
                <Link
                  to="/dashboard"
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-medium py-2"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPending;