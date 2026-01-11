import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Create Link Token
        // This is needed to initialize the Plaid Link on the frontend
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: userId },
            client_name: 'Friction',
            products: [Products.Transactions],
            country_codes: [CountryCode.Us, CountryCode.Gb], // Adjust based on region
            language: 'en',
        });

        return NextResponse.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error("Plaid Link Token creation failed:", error);

        // Mock token for dev if real credentials fail (or return error)
        // For now, return specific error so frontend can fallback to mock mode
        return NextResponse.json({ error: "Failed to create link token" }, { status: 500 });
    }
}
