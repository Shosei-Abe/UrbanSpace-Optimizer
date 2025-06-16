import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';

interface SubscriptionSuccessProps {
  onContinue: () => void;
}

const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({ onContinue }) => {
  useEffect(() => {
    // Auto-redirect after 8 seconds
    const timer = setTimeout(() => {
      onContinue();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your subscription. Your account has been upgraded successfully.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Crown className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Welcome to Your New Plan!</h3>
              </div>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Access to premium features</li>
                <li>• Enhanced space management tools</li>
                <li>• Advanced analytics and reporting</li>
                <li>• Priority customer support</li>
                <li>• Real-time monitoring capabilities</li>
              </ul>
            </div>

            <button
              onClick={onContinue}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onContinue}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Skip and continue
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Redirecting automatically in 8 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;