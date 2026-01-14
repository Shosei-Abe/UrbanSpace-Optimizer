import { NextResponse } from "next/server";
import { addTransaction } from "@/lib/mock-data";

// This endpoint is public - called by the Chrome extension
// In production, you'd verify extension identity via a token

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // The extension sends userId (from stored session) or we could use a token
        const { userId, domain, outcome, amount, category } = body;

        if (!userId || !domain || !outcome) {
            return NextResponse.json(
                { error: "Missing required fields: userId, domain, outcome" },
                { status: 400 }
            );
        }

        // Extract merchant name from domain
        const merchant = domain
            .replace(/^(www\.)?/, '')
            .split('.')[0]
            .charAt(0).toUpperCase() + domain.replace(/^(www\.)?/, '').split('.')[0].slice(1);

        const transaction = addTransaction({
            userId,
            date: new Date().toISOString().split('T')[0],
            merchant,
            amount: amount || 0,
            type: 'blocked-attempt',
            category: category || 'Shopping',
            outcome: outcome === 'cancelled' ? 'blocked' : 'completed',
            source: 'browser-extension',
        });

        return NextResponse.json({
            success: true,
            transactionId: transaction.id,
            message: outcome === 'cancelled' ? 'Purchase blocked' : 'Purchase completed'
        });
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function OPTIONS() {
    // Handle CORS preflight
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
