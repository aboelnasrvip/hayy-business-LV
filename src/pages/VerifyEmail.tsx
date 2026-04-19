import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle, Loader, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/authService";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  
  // Rate Limiting
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState("");

  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }

    // استرجاع المحاولات من localStorage
    const storedData = localStorage.getItem(`otp_attempts_${emailFromUrl}`);
    if (storedData) {
      const { count, lockTime } = JSON.parse(storedData);
      setAttempts(count);
      
      if (lockTime && Date.now() < lockTime) {
        setIsLocked(true);
        setLockEndTime(lockTime);
      } else {
        // انتهى وقت القفل
        localStorage.removeItem(`otp_attempts_${emailFromUrl}`);
        setAttempts(0);
      }
    }
  }, [searchParams]);

  // Update remaining time every second
  useEffect(() => {
    if (!isLocked || !lockEndTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = lockEndTime - now;

      if (remaining <= 0) {
        setIsLocked(false);
        setLockEndTime(null);
        setAttempts(0);
        localStorage.removeItem(`otp_attempts_${email}`);
        clearInterval(interval);
        toast.success("You can now try again!");
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockEndTime, email]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`) as HTMLInputElement;
    lastInput?.focus();
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      toast.error("Email is missing. Please try again.");
      return;
    }

    if (isLocked) {
      toast.error(`Too many attempts. Please wait ${remainingTime}`);
      return;
    }

    setStatus("loading");

    try {
      await authAPI.verifyEmailOtp({ email, otp: otpCode });
      
      setStatus("success");
      toast.success("Email verified successfully!");
      
      // مسح المحاولات بعد النجاح
      localStorage.removeItem(`otp_attempts_${email}`);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      const errorMessage = error.response?.data?.title || error.message || "Verification failed";
      toast.error(errorMessage);

      // زيادة عدد المحاولات
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCK_DURATION;
        setIsLocked(true);
        setLockEndTime(lockTime);
        
        localStorage.setItem(`otp_attempts_${email}`, JSON.stringify({
          count: newAttempts,
          lockTime: lockTime
        }));

        toast.error(`Too many failed attempts. Please wait 1 hour before trying again.`);
      } else {
        localStorage.setItem(`otp_attempts_${email}`, JSON.stringify({
          count: newAttempts,
          lockTime: null
        }));
        
        const remaining = MAX_ATTEMPTS - newAttempts;
        toast.warning(`${remaining} attempt${remaining > 1 ? 's' : ''} remaining`);
      }

      // مسح الـ OTP
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (isLocked) {
      toast.error(`Please wait ${remainingTime} before requesting a new code`);
      return;
    }

    setIsResending(true);
    try {
      await authAPI.resendConfirmation(email);
      toast.success("Verification code sent! Check your email.");
      setOtp(["", "", "", "", "", ""]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.title || "Failed to resend code";
      toast.error(errorMessage);
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
          {status === "success" ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Email Verified!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Redirecting you to login...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-primary" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Verify Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We sent a 6-digit code to
                  <br />
                  <span className="font-semibold text-gray-900 dark:text-white">{email || "your email"}</span>
                </p>
              </div>

              {/* Attempts Warning */}
              {attempts > 0 && !isLocked && (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <p className="text-sm">
                    {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts > 1 ? 's' : ''} remaining
                  </p>
                </div>
              )}

              {/* Locked Warning */}
              {isLocked && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Account Temporarily Locked</p>
                      <p className="text-sm mt-1">
                        Too many failed attempts. Please wait {remainingTime} before trying again.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!email && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isLocked}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>
              </div>

              {status === "error" && !isLocked && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Verification Failed</p>
                    <p className="text-sm mt-1">Please check the code and try again.</p>
                  </div>
                </div>
              )}

              <button
                onClick={verifyOtp}
                disabled={status === "loading" || otp.join("").length !== 6 || isLocked}
                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {status === "loading" ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={isResending || isLocked}
                  className="text-primary hover:text-orange-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;