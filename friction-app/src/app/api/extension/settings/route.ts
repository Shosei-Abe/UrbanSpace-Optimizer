import { NextResponse } from "next/server";
import { getUserSettings } from "@/lib/mock-data";

// This endpoint is public - called by the Chrome extension
// Returns user settings for the extension to use

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: "Missing userId parameter" },
            { status: 400 }
        );
    }

    const settings = getUserSettings(userId);

    return NextResponse.json({
        warnThreshold: settings.warnThreshold,
        cooldownMinutes: settings.cooldownMinutes,
        warnCategories: settings.warnCategories,
    });
}

export async function OPTIONS() {
    // Handle CORS preflight
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
