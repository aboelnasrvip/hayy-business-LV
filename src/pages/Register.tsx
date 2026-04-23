import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  register,
  googleLoginBusiness,
  clearError,
} from "@/store/slices/authSlice";
import {
  Eye,
  EyeOff,
  Upload,
  Sun,
  Moon,
  Lock,
  User,
  MapPin,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const submitData = new FormData();
      submitData.append("FullName", formData.fullName);
      submitData.append("Email", formData.email);
      submitData.append("Password", formData.password);
      submitData.append("ConfirmPassword", formData.confirmPassword);
      submitData.append("City", formData.city);
      if (image) submitData.append("image", image);
      await dispatch(register(submitData as any)).unwrap();
      toast.success(
        "Registration successful! Please check your email for verification code.",
      );
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      toast.error(err || "Registration failed");
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await dispatch(
          googleLoginBusiness(tokenResponse.access_token),
        ).unwrap();
        toast.success("Google signup successful!");
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
          navigate(
            hasActiveSubscription ? "/dashboard" : "/subscription-plans",
          );
        } else {
          navigate("/subscription-plans");
        }
      } catch (err: any) {
        toast.error(err || "Google signup failed");
      }
    },
    onError: () => toast.error("Google signup failed"),
  });

  const inputRow =
    "flex items-center gap-3 px-5 py-[13px] rounded-full " +
    "bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff] " +
    "dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]";

  const inputField =
    "flex-1 min-w-0 bg-transparent outline-none text-sm " +
    "text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500";

  const iconCls = "text-gray-400 dark:text-gray-500 shrink-0";

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

      <div className="w-full max-w-[420px] py-8">
        <div
          className="rounded-[2rem] p-8
          bg-[#e0e5ec] shadow-[10px_10px_22px_#b8bec7,-10px_-10px_22px_#ffffff]
          dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]"
        >
          

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Profile Image */}
            <div className="flex justify-center pb-1">
              <div className="relative">
                <div
                  className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center
                  bg-[#e0e5ec] shadow-[5px_5px_10px_#b8bec7,-5px_-5px_10px_#ffffff]
                  dark:bg-[#2e3248] dark:shadow-[3px_3px_8px_#12151f,-3px_-3px_8px_#343751]"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className={iconCls} size={24} />
                  )}
                </div>
                <label
                  className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full
                  flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors shadow-md"
                >
                  <Upload className="text-white" size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className={inputRow}>
              <User size={16} className={iconCls} />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Full Name"
                className={inputField}
              />
            </div>

            {/* City */}
            <div className={inputRow}>
              <MapPin size={16} className={iconCls} />
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="City"
                className={inputField}
              />
            </div>

            {/* Email */}
            <div className={inputRow}>
              <Mail size={16} className={iconCls} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                className={inputField}
              />
            </div>

            {/* Password */}
            <div className={inputRow}>
              <Lock size={16} className={iconCls} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                className={inputField}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`${iconCls} hover:text-primary transition-colors`}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className={inputRow}>
              <Lock size={16} className={iconCls} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm Password"
                className={inputField}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`${iconCls} hover:text-primary transition-colors`}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading }
              className="w-full py-[14px] rounded-full font-bold text-white text-sm tracking-widest uppercase
                bg-gradient-to-r from-primary to-orange-500
                shadow-[5px_5px_12px_#b8bec7,-3px_-3px_8px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)]
                hover:shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff]
                active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)]
                dark:shadow-[5px_5px_15px_#12151f,-3px_-3px_8px_#2e3248,inset_0_1px_0_rgba(255,255,255,0.1)]
                dark:hover:shadow-[3px_3px_10px_#12151f,-1px_-1px_4px_#2e3248]
                dark:active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4)]
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300 dark:bg-[#2e3248]" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-[#2e3248]" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all
              text-gray-600 dark:text-gray-300
              bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]
              hover:shadow-[2px_2px_4px_#b8bec7,-2px_-2px_4px_#ffffff]
              dark:bg-[#1e2130] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248]
              dark:hover:shadow-[2px_2px_6px_#12151f,-2px_-2px_6px_#2e3248]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

          {/* Footer */}
          <div className="mt-5 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-primary hover:text-orange-500 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
