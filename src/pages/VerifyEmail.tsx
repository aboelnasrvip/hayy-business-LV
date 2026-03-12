import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { authAPI } from "@/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { resendConfirmation } from "@/store/slices/authSlice";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("pending");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  
  // استخراج userId و token من الـ URL
  const extractParamsFromUrl = () => {
    let userId = searchParams.get("userId");
    let token = searchParams.get("token");

    if (!userId || !token) {
      const fullUrl = window.location.href;
      const urlParams = new URLSearchParams(fullUrl.split('?')[1]);
      userId = urlParams.get("userId");
      token = urlParams.get("token");
    }

    return { userId, token };
  };

  const { userId, token } = extractParamsFromUrl();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (userId && token) {
      verifyEmail();
    }
  }, [userId, token]);

  const verifyEmail = async () => {
    if (!userId || !token) return;
    
    setStatus("loading");
    try {
      await authAPI.confirmEmail(userId, token);
      setStatus("success");
      toast.success("Email verified successfully! Redirecting to onboarding...");
      
      // 🎯 التوجيه لصفحة Business Onboarding
      setTimeout(() => navigate("/business/onboarding"), 2500);
    } catch (error: any) {
      setStatus("error");
      const errorMessage = error?.response?.data?.title || error?.response?.data?.message || "Email verification failed";
      toast.error(errorMessage);
      console.error("Verification error:", error);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsResending(true);
    try {
      await dispatch(resendConfirmation(email)).unwrap();
      toast.success("Verification email sent! Please check your inbox.");
      setStatus("pending");
    } catch (error: any) {
      toast.error(error || "Failed to resend email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-4">
            {status === "loading" && (
              <>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="text-blue-600 dark:text-blue-400 animate-spin" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Email Verified!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your email has been successfully verified.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    🎉 Redirecting you to complete your business profile...
                  </p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verification Failed
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  The verification link is invalid or has expired.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Please request a new verification email below.
                </p>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  onClick={handleResendEmail}
                  disabled={isResending || !email}
                  className="mt-4 w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </button>
              </>
            )}

            {status === "pending" && (
              <>
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="text-primary dark:text-orange-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Check Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a verification link to your email address. Please click the link to verify your account.
                </p>
                {email && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Email sent to: <strong>{email}</strong>
                  </p>
                )}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                    Didn't receive the email?
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  onClick={handleResendEmail}
                  disabled={isResending || !email}
                  className="mt-4 w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isResending ? "Sending..." : "Resend Email"}
                </button>
              </>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>

        {/* Instructions */}
        {status === "error" && (userId || token) && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>⚠️ Note:</strong> If you clicked a link from your email that starts with <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">localhost:7248</code>, 
              please use the "Resend Email" button above to get a new verification link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;