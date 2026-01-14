import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Friction Pro',
                            description: 'Gain access to AI Impulse Coach & Advanced Analysis',
                        },
                        unit_amount: 999, // €9.99/mo
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${appUrl}/dashboard?success=true`,
            cancel_url: `${appUrl}/dashboard/settings?canceled=true`,
            metadata: {
                userId: userId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout failed:", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}
