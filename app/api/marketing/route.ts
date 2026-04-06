import { NextResponse } from "next/server";
import { getMarketingContacts } from "../../lib/data";

export async function GET() {
    try {
        const marketing = await getMarketingContacts();
        return NextResponse.json(marketing);
    } catch (error) {
        console.error("API Error (Marketing):", error);
        return NextResponse.json({ error: "Failed to fetch marketing team" }, { status: 500 });
    }
}
