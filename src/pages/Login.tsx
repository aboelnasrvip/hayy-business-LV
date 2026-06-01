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
import { GoogleLogin } from "@react-oauth/google";

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
                placeholder="Email"
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
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-left"
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
          {/* <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await dispatch(
                  googleLoginBusiness(credentialResponse.credential!),
                ).unwrap();
                toast.success("Google login successful!");
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
                  navigate(
                    response.hasActiveSubscription
                      ? "/dashboard"
                      : "/subscription-plans",
                  );
                } else {
                  navigate("/subscription-plans");
                }
              } catch (err: any) {
                toast.error(err || "Google login failed");
              }
            }}
            onError={() => toast.error("Google login failed")}
            width="100%"
            theme="outline"
            shape="circle"
            text="continue_with"
          /> */}

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
