import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/authService";
import { useTheme } from "@/components/ui/ThemeProvider";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState("");

  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 60 * 60 * 1000;

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) setEmail(decodeURIComponent(emailFromUrl));

    const storedData = localStorage.getItem(`otp_attempts_${emailFromUrl}`);
    if (storedData) {
      const { count, lockTime } = JSON.parse(storedData);
      setAttempts(count);
      if (lockTime && Date.now() < lockTime) {
        setIsLocked(true);
        setLockEndTime(lockTime);
      } else {
        localStorage.removeItem(`otp_attempts_${emailFromUrl}`);
        setAttempts(0);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLocked || !lockEndTime) return;
    const interval = setInterval(() => {
      const remaining = lockEndTime - Date.now();
      if (remaining <= 0) {
        setIsLocked(false);
        setLockEndTime(null);
        setAttempts(0);
        localStorage.removeItem(`otp_attempts_${email}`);
        clearInterval(interval);
        toast.success("You can now try again!");
      } else {
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setRemainingTime(`${h}h ${m}m ${s}s`);
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
      (
        document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      )?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      (
        document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      )?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const last = Math.min(pasted.length, 5);
    (document.getElementById(`otp-${last}`) as HTMLInputElement)?.focus();
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
    setErrorMessage("");
    try {
      await authAPI.verifyEmailOtp({ email, otp: otpCode });
      setStatus("success");
      toast.success("Email verified successfully!");
      localStorage.removeItem(`otp_attempts_${email}`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setStatus("error");
      const msg =
        error.response?.data?.error ||
        error.response?.data?.title ||
        error.response?.data?.message ||
        error.message ||
        "Verification failed";
      setErrorMessage(msg);
      toast.error(msg);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCK_DURATION;
        setIsLocked(true);
        setLockEndTime(lockTime);
        localStorage.setItem(
          `otp_attempts_${email}`,
          JSON.stringify({ count: newAttempts, lockTime }),
        );
        toast.error("Too many failed attempts. Please wait 1 hour.");
      } else {
        localStorage.setItem(
          `otp_attempts_${email}`,
          JSON.stringify({ count: newAttempts, lockTime: null }),
        );
        const rem = MAX_ATTEMPTS - newAttempts;
        toast.warning(`${rem} attempt${rem > 1 ? "s" : ""} remaining`);
      }
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
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.title ||
        error.response?.data?.message ||
        "Failed to resend code";
      toast.error(errMsg);
    } finally {
      setIsResending(false);
    }
  };

  const card =
    "rounded-[2rem] p-8 bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff] dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]";
  const otpBox =
    "text-center text-xl font-bold outline-none rounded-2xl transition-all bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248] text-gray-700 dark:text-white focus:ring-2 focus:ring-primary disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      dir="ltr"
      className="relative min-h-screen flex items-center justify-center p-6 bg-[#e0e5ec] dark:bg-[#252838]"
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="absolute top-5 left-5 w-10 h-10 flex items-center justify-center rounded-xl transition-all
          bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]
          hover:shadow-[2px_2px_4px_#b8bec7,-2px_-2px_4px_#ffffff]
          dark:bg-[#252838] dark:shadow-[3px_3px_7px_#12151f,-3px_-3px_7px_#2e3248]"
      >
        {theme === "dark" ? (
          <Sun size={18} className="text-primary" />
        ) : (
          <Moon size={18} className="text-gray-500" />
        )}
      </button>

      <div className="w-full max-w-[400px]">
        <div className={card}>
          {status === "success" ? (
            <div className="text-center space-y-5 py-4">
              <div
                className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto
                bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
                dark:bg-[#2e3248] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#343751]"
              >
                <CheckCircle className="text-primary" size={36} />
              </div>
              <h2 className="text-xl font-bold text-gray-700 dark:text-white">
                Email Verified!
              </h2>
              <p className="text-gray-400 text-sm">
                Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-[76px] h-[76px] rounded-full flex items-center justify-center
                  bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
                  dark:bg-[#2e3248] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#343751]"
                >
                  <img
                    src="/logo.png"
                    alt="Hayy Logo"
                    className="w-14 h-14 object-contain rounded-full"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
                  Verify Your Email
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {email || "your email"}
                  </span>
                </p>
              </div>

              {/* Locked Warning */}
              {isLocked && (
                <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-2xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  <span>
                    Locked — wait <strong>{remainingTime}</strong>
                  </span>
                </div>
              )}

              {/* Attempts Warning */}
              {attempts > 0 && !isLocked && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>
                    {MAX_ATTEMPTS - attempts} attempt
                    {MAX_ATTEMPTS - attempts > 1 ? "s" : ""} remaining
                  </span>
                </div>
              )}

              {/* Manual email if missing */}
              {!email && (
                <div className="mb-4 flex items-center gap-3 px-5 py-[13px] rounded-full bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]">
                  <Mail
                    size={16}
                    className="text-gray-400 dark:text-gray-500 shrink-0"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              )}

              {/* OTP Inputs */}
              <div
                className="flex justify-center gap-2 mb-5"
                onPaste={handlePaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={isLocked}
                    className={otpBox}
                    style={{ width: "2.75rem", height: "3.25rem" }}
                  />
                ))}
              </div>

              {/* Error */}
              {status === "error" && !isLocked && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>
                    {errorMessage || "Invalid code. Please try again."}
                  </span>
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                disabled={
                  status === "loading" || otp.join("").length !== 6 || isLocked
                }
                className="w-full py-[14px] rounded-full font-bold text-white text-sm tracking-widest uppercase
                  bg-gradient-to-r from-primary to-orange-500
                  shadow-[5px_5px_12px_#b8bec7,-3px_-3px_8px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)]
                  hover:shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff]
                  active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)]
                  dark:shadow-[5px_5px_15px_#12151f,-3px_-3px_8px_#2e3248,inset_0_1px_0_rgba(255,255,255,0.1)]
                  dark:hover:shadow-[3px_3px_10px_#12151f,-1px_-1px_4px_#2e3248]
                  dark:active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4)]
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader className="animate-spin" size={18} /> Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>

              {/* Resend */}
              <div className="mt-5 text-center text-sm">
                <span className="text-gray-400">Didn't receive the code? </span>
                <button
                  onClick={handleResendOtp}
                  disabled={isResending || isLocked}
                  className="text-primary hover:text-orange-500 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </div>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-5 text-center text-sm">
            <Link
              to="/login"
              className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
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
