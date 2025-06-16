import React, { useState, useEffect } from 'react';
import { Crown, ArrowLeft } from 'lucide-react';
import { stripeProducts, getProductByPriceId } from '../../stripe-config';
import { getUserSubscription } from '../../lib/stripe';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionPageProps {
  onBack: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBack }) => {
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const subscription = await getUserSubscription();
      setCurrentSubscription(subscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const currentProduct = currentSubscription?.price_id 
    ? getProductByPriceId(currentSubscription.price_id)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your urban space management needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {currentSubscription && currentProduct && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Current Subscription</h3>
                <p className="text-blue-700">
                  You're currently subscribed to the <strong>{currentProduct.name}</strong> plan
                </p>
                <p className="text-sm text-blue-600">
                  Status: {currentSubscription.subscription_status}
                  {currentSubscription.current_period_end && (
                    <span className="ml-2">
                      • Next billing: {new Date(currentSubscription.current_period_end * 1000).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stripeProducts.map((product, index) => (
            <SubscriptionCard
              key={product.priceId}
              product={product}
              isCurrentPlan={currentSubscription?.price_id === product.priceId && currentSubscription?.subscription_status === 'active'}
              isPopular={product.name === 'Pro'}
              onCheckoutComplete={loadSubscription}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-4">
              Our team is here to help you find the perfect plan for your organization's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Sales
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;