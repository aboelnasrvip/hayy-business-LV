import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Loader, AlertCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSubscriptionPlans,
  selectPlan,
} from "@/store/slices/paymentSlice";
import { SubscriptionPlan } from "@/services/paymentService";
import { toast } from "sonner";

const neuCard =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[10px_10px_22px_#adb5c0,-10px_-10px_22px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_18px_#0e1020,-8px_-8px_18px_#343750]";
const neuCardPop =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[14px_14px_28px_#adb5c0,-14px_-14px_28px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[12px_12px_24px_#0a0d18,-12px_-12px_24px_#383c55]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_6px_#12151f,inset_-3px_-3px_6px_#2e3248]";

/* ── AI Power Level dots ── */
const PowerDots = ({ level, max = 5 }: { level: number; max?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full transition-all ${
          i < level
            ? "bg-gradient-to-br from-primary to-orange-400 shadow-[0_0_6px_rgba(255,107,0,0.5)]"
            : `${neuInset}`
        }`}
      />
    ))}
  </div>
);

/* ── Features per AI tier ── */
const getTierFeatures = (aiLevel: number): string[] => {
  const base = [
    "Place profile management",
    "Customer reviews & ratings",
    "Posts & announcements",
  ];
  if (aiLevel <= 1) return [...base, "Basic analytics", "Email support"];
  if (aiLevel <= 3)
    return [
      ...base,
      "Advanced analytics dashboard",
      "Events & offers management",
      "Priority support",
      "AI-powered recommendations",
    ];
  return [
    ...base,
    "Full analytics suite",
    "Events, offers & custom posts",
    "Dedicated account manager",
    "Real-time AI insights",
    "Custom integrations",
  ];
};

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className={`${neuCard} p-7 flex flex-col gap-4 animate-pulse`}>
    <div className={`h-5 w-2/3 rounded-full ${neuInset}`} />
    <div className={`h-16 rounded-2xl ${neuInset}`} />
    <div className="space-y-2.5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-4 rounded-full ${neuInset}`}
          style={{ width: `${70 + i * 5}%` }}
        />
      ))}
    </div>
    <div className={`h-11 rounded-2xl ${neuInset} mt-auto`} />
  </div>
);

const Pricing = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { plans, isLoading, error } = useAppSelector((s) => s.payment);
  const { isAuthenticated, hasActiveSubscription, verificationStatus } =
    useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  /* ── Smart CTA handler (mirrors ProtectedRoute logic) ── */
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!plan.isActive) {
      toast.error("This plan is not currently available.");
      return;
    }

    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    if (hasActiveSubscription) {
      toast.success("You already have an active subscription!");
      navigate("/dashboard");
      return;
    }

    if (verificationStatus === "New") {
      navigate("/business/onboarding");
      return;
    }

    if (
      verificationStatus === "Pending" ||
      verificationStatus === "PendingVerification"
    ) {
      navigate("/onboarding/pending");
      return;
    }

    // Approved / Verified + no subscription → payment
    dispatch(selectPlan(plan));
    navigate("/payment", { state: { plan } });
  };

  const getCtaLabel = (plan: SubscriptionPlan) => {
    if (!plan.isActive) return "Not Available";
    if (!isAuthenticated) return "Get Started";
    if (hasActiveSubscription) return "Manage Subscription";
    return "Select Plan";
  };

  return (
    <section
      id="pricing"
      className="py-24 px-4 bg-[#e0e5ec] dark:bg-[#252838]"
      dir={direction}
    >
      <div className="container mx-auto max-w-6xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 ${neuSmall}`}
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              {t("pricing.badge")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-700 dark:text-white mb-4">
            {t("pricing.title")}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              {t("pricing.titleHighlight")}
            </span>
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* ── Error State ── */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${neuCard} max-w-sm mx-auto p-8 text-center`}
          >
            <div className="flex items-center justify-center gap-2 mb-4 text-red-500">
              <AlertCircle size={20} />
              <span className="text-sm font-semibold">
                Failed to load plans
              </span>
            </div>
            <button
              onClick={() => dispatch(fetchSubscriptionPlans())}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff]
                dark:shadow-[4px_4px_10px_#12151f] hover:opacity-90 transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* ── Skeleton Loading ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Plans Grid ── */}
        {!isLoading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {plans.map((plan, index) => {
              const isPopular = index === Math.floor(plans.length / 2);
              const features = getTierFeatures(plan.aiPowerLevel);

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.12, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`relative flex flex-col p-7
                    ${isPopular ? neuCardPop : neuCard}
                    ${isPopular ? "md:-mt-4 md:mb-4" : ""}`}
                >
                  {/* Accent top line */}
                  <div
                    className={`absolute top-0 left-6 right-6 h-[3px] rounded-full
                      ${
                        isPopular
                          ? "bg-gradient-to-r from-primary to-orange-400"
                          : "bg-gray-200/60 dark:bg-white/5"
                      }`}
                  />

                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                        bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold
                        shadow-[3px_3px_8px_#adb5c0]"
                      >
                        <Sparkles size={11} />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="text-center mb-5 mt-2">
                    <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price block */}
                  <div
                    className={`mb-5 px-5 py-4 rounded-2xl text-center ${neuInset}`}
                  >
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-black text-gray-700 dark:text-white">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400">EGP</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      for {plan.durationDays} day
                      {plan.durationDays !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* AI Power Level */}
                  <div
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl mb-5 ${neuSmall}`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap size={13} className="text-primary" />
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        AI Power
                      </span>
                    </div>
                    <PowerDots level={plan.aiPowerLevel} />
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-orange-400
                          flex items-center justify-center shrink-0 mt-0.5"
                        >
                          <Check size={11} className="text-white" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={!plan.isActive}
                    className={`w-full py-3 rounded-2xl text-sm font-bold transition-all mt-auto
                      ${
                        isPopular
                          ? "text-white bg-gradient-to-r from-primary to-orange-500 shadow-[4px_4px_10px_#adb5c0,-2px_-2px_6px_#ffffff] dark:shadow-[4px_4px_10px_#0e1020] hover:opacity-90"
                          : `text-gray-600 dark:text-gray-300 hover:text-primary ${neuSmall}`
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {getCtaLabel(plan)}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Empty (no plans) ── */}
        {!isLoading && !error && plans.length === 0 && (
          <p className="text-center text-gray-400 text-sm">
            No plans available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default Pricing;
