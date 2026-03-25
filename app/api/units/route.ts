import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    try {
        if (propertyId) {
            const units = await prisma.unit.findMany({
                where: { propertyId: propertyId },
            });
            return NextResponse.json(units);
        } else {
            const units = await prisma.unit.findMany();
            return NextResponse.json(units);
        }
    } catch (error) {
        console.error("Error fetching units:", error);
        return NextResponse.json(
            { error: "Failed to fetch units" },
            { status: 500 }
        );
    }
}
