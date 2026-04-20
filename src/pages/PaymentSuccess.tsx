import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // ✅ قراءة parameters من Paymob callback
  const transactionId = searchParams.get("id");
  const success = searchParams.get("success");
  const orderId = searchParams.get("order");
  const amountCents = searchParams.get("amount_cents");

  useEffect(() => {
    // ✅ التحقق من نجاح العملية
    if (success === "true" && transactionId) {
      // ✅ حفظ حالة الاشتراك
      localStorage.setItem("hasActiveSubscription", "true");
      localStorage.setItem("lastTransactionId", transactionId);
      localStorage.setItem("lastOrderId", orderId || "");
      
      toast.success("Payment successful! Your subscription is now active.");
    } else if (success === "false") {
      toast.error("Payment failed. Please try again.");
      setTimeout(() => navigate("/subscription-plans"), 3000);
    } else {
      // لو مفيش parameters، يعني redirect يدوي
      const hasActiveSubscription = localStorage.getItem("hasActiveSubscription");
      if (!hasActiveSubscription) {
        toast.error("Invalid payment confirmation");
        navigate("/subscription-plans");
      }
    }
  }, [success, transactionId, orderId, navigate]);

  // ✅ لو الدفع فشل
  if (success === "false") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-4xl">✕</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            
            <p className="text-gray-600 mb-8">
              Unfortunately, your payment could not be processed.
            </p>

            <button
              onClick={() => navigate("/subscription-plans")}
              className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ صفحة النجاح
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-4">
            Your subscription has been activated successfully.
          </p>

          {amountCents && (
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {parseInt(amountCents) / 100} EGP
              </p>
            </div>
          )}

          {transactionId && (
            <p className="text-xs text-gray-500 mb-6">
              Transaction ID: {transactionId}
            </p>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;