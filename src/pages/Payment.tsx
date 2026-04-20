import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initiatePayment } from "@/store/slices/paymentSlice";
import { CreditCard, Loader, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const PAYMOB_IFRAME_ID = "1007665"; // ✅ من الصورة

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const plan = location.state?.plan;
  
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

  // ✅ معالجة Iframe Callback
  useEffect(() => {
    const handlePaymentCallback = (event: MessageEvent) => {
      // تأكد إن الـ message جاي من Paymob
      if (event.origin !== "https://accept.paymob.com") return;

      const data = event.data;
      
      if (data.success) {
        toast.success("Payment successful!");
        navigate("/payment/success", { 
          state: { paymentId: data.id || data.transaction_id } 
        });
      } else if (data.error) {
        toast.error("Payment failed: " + (data.error_message || "Unknown error"));
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
        initiatePayment({
          planId: plan.id,
          businessId: user.id,
        })
      ).unwrap();

      if (result.paymentKey) {
        // ✅ عرض الـ iframe
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

  // ✅ إذا تم الحصول على payment key، اعرض الـ iframe
  if (showIframe && paymentKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm p-4">
          <button
            onClick={() => {
              setShowIframe(false);
              setPaymentKey(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Cancel Payment
          </button>
        </div>
        
        <div className="flex-1 p-4">
          <iframe
            src={`https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`}
            className="w-full h-full min-h-[600px] border-0 rounded-lg shadow-lg"
            title="Paymob Payment"
          />
        </div>
      </div>
    );
  }

  // ✅ صفحة تأكيد الدفع
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