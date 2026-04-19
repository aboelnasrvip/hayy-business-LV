import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSubscriptionPlans, selectPlan, clearError } from "@/store/slices/paymentSlice";
import { Zap, Check, ArrowRight, Loader } from "lucide-react";
import { toast } from "sonner";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { plans, selectedPlan, isLoading, error } = useAppSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleSelectPlan = (plan: any) => {
    dispatch(selectPlan(plan));
    navigate("/payment", { state: { plan } });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Plans</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchSubscriptionPlans())}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Hayy</span>
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-medium"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select a subscription plan that best fits your business needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="animate-spin text-primary" size={48} />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans
              .filter((plan) => plan.isActive)
              .map((plan) => {
                const isPopular = plan.name === "Pro Plan";

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl transition-all duration-300 ${
                      isPopular
                        ? "ring-2 ring-primary shadow-2xl scale-105"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary"
                    } ${isPopular ? "bg-gradient-to-br from-primary/5 to-orange-600/5" : "bg-white dark:bg-gray-800"}`}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-8 h-full flex flex-col">
                      {/* Plan Header */}
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {plan.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {plan.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">EGP</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {plan.durationDays === 365
                            ? "per year"
                            : plan.durationDays === 30
                            ? "per month"
                            : `for ${plan.durationDays} days`}
                        </p>
                      </div>

                      {/* AI Power Level */}
                      <div className="mb-6 flex items-center gap-2">
                        <Zap className="text-primary" size={24} />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">AI Power Level</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {plan.aiPowerLevel}/10
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-8 flex-grow">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Includes:
                        </p>
                        <ul className="space-y-2">
                          {[
                            "AI-Powered Features",
                            "Priority Support",
                            "Advanced Analytics",
                            "Custom Integrations",
                          ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Check size={18} className="text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                          isPopular
                            ? "bg-gradient-to-r from-primary to-orange-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        Choose Plan
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan later?",
                a: "Yes, you can upgrade or downgrade your plan anytime. Changes will take effect in your next billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and other payment methods via Paymob.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, you get a 7-day free trial with all features included before your first billing cycle.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription anytime. You'll have access until the end of your billing period.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;