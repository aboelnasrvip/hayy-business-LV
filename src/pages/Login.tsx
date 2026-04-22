import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  login,
  googleLoginBusiness,
  clearError,
} from "@/store/slices/authSlice";
import { Eye, EyeOff, User, Lock, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useGoogleLogin } from "@react-oauth/google";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      const response = await dispatch(login(formData)).unwrap();
      toast.success("Login successful!");
      if (response.verificationStatus === "New") {
        navigate("/business/onboarding");
      } else if (
        response.verificationStatus === "Pending" ||
        response.verificationStatus === "PendingVerification"
      ) {
        navigate("/onboarding/pending");
      } else if (
        response.verificationStatus === "Approved" ||
        response.verificationStatus === "Verified"
      ) {
        const hasActiveSubscription =
          localStorage.getItem("hasActiveSubscription") === "true";
        navigate(hasActiveSubscription ? "/dashboard" : "/subscription-plans");
      } else if (
        response.verificationStatus === "Rejected" ||
        response.verificationStatus === "Suspended"
      ) {
        navigate("/onboarding/pending");
      } else {
        navigate("/subscription-plans");
      }
    } catch (err: any) {
      if (
        err?.includes("email") ||
        err?.includes("verify") ||
        err?.includes("confirm")
      ) {
        toast.error("Please verify your email first");
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(err || "Login failed");
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const response = await dispatch(
        googleLoginBusiness(tokenResponse.access_token)
      ).unwrap();
      toast.success("Google login successful!");
      // نفس routing logic بتاع handleSubmit
      if (response.verificationStatus === "New") {
        navigate("/business/onboarding");
      } else if (response.verificationStatus === "Pending" || response.verificationStatus === "PendingVerification") {
        navigate("/onboarding/pending");
      } else if (response.verificationStatus === "Approved" || response.verificationStatus === "Verified") {
        const hasActiveSubscription = localStorage.getItem("hasActiveSubscription") === "true";
        navigate(hasActiveSubscription ? "/dashboard" : "/subscription-plans");
      } else {
        navigate("/subscription-plans");
      }
    } catch (err: any) {
      toast.error(err || "Google login failed");
    }
  },
  onError: () => toast.error("Google login failed"),
});

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#e0e5ec] dark:bg-[#252838]">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 left-5 w-10 h-10 flex items-center justify-center rounded-xl transition-all
          bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,_-4px_-4px_8px_#ffffff]
          hover:shadow-[2px_2px_4px_#b8bec7,_-2px_-2px_4px_#ffffff]
          dark:bg-[#252838] dark:shadow-[3px_3px_7px_#12151f,_-3px_-3px_7px_#2e3248]
          dark:hover:shadow-[1px_1px_4px_#12151f,_-1px_-1px_4px_#2e3248]"
      >
        {theme === "dark" ? (
          <Sun size={18} className="text-primary" />
        ) : (
          <Moon size={18} className="text-gray-500" />
        )}
      </button>

      <div className="w-full max-w-[380px]">
        {/* Card */}
        <div
          className="rounded-[2rem] p-8
          bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec7,_-10px_-10px_20px_#ffffff]
          dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,_-8px_-8px_20px_#2e3248]"
        >
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div
              className="w-[76px] h-[76px] rounded-full flex items-center justify-center
              bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,_-5px_-5px_12px_#ffffff]
              dark:bg-[#2e3248] dark:shadow-[4px_4px_10px_#12151f,_-4px_-4px_10px_#343751]"
            >
              <img
                src="/logo.png"
                alt="Hayy Logo"
                className="w-14 h-14 object-contain rounded-full"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-7">
            <h1 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
              HAYY Business
            </h1>
            <p className="text-gray-400 dark:text-gray-400 text-sm mt-1">
              Welcome back
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div
              dir="ltr"
              className="flex items-center gap-3 px-5 py-3.5 rounded-full
  bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,_inset_-5px_-5px_10px_#ffffff]
  dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,_inset_-2px_-2px_6px_#2e3248]"
            >
              <User
                size={17}
                className="text-gray-400 dark:text-gray-500 shrink-0"
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="username"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-left"
              />
            </div>

            {/* Password Input */}
            <div
              dir="ltr"
              className="flex items-center gap-3 px-5 py-3.5 rounded-full
  bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,_inset_-5px_-5px_10px_#ffffff]
  dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,_inset_-2px_-2px_6px_#2e3248]"
            >
              <Lock
                size={17}
                className="text-gray-400 dark:text-gray-500 shrink-0"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="password"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 dark:text-gray-500 hover:text-primary shrink-0 transition-colors"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-1 rounded-full font-bold text-white text-sm tracking-widest uppercase
                bg-gradient-to-r from-primary to-orange-500
                shadow-[5px_5px_12px_#b8bec7,_-3px_-3px_8px_#ffffff,_inset_0_1px_0_rgba(255,255,255,0.15)]
                hover:shadow-[3px_3px_8px_#b8bec7,_-1px_-1px_4px_#ffffff]
                active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)]
                dark:shadow-[5px_5px_15px_#12151f,_-3px_-3px_8px_#2e3248,_inset_0_1px_0_rgba(255,255,255,0.1)]
                dark:hover:shadow-[3px_3px_10px_#12151f,_-1px_-1px_4px_#2e3248]
                dark:active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4)]
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300 dark:bg-[#2e3248]" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-[#2e3248]" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all
              text-gray-600 dark:text-gray-300
              bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,_-4px_-4px_8px_#ffffff]
              hover:shadow-[2px_2px_4px_#b8bec7,_-2px_-2px_4px_#ffffff]
              dark:bg-[#1e2130] dark:shadow-[4px_4px_10px_#12151f,_-4px_-4px_10px_#2e3248]
              dark:hover:shadow-[2px_2px_6px_#12151f,_-2px_-2px_6px_#2e3248]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
              />
              <path
                fill="#FBBC05"
                d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
            <span className="text-gray-400 dark:text-gray-600"> or </span>
            <Link
              to="/register"
              className="text-primary hover:text-orange-500 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
