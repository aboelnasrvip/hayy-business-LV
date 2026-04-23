import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  Pause,
  Sun,
  Moon,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

type VerificationStatus =
  | "New"
  | "Pending"
  | "Verified"
  | "Rejected"
  | "Suspended"
  | "Approved";

const OnboardingPending = () => {
  const navigate = useNavigate();
  const { verificationStatus } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (
      verificationStatus === "Verified" ||
      verificationStatus === "Approved"
    ) {
      navigate("/dashboard");
    }
  }, [verificationStatus, navigate]);

  const getStatusConfig = (status: VerificationStatus | null) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock,
          iconColor: "text-yellow-500",
          title: "Application Under Review",
          subtitle: "Thank you for submitting your business documents!",
          messages: [
            "Our team is reviewing your documents",
            "This usually takes 1-3 business days",
            "You'll receive an email notification once approved",
          ],
          accentLight: "bg-yellow-50 border-yellow-200 text-yellow-700",
          accentDark:
            "dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
        };
      case "Verified":
      case "Approved":
        return {
          icon: CheckCircle,
          iconColor: "text-primary",
          title: "Application Verified!",
          subtitle: "Your business has been successfully verified.",
          messages: [
            "You can now access all features",
            "Start creating your business profile",
            "Welcome to Hayy!",
          ],
          accentLight: "bg-green-50 border-green-200 text-green-700",
          accentDark:
            "dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
        };
      case "Rejected":
        return {
          icon: XCircle,
          iconColor: "text-red-500",
          title: "Application Rejected",
          subtitle: "Unfortunately, your application could not be approved.",
          messages: [
            "Please review the rejection reason in your email",
            "You can submit again with corrected documents",
            "Contact support if you have any questions",
          ],
          accentLight: "bg-red-50 border-red-200 text-red-700",
          accentDark:
            "dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
        };
      case "Suspended":
        return {
          icon: Pause,
          iconColor: "text-orange-500",
          title: "Account Suspended",
          subtitle: "Your account has been temporarily suspended.",
          messages: [
            "Check your email for suspension details",
            "Contact our support team for more information",
            "Your account may be reactivated after review",
          ],
          accentLight: "bg-orange-50 border-orange-200 text-orange-700",
          accentDark:
            "dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400",
        };
      case "New":
        return {
          icon: Mail,
          iconColor: "text-blue-500",
          title: "Complete Your Profile",
          subtitle: "Please complete your business profile to get started.",
          messages: [
            "Fill in your business information",
            "Upload required documents",
            "Submit for verification",
          ],
          accentLight: "bg-blue-50 border-blue-200 text-blue-700",
          accentDark:
            "dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
        };
      default:
        return {
          icon: Clock,
          iconColor: "text-gray-400",
          title: "Loading...",
          subtitle: "Please wait...",
          messages: [],
          accentLight: "bg-gray-50 border-gray-200 text-gray-700",
          accentDark:
            "dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400",
        };
    }
  };

  const config = getStatusConfig(verificationStatus as VerificationStatus);
  const Icon = config.icon;

  const neuBtnPrimary =
    "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-sm tracking-widest uppercase bg-gradient-to-r from-primary to-orange-500 shadow-[5px_5px_12px_#b8bec7,-3px_-3px_8px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] dark:shadow-[5px_5px_15px_#12151f,-3px_-3px_8px_#2e3248,inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:shadow-[3px_3px_10px_#12151f,-1px_-1px_4px_#2e3248] transition-all duration-200";

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

      <div className="w-full max-w-[480px]">
        {/* Card */}
        <div className="rounded-[2rem] p-8 bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff] dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]">
          

          <div className="text-center space-y-5">
            {/* Status Icon */}
            <div
              className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto
              bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
              dark:bg-[#2e3248] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#343751]"
            >
              <Icon className={config.iconColor} size={36} />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
                {config.title}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{config.subtitle}</p>
            </div>

            {/* Messages */}
            {config.messages.length > 0 && (
              <div
                className={`rounded-2xl p-5 border text-sm text-left space-y-2 ${config.accentLight} ${config.accentDark}`}
              >
                {config.messages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle
                      size={15}
                      className="shrink-0 mt-0.5 opacity-70"
                    />
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            

            {/* Back to Login */}
            <div className="pt-1">
              <Link
                to="/login"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPending;
