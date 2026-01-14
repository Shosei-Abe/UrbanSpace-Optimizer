import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is missing. Please set it in your .env.local file.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2025-12-15.clover' as any, // Cast to any to avoid strict type checks if version varies
    typescript: true,
});
