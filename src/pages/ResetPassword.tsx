import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader, Sun, Moon, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/authService";
import { useTheme } from "@/components/ui/ThemeProvider";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();

  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword({
        email,
        password,
        confirmPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.title ||
          error.response?.data?.message ||
          "Failed to reset password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const neuInput =
    "flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]";

  return (
    <div
      dir="ltr"
      className="relative min-h-screen flex items-center justify-center p-6 bg-[#e0e5ec] dark:bg-[#252838]"
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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

      <div className="w-full max-w-[380px]">
        <div
          className="rounded-[2rem] p-8
          bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]
          dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]"
        >
          {/* Logo */}
          <div className="flex justify-center mb-5">
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
          <div className="text-center mb-7">
            <h1 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
              Reset Password
            </h1>
            
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            

            {/* New Password */}
            <div dir="ltr" className={neuInput}>
              <Lock
                size={17}
                className="text-gray-400 dark:text-gray-500 shrink-0"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
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

            {/* Confirm Password */}
            <div dir="ltr" className={neuInput}>
              <Lock
                size={17}
                className="text-gray-400 dark:text-gray-500 shrink-0"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-left"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 dark:text-gray-500 hover:text-primary shrink-0 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-1 rounded-full font-bold text-white text-sm tracking-widest uppercase
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
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={18} /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
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

export default ResetPassword;
