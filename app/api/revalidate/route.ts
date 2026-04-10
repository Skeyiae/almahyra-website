import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get("tag");
    const secret = searchParams.get("secret");

    // Optional: Add a simple secret to prevent unauthorized cache clearing
    // Ganti 'almahyra-revalidate' dengan kode rahasia pilihanmu jika ingin lebih aman
    if (secret !== "almahyra-refresh") {
        return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ message: "Missing tag parameter" }, { status: 400 });
    }

    try {
        // Next.js 15+ requires two arguments for revalidateTag. 
        // { expire: 0 } ensures immediate cache invalidation for a fresh read.
        (revalidateTag as any)(tag, { expire: 0 });
        return NextResponse.json({ 
            revalidated: true, 
            now: Date.now(),
            message: `Cache for tag '${tag}' has been cleared successfully.`
        });
    } catch (err) {
        return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
    }
}
