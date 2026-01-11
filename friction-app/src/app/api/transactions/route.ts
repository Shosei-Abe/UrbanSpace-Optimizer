import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTransactions, addTransaction, getUserStats, regenerateTransactions, getUserSettings } from "@/lib/mock-data";

export async function GET(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get settings to check for Plaid token
    const userSettings = getUserSettings(userId);
    let transactions = getTransactions(userId);

    // If connected to Plaid, try to fetch real transactions
    if (userSettings.plaidAccessToken) {
        try {
            // Fetch last 30 days
            const now = new Date();
            const startDate = new Date();
            startDate.setDate(now.getDate() - 30);

            // Dynamically import plaidClient (or reuse from lib if available)
            const { plaidClient } = await import('@/lib/plaid');

            const response = await plaidClient.transactionsGet({
                access_token: userSettings.plaidAccessToken,
                start_date: startDate.toISOString().split('T')[0],
                end_date: now.toISOString().split('T')[0],
            });

            const realTransactions = response.data.transactions.map(t => ({
                id: t.transaction_id,
                userId: userId,
                date: t.date,
                merchant: t.merchant_name || t.name,
                amount: t.amount,
                type: 'one-time', // Simplification
                category: t.category ? t.category[0] : 'Uncategorized',
                outcome: 'completed',
                source: 'bank-import',
            }));

            // Merge: Prepend real transactions to mock ones (or just assume real ones are newer)
            // For demo, we might want to just return real ones + some mock warnings
            // Let's filter out old mock 'bank-import' transactions to avoid duplication if we persist
            const existingExtensions = transactions.filter(t => t.source === 'browser-extension');
            transactions = [...(realTransactions as any), ...existingExtensions];

        } catch (error) {
            console.error('Error fetching one-time Plaid transactions:', error);
        }
    }

    if (includeStats) {
        // Recalculate stats based on mixed data
        const stats = getUserStats(userId); // logic in mock-data needs to be aware of new transactions list if we want accurate stats. 
        // For now, let's just return the static mock stats or update them on the fly
        // Updating mock store with new transactions for stats calculation:
        // (NOTE: In a real app we wouldn't overwrite the store on every GET, but here it helps stats consistency)
        // transactions.set(userId, transactions); <-- can't access private map.
        // We will just return the transactions list. Stats might be slightly out of sync if derived from internal store.

        return NextResponse.json({ transactions, stats });
    }

    return NextResponse.json({ transactions });
}

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Check if this is a regenerate request
        if (body.action === 'regenerate') {
            const transactions = regenerateTransactions(userId);
            return NextResponse.json({ transactions, message: "Transactions regenerated" });
        }

        // Otherwise, add a new transaction
        const transaction = addTransaction({
            userId,
            date: body.date || new Date().toISOString().split('T')[0],
            merchant: body.merchant,
            amount: body.amount,
            type: body.type || 'one-time',
            category: body.category || 'Shopping',
            outcome: body.outcome || 'pending',
            source: body.source || 'browser-extension',
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
