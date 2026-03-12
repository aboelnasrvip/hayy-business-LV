import { Link } from "react-router-dom";
import { Clock, Mail, CheckCircle } from "lucide-react";

const OnboardingPending = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={40} />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Application Under Review
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Thank you for submitting your business documents!
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center justify-center gap-2">
                <Mail size={20} />
                What happens next?
              </h3>
              <ul className="text-left space-y-3 text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                  <span>Our team is reviewing your documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                  <span>This usually takes 1-3 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                  <span>You'll receive an email notification once approved</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPending;