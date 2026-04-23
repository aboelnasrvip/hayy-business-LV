import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/ui/ThemeProvider";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();

  const transactionId = searchParams.get("id");
  const success = searchParams.get("success");
  const orderId = searchParams.get("order");
  const amountCents = searchParams.get("amount_cents");

  useEffect(() => {
    if (success === "true" && transactionId) {
      localStorage.setItem("hasActiveSubscription", "true");
      localStorage.setItem("lastTransactionId", transactionId);
      localStorage.setItem("lastOrderId", orderId || "");
      toast.success("Payment successful! Your subscription is now active.");
    } else if (success === "false") {
      toast.error("Payment failed. Please try again.");
      setTimeout(() => navigate("/subscription-plans"), 3000);
    } else {
      const hasActiveSubscription = localStorage.getItem(
        "hasActiveSubscription",
      );
      if (!hasActiveSubscription) {
        toast.error("Invalid payment confirmation");
        navigate("/subscription-plans");
      }
    }
  }, [success, transactionId, orderId, navigate]);

  const neuBtnPrimary =
    "w-full py-[14px] rounded-full font-bold text-white text-sm tracking-widest uppercase bg-gradient-to-r from-primary to-orange-500 shadow-[5px_5px_12px_#b8bec7,-3px_-3px_8px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[5px_5px_15px_#12151f,-3px_-3px_8px_#2e3248,inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 flex items-center justify-center gap-2";

  const isFailed = success === "false";

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

      <div className="w-full max-w-[400px]">
        <div
          className="rounded-[2rem] p-8 text-center
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

          {/* Status Icon */}
          <div
            className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto mb-5
            bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
            dark:bg-[#2e3248] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#343751]"
          >
            {isFailed ? (
              <XCircle className="text-red-500" size={36} />
            ) : (
              <CheckCircle className="text-primary" size={36} />
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide mb-2">
            {isFailed ? "Payment Failed" : "Payment Successful!"}
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {isFailed
              ? "Unfortunately, your payment could not be processed."
              : "Your subscription has been activated successfully."}
          </p>

          {/* Amount (success only) */}
          {!isFailed && amountCents && (
            <div
              className="mb-5 px-5 py-4 rounded-2xl
              bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff]
              dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]"
            >
              <p className="text-xs text-gray-400 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-primary">
                {parseInt(amountCents) / 100} EGP
              </p>
            </div>
          )}

          {/* Transaction ID */}
          {!isFailed && transactionId && (
            <p className="text-xs text-gray-400 mb-5">
              Transaction ID: {transactionId}
            </p>
          )}

          {/* Button */}
          <button
            onClick={() =>
              navigate(isFailed ? "/subscription-plans" : "/dashboard")
            }
            className={neuBtnPrimary}
          >
            {isFailed ? "Try Again" : "Go to Dashboard"}
          </button>

          <div className="mt-4">
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
  );
};

export default PaymentSuccess;
