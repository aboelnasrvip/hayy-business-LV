import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initiatePayment } from "@/store/slices/paymentSlice";
import { CreditCard, Loader, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const plan = location.state?.plan;
  
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.payment);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!plan) {
      toast.error("No plan selected");
      navigate("/subscription-plans");
    }
  }, [plan, navigate]);

  const handlePayment = async () => {
    if (!user?.id || !plan?.id) {
      toast.error("Missing information");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await dispatch(
        initiatePayment({
          planId: plan.id,
          businessId: user.id,
        })
      ).unwrap();

      if (result.paymentUrl) {
        // ✅ تحويل للـ Payment Gateway
        window.location.href = result.paymentUrl;
      } else {
        toast.error("Failed to get payment URL");
      }
    } catch (error: any) {
      toast.error(error || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/subscription-plans")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Plans
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-primary" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Payment
            </h1>
            <p className="text-gray-600 mb-4">
              You selected: <strong>{plan.name}</strong>
            </p>
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary">
                {plan.price} EGP
              </p>
              <p className="text-sm text-gray-600 mt-1">
                for {plan.durationDays} days
              </p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading || isProcessing}
            className="w-full bg-primary hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading || isProcessing ? (
              <>
                <Loader className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Proceed to Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;