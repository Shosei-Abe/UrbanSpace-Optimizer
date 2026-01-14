import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserSettings, updateUserSettings } from "@/lib/mock-data";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = getUserSettings(userId);
    return NextResponse.json(settings);
}

export async function PUT(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const updates = await request.json();
        const settings = updateUserSettings(userId, updates);
        return NextResponse.json(settings);
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
