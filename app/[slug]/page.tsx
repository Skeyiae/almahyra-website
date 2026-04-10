import TransitionLink from "../components/TransitionLink";
import { getProperties, getPropertyBySlug } from "../lib/data";
import PromoBadge from "../components/PromoBadge";
import dynamic from "next/dynamic";

const PropertyInteractiveContent = dynamic(() => import("../components/PropertyInteractiveContent"), {
    loading: () => <div className="min-h-screen flex items-center justify-center text-accent/50 py-20">Memuat Visualisasi Data...</div>
});
import ClientOnlyChatbot from "../components/ClientOnlyChatbot";
import MarketingButton from "../components/MarketingButton";

import Loading from "./loading";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Gunakan Suspense dengan key=slug agar animasi Loading terpicu paksa saat ganti slug
    return (
        <Suspense key={slug} fallback={<Loading />}>
            <PropertyData slug={slug} />
        </Suspense>
    );
}

async function PropertyData({ slug }: { slug: string }) {
    // Fetch properti lengkap dengan unitnya menggunakan cache
    const activeProperty = await getPropertyBySlug(slug);

    if (!activeProperty) {
        return <div className="min-h-screen flex items-center justify-center text-white">Property Not Found</div>;
    }

    const allProperties = await getProperties();

    return (
        <main className="min-h-screen overflow-x-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 overflow-hidden" id="hero">
                {/* Hero Background Glow */}
                <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] hero-gradient opacity-40 pointer-events-none z-0" />

                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-background-primary to-transparent pointer-events-none z-[1]" />

                {/* Back Button (Top-Left) */}
                <div className="absolute top-6 left-6 z-[10] md:top-10 md:left-10 animate-fade-in">
                    <TransitionLink
                        href="/"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-all duration-300 group"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent">
                            <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="font-display text-[0.7rem] md:text-sm font-medium tracking-wider uppercase">Home</span>
                    </TransitionLink>
                </div>

                <div className="relative z-[2] max-width-[800px] animate-fade-in-up flex flex-col items-center">
                    {activeProperty.promoBadge ? (
                        <PromoBadge text={activeProperty.promoBadge} subtext={activeProperty.promoSubtext || ""} />
                    ) : (
                        <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 border border-white/10 rounded-full font-body text-[0.85rem] text-accent glass-blur">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)] animate-pulse" />
                            Almahyra Property - {activeProperty.name}
                        </span>
                    )}

                    <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-6 text-gradient capitalize">
                        {activeProperty.titleTop}
                        <span className="block text-[0.35em] font-light tracking-[8px] uppercase opacity-60 mt-3">
                            {activeProperty.titleBottom}
                        </span>
                    </h1>

                    <p className="font-body text-[clamp(1rem,2vw,1.25rem)] text-text-secondary max-w-[550px] mx-auto mb-12 font-light leading-relaxed">
                        {activeProperty.description}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-6">
                        <a href="#configurator" className="w-full sm:w-auto inline-flex items-center justify-center gap-[10px] px-7 md:px-9 py-3.5 md:py-4 bg-gradient-to-br from-accent to-accent-dark text-[#0a0a0f] font-display font-semibold text-sm md:text-base rounded-full transition-smooth hover:translate-y-[-2px] hover:shadow-[0_20px_40px_var(--accent-glow)] group">
                            Jelajahi Unit
                            <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                        <MarketingButton
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-[10px] px-7 md:px-9 py-3.5 md:py-4 bg-white/5 border border-border-glass text-white font-display font-semibold text-sm md:text-base rounded-full transition-smooth hover:bg-white/10 cursor-pointer"
                        >
                            Hubungi Marketing
                        </MarketingButton>
                    </div>
                </div>

                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 text-text-muted text-[0.65rem] md:text-[0.75rem] tracking-[2px] uppercase pointer-events-none select-none">
                    <span>Scroll</span>
                    <div className="w-px h-6 md:h-10 bg-gradient-to-b from-accent to-transparent animate-scroll-pulse" />
                </div>
            </section>

            {/* PROPERTY SELECTION SECTION */}
            <section className="relative z-10 -mt-10 px-6 overflow-hidden">
                <div className="max-w-[1200px] mx-auto overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex gap-3 justify-start md:justify-center min-w-max">
                        {allProperties.map((prop) => (
                            <TransitionLink
                                key={prop.id}
                                href={`/${prop.id}`}
                                className={`px-6 py-3 rounded-full font-display text-sm font-medium transition-all duration-300 border ${activeProperty.id === prop.id
                                    ? "bg-accent text-background-primary border-accent shadow-[0_10px_20px_var(--accent-glow-subtle)]"
                                    : "bg-bg-glass text-text-secondary border-border-glass hover:border-accent hover:text-accent-light hover:bg-white/5"
                                    }`}
                            >
                                {prop.name}
                            </TransitionLink>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE CONTENT (SPECS, CALCULATOR, CONFIGURATOR) */}
            <Suspense fallback={
                <div className="py-24 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-text-muted font-display text-sm tracking-widest uppercase">Menyiapkan Visualisasi...</p>
                </div>
            }>
                <PropertyInteractiveContent
                    propertyId={activeProperty.id}
                    propertyName={activeProperty.name}
                    units={activeProperty.units as any}
                    landmarks={activeProperty.landmarks as any[]}
                    locationText={activeProperty.locationText || "Lokasi Strategis"}
                    sitePlanImage={activeProperty.sitePlanImage}
                    mapUrl={activeProperty.mapUrl}
                    imagesStandard={(activeProperty as any).imagesStandard}
                    imagesPremium={(activeProperty as any).imagesPremium}
                    mortgageSchemes={(activeProperty as any).mortgageSchemes}
                    facilities={(activeProperty as any).facilities}
                    defaultDpAmount={(activeProperty as any).defaultDpAmount ?? 0}
                    defaultBookingAmount={(activeProperty as any).defaultBookingAmount ?? 2000000}
                />
            </Suspense>

            {/* FOOTER */}
            <footer className="py-12 px-6 border-t border-border-glass text-center">
                <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4">
                    <div className="font-display text-2xl font-bold text-accent">
                        Almahyra <span className="text-text-primary opacity-50 font-light">| {activeProperty.name}</span>
                    </div>
                    <p className="text-text-muted text-[0.85rem]">
                        &copy; {new Date().getFullYear()} Almahyra Property Research &amp; Development. All rights reserved.
                    </p>
                </div>
            </footer>
            <ClientOnlyChatbot
                salesPhone={(activeProperty as any).salesPhone || undefined}
                salesName={(activeProperty as any).salesName || undefined}
                propertyName={activeProperty.name}
                propertyId={activeProperty.id}
            />
        </main>
    );
}
