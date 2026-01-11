import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { CountryCode, Products } from 'plaid';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        // For sandbox, we can proceed without a user ID if needed, but best practice is to have one.
        // If auth is not set up fully or used in dev, we might fallback.
        const clientUserId = userId || 'test_user_id';

        const request = {
            user: { client_user_id: clientUserId },
            client_name: 'Friction App',
            products: [Products.Auth, Products.Transactions],
            language: 'en',
            country_codes: ['US', 'CA', 'GB'] as any,
        };

        const createTokenResponse = await plaidClient.linkTokenCreate(request);
        return NextResponse.json(createTokenResponse.data);
    } catch (error: any) {
        console.error('Error creating link token:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
