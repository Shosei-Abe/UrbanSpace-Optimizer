export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RaBgtQRwyr4ayDG6lJUK3I1',
    name: 'Free',
    description: 'Essential features to get started with urban space management',
    mode: 'subscription',
    price: 0,
    currency: 'HUF',
  },
  {
    priceId: 'price_1RaBu3QRwyr4ayDGFChRa5bB',
    name: 'Lite',
    description: 'Perfect for small teams managing limited urban spaces',
    mode: 'subscription',
    price: 1990,
    currency: 'HUF',
  },
  {
    priceId: 'price_1RaBgVQRwyr4ayDGVnn3MdzE',
    name: 'Pro',
    description: 'Advanced features for professional space management',
    mode: 'subscription',
    price: 8000,
    currency: 'HUF',
  },
  {
    priceId: 'price_1RaBfrQRwyr4ayDGd4GJ7Pyy',
    name: 'Small Business',
    description: 'Comprehensive solution for growing businesses',
    mode: 'subscription',
    price: 100000,
    currency: 'HUF',
  },
  {
    priceId: 'price_1RaBaWQRwyr4ayDGbhLcNUXE',
    name: 'Business',
    description: 'Enterprise-grade features for large organizations',
    mode: 'subscription',
    price: 250000,
    currency: 'HUF',
  },
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const formatPrice = (price: number, currency: string = 'HUF'): string => {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
};