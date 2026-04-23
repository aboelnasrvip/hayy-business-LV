import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initiatePayment } from "@/store/slices/paymentSlice";
import { CreditCard, Loader, ArrowLeft, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/ui/ThemeProvider";

const PAYMOB_IFRAME_ID = "1007665";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const plan = location.state?.plan;
  const { theme, setTheme } = useTheme();

  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.payment);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentKey, setPaymentKey] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    if (!plan) {
      toast.error("No plan selected");
      navigate("/subscription-plans");
    }
  }, [plan, navigate]);

  useEffect(() => {
    const handlePaymentCallback = (event: MessageEvent) => {
      if (event.origin !== "https://accept.paymob.com") return;
      const data = event.data;
      if (data.success) {
        toast.success("Payment successful!");
        navigate("/payment/success", {
          state: { paymentId: data.id || data.transaction_id },
        });
      } else if (data.error) {
        toast.error(
          "Payment failed: " + (data.error_message || "Unknown error"),
        );
        setShowIframe(false);
        setPaymentKey(null);
      }
    };
    window.addEventListener("message", handlePaymentCallback);
    return () => window.removeEventListener("message", handlePaymentCallback);
  }, [navigate]);

  const handlePayment = async () => {
    if (!user?.id || !plan?.id) {
      toast.error("Missing information");
      return;
    }
    setIsProcessing(true);
    try {
      const result = await dispatch(
        initiatePayment({ planId: plan.id, businessId: user.id }),
      ).unwrap();
      if (result.paymentKey) {
        setPaymentKey(result.paymentKey);
        setShowIframe(true);
      } else {
        toast.error("Failed to get payment key");
      }
    } catch (error: any) {
      toast.error(error || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) return null;

  if (showIframe && paymentKey) {
    return (
      <div
        dir="ltr"
        className="min-h-screen flex flex-col bg-[#e0e5ec] dark:bg-[#252838]"
      >
        <div className="bg-[#e0e5ec] dark:bg-[#252838] shadow-[0_4px_12px_#b8bec7] dark:shadow-[0_4px_12px_#12151f] p-4 px-6">
          <button
            onClick={() => {
              setShowIframe(false);
              setPaymentKey(null);
            }}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} /> Cancel Payment
          </button>
        </div>
        <div className="flex-1 p-6">
          <iframe
            src={`https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`}
            className="w-full h-full min-h-[600px] border-0 rounded-[2rem] shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]"
            title="Paymob Payment"
          />
        </div>
      </div>
    );
  }

  const neuBtnPrimary =
    "rounded-full font-bold text-white text-sm tracking-widest uppercase bg-gradient-to-r from-primary to-orange-500 shadow-[5px_5px_12px_#b8bec7,-3px_-3px_8px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] dark:shadow-[5px_5px_15px_#12151f,-3px_-3px_8px_#2e3248,inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:shadow-[3px_3px_10px_#12151f,-1px_-1px_4px_#2e3248] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

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
        {/* Back */}
        <button
          onClick={() => navigate("/subscription-plans")}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-5"
        >
          <ArrowLeft size={16} /> Back to Plans
        </button>

        {/* Card */}
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
              <CreditCard className="text-primary" size={32} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
              Complete Payment
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              You selected:{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {plan.name}
              </span>
            </p>
          </div>

          {/* Price Box */}
          <div
            className="mb-6 px-5 py-4 rounded-2xl text-center
            bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff]
            dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]"
          >
            <span className="text-3xl font-bold text-primary">
              {plan.price}
            </span>
            <span className="text-gray-400 text-sm"> EGP</span>
            <p className="text-xs text-gray-400 mt-1">
              for {plan.durationDays} days
            </p>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isLoading || isProcessing}
            className={`w-full py-[14px] ${neuBtnPrimary}`}
          >
            {isLoading || isProcessing ? (
              <>
                <Loader className="animate-spin" size={18} /> Processing...
              </>
            ) : (
              <>
                <CreditCard size={18} /> Proceed to Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
