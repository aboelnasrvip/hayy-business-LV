import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSubscriptionPlans,
  selectPlan,
} from "@/store/slices/paymentSlice";
import { Check, Loader, Zap, Sun, Moon, AlertCircle } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { plans, isLoading, error } = useAppSelector((state) => state.payment);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleSelectPlan = (plan: any) => {
    dispatch(selectPlan(plan));
    navigate("/payment", { state: { plan } });
  };

  const neuBtnPrimary =
    "rounded-full font-bold text-white text-sm tracking-widest uppercase bg-gradient-to-r from-primary to-orange-500 shadow-[5px_5px_12px_#b8bec7,-3px_-3px_8px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] dark:shadow-[5px_5px_15px_#12151f,-3px_-3px_8px_#2e3248,inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:shadow-[3px_3px_10px_#12151f,-1px_-1px_4px_#2e3248] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  if (isLoading) {
    return (
      <div
        dir="ltr"
        className="min-h-screen flex items-center justify-center bg-[#e0e5ec] dark:bg-[#252838]"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center
          bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
          dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]"
        >
          <Loader className="animate-spin text-primary" size={28} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="ltr"
        className="min-h-screen flex flex-col items-center justify-center bg-[#e0e5ec] dark:bg-[#252838] p-6"
      >
        <div
          className="rounded-[2rem] p-8 w-full max-w-sm text-center
          bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]
          dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-red-500">
            <AlertCircle size={20} />
            <span className="font-semibold text-sm">{error}</span>
          </div>
          <button
            onClick={() => dispatch(fetchSubscriptionPlans())}
            className={`w-full py-3.5 ${neuBtnPrimary}`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="min-h-screen bg-[#e0e5ec] dark:bg-[#252838]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#e0e5ec] dark:bg-[#252838] shadow-[0_4px_12px_#b8bec7] dark:shadow-[0_4px_12px_#12151f]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center
              bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]
              dark:bg-[#2e3248] dark:shadow-[3px_3px_7px_#12151f,-3px_-3px_7px_#343751]"
            >
              <img
                src="/logo.png"
                alt="Hayy"
                className="w-7 h-7 object-contain rounded-full"
              />
            </div>
            <span className="text-base font-bold text-gray-700 dark:text-white tracking-wide">
              HAYY Business
            </span>
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all
              bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bec7,-3px_-3px_6px_#ffffff]
              hover:shadow-[1px_1px_3px_#b8bec7,-1px_-1px_3px_#ffffff]
              dark:bg-[#252838] dark:shadow-[3px_3px_7px_#12151f,-3px_-3px_7px_#2e3248]"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-primary" />
            ) : (
              <Moon size={16} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white tracking-wide">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Select the perfect plan for your business
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-[2rem] p-7 flex flex-col
                bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]
                dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]
                hover:shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff]
                dark:hover:shadow-[6px_6px_14px_#12151f,-6px_-6px_14px_#2e3248]
                transition-all duration-200"
            >
              {/* Plan Icon */}
              <div
              className="w-10 h-10 rounded-full flex items-center justify-center
              bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]
              dark:bg-[#2e3248] dark:shadow-[3px_3px_7px_#12151f,-3px_-3px_7px_#343751]"
            >
              <img
                src="/logo.png"
                alt="Hayy"
                className="w-7 h-7 object-contain rounded-full"
              />
            </div>

              <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-400 text-sm mb-5">{plan.description}</p>

              {/* Price */}
              <div
                className="mb-5 px-5 py-4 rounded-2xl
                bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff]
                dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]"
              >
                <span className="text-3xl font-bold text-primary">
                  {plan.price}
                </span>
                <span className="text-gray-400 text-sm"> EGP</span>
                <p className="text-xs text-gray-400 mt-1">
                  for {plan.durationDays} days
                </p>
              </div>

              {/* Feature */}
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                <Check className="text-primary shrink-0" size={16} />
                <span>AI Power Level: {plan.aiPowerLevel}</span>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={!plan.isActive}
                className={`w-full py-3.5 mt-auto ${neuBtnPrimary}`}
              >
                {plan.isActive ? "Select Plan" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
