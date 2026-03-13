// app/[slug]/page.tsx (Versi Awal)
import { getPropertyBySlug } from "../lib/data";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Ambil data properti berdasarkan slug dari URL
    const activeProperty = await getPropertyBySlug(slug);

    if (!activeProperty) {
        return <div className="min-h-screen flex items-center justify-center text-white">Property Not Found</div>;
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center p-10">
            <h1 className="text-4xl font-bold text-accent mb-4">{activeProperty.name}</h1>
            <p className="text-gray-400 max-w-md">{activeProperty.description}</p>

            <div className="mt-10 p-4 border border-white/10 rounded-xl bg-white/5">
                <p className="text-sm text-gray-500 italic">Halaman detail interaktif sedang dibangun...</p>
            </div>
        </main>
    );
}
