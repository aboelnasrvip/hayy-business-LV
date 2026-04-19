import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSubscriptionPlans, selectPlan } from "@/store/slices/paymentSlice";
import { Check, Loader, Zap } from "lucide-react";
import { toast } from "sonner";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { plans, isLoading, error } = useAppSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleSelectPlan = (plan: any) => {
    dispatch(selectPlan(plan));
    navigate("/payment", { state: { plan } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Plans</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => dispatch(fetchSubscriptionPlans())}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the perfect plan for your business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <Zap className="text-primary" size={32} />
              </div>

              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                <span className="text-gray-600"> EGP</span>
                <p className="text-sm text-gray-500 mt-1">
                  for {plan.durationDays} days
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="text-green-500" size={20} />
                  <span>AI Power Level: {plan.aiPowerLevel}</span>
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={!plan.isActive}
                className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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