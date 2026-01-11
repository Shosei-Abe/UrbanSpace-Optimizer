import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectBank, getUserSettings, updateUserSettings } from "@/lib/mock-data";
import { plaidClient } from "@/lib/plaid";

const MOCK_BANKS = [
    { id: 'demo-bank-1', name: 'Demo Bank' },
    { id: 'test-bank-2', name: 'Test Bank' },
    { id: 'sandbox-bank-3', name: 'Sandbox Financial' },
    { id: 'mock-bank-4', name: 'Mock Credit Union' },
];

export async function GET() {
    // Return list of available mock banks
    return NextResponse.json({ banks: MOCK_BANKS });
}

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Handle Plaid Connection
        if (body.publicToken) {
            try {
                const response = await plaidClient.itemPublicTokenExchange({
                    public_token: body.publicToken,
                });

                const accessToken = response.data.access_token;
                const itemId = response.data.item_id;

                // Storage in mock DB (in production, use real DB)
                // For this demo, we'll pretend we got the institution name
                const bankName = "Plaid Connected Bank";

                // We would typically sync transactions here using the access token
                // For now, we'll just seed mock data but mark it as "Real"
                connectBank(userId, bankName);

                // Store Plaid credentials (mock implementation)
                // In production: await savePlaidCredentials(userId, itemId, accessToken);

                return NextResponse.json({
                    success: true,
                    message: "Connected via Plaid",
                    bankName: bankName,
                    settings: getUserSettings(userId)
                });
            } catch (plaidError) {
                console.error("Plaid exchange failed:", plaidError);
                return NextResponse.json({ error: "Failed to exchange Plaid token" }, { status: 500 });
            }
        }

        // Handle Mock Connection (fallback)
        const bankId = body.bankId;

        const bank = MOCK_BANKS.find(b => b.id === bankId);
        if (!bank) {
            return NextResponse.json({ error: "Invalid bank selection" }, { status: 400 });
        }

        // Connect the bank and seed transactions
        connectBank(userId, bank.name);

        const settings = getUserSettings(userId);

        return NextResponse.json({
            success: true,
            message: `Connected to ${bank.name}`,
            bankName: bank.name,
            settings
        });
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function DELETE() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Disconnect the bank
    updateUserSettings(userId, { bankConnected: false, bankName: null });

    return NextResponse.json({
        success: true,
        message: 'Bank disconnected'
    });
}
