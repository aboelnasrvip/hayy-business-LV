import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initiatePayment } from "@/store/slices/paymentSlice";
import { CreditCard, Loader } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId") || "";
  
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.payment);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!planId) {
      toast.error("No plan selected");
      navigate("/subscription-plans");
    }
  }, [planId, navigate]);

  const handlePayment = async () => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await dispatch(
        initiatePayment({
          planId,
          businessId: user.id,
        })
      ).unwrap();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error: any) {
      toast.error(error || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">
            You will be redirected to the payment gateway
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading || isProcessing}
          className="w-full bg-primary hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading || isProcessing ? (
            <>
              <Loader className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </button>

        <button
          onClick={() => navigate("/subscription-plans")}
          disabled={isLoading || isProcessing}
          className="w-full mt-4 text-gray-600 hover:text-gray-900 py-2"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Payment;