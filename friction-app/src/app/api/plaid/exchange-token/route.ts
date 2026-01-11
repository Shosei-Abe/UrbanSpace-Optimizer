import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { public_token } = await req.json();

        const response = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Save to mock store (in-memory)
        const { userId } = await auth();
        if (userId) {
            // Dynamically import to avoid build-time issues if any, though here it's fine
            const { updateUserSettings } = await import('@/lib/mock-data');
            updateUserSettings(userId, {
                plaidAccessToken: accessToken,
                plaidItemId: itemId,
                bankConnected: true,
                bankName: 'Real Bank (Plaid)', // You could fetch institution name via another API call
            });
        }

        console.log('Access Token exchanged and saved for user:', userId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error exchanging public token:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
