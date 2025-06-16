import React, { useState } from 'react';
import { Check, Crown, Loader2, Star } from 'lucide-react';
import { StripeProduct, formatPrice } from '../../stripe-config';
import { createCheckoutSession } from '../../lib/stripe';

interface SubscriptionCardProps {
  product: StripeProduct;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onCheckoutStart?: () => void;
  onCheckoutComplete?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  product,
  isCurrentPlan = false,
  isPopular = false,
  onCheckoutStart,
  onCheckoutComplete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (isCurrentPlan || product.price === 0) return;

    setLoading(true);
    onCheckoutStart?.();

    try {
      const { url } = await createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
        successUrl: `${window.location.origin}?success=true`,
        cancelUrl: `${window.location.origin}/subscription`,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
      onCheckoutComplete?.();
    }
  };

  const getFeatures = (planName: string) => {
    switch (planName) {
      case 'Free':
        return [
          'Up to 5 spaces',
          'Basic analytics',
          'Email support',
          'Mobile app access',
        ];
      case 'Lite':
        return [
          'Up to 25 spaces',
          'Advanced analytics',
          'Priority email support',
          'Mobile app access',
          'Basic reporting',
        ];
      case 'Pro':
        return [
          'Up to 100 spaces',
          'Real-time analytics',
          'Phone & email support',
          'Mobile app access',
          'Advanced reporting',
          'API access',
          'Custom integrations',
        ];
      case 'Small Business':
        return [
          'Up to 500 spaces',
          'Enterprise analytics',
          'Dedicated support',
          'Mobile app access',
          'Advanced reporting',
          'Full API access',
          'Custom integrations',
          'Multi-user management',
          'White-label options',
        ];
      case 'Business':
        return [
          'Unlimited spaces',
          'Enterprise analytics',
          'Dedicated account manager',
          'Mobile app access',
          'Advanced reporting',
          'Full API access',
          'Custom integrations',
          'Multi-user management',
          'White-label options',
          'Custom development',
          'SLA guarantee',
        ];
      default:
        return [];
    }
  };

  const features = getFeatures(product.name);

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 relative ${
      isCurrentPlan ? 'border-blue-500' : isPopular ? 'border-purple-500' : 'border-gray-200'
    } ${isPopular ? 'transform scale-105' : ''}`}>
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Crown className="h-4 w-4" />
            <span>Current Plan</span>
          </div>
        </div>
      )}

      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatPrice(product.price, product.currency)}
          {product.price > 0 && <span className="text-lg font-normal text-gray-600">/month</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading || isCurrentPlan || product.price === 0}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isCurrentPlan
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : product.price === 0
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : isPopular
            ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : product.price === 0 ? (
          'Free Plan'
        ) : (
          'Subscribe Now'
        )}
      </button>
    </div>
  );
};

export default SubscriptionCard;