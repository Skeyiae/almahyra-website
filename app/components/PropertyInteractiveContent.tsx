"use client";

import { useState } from "react";
import SpecGrid from "./SpecGrid";
import Landmarks from "./Landmarks";
import MortgageCalculator from "./MortgageCalculator";
import ModelConfigurator from "./ModelConfigurator";

interface Unit {
    id: string;
    propertyId: string;
    label: string | null;
    type: string;
    price: string;
    status: string;
    features: string[];
    bedrooms?: number | null;
    bathrooms?: number | null;
    buildingArea?: number | null;
    landArea?: number | null;
    electricity?: string | null;
    waterSource?: string | null;
}

interface PropertyInteractiveContentProps {
    propertyId: string;
    propertyName: string;
    units: Unit[];
    landmarks: any[];
    locationText: string;
    sitePlanImage: string | null;
    mapUrl: string | null;
    imagesStandard?: any;
    imagesPremium?: any;
    mortgageSchemes?: any;
    facilities?: string[];
}

export default function PropertyInteractiveContent({
    propertyId,
    propertyName,
    units,
    landmarks,
    locationText,
    sitePlanImage,
    mapUrl,
    imagesStandard,
    imagesPremium,
    mortgageSchemes,
    facilities = [
        "Cluster One Gate System (Keamanan 24 Jam)",
        "Fasilitas Masjid di dalam komplek",
        "Jalan Lebar dan Lingkungan Asri"
    ]
}: PropertyInteractiveContentProps) {
    // State untuk unit yang sedang dipilih
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(units.length > 0 ? units[0] : null);

    // Fungsi untuk update specs berdasarkan unit yang dipilih
    const specs = selectedUnit ? [
        { label: "Kamar Tidur", value: selectedUnit.bedrooms ? `${selectedUnit.bedrooms} Unit` : null, icon: "bed" as const },
        { label: "Kamar Mandi", value: selectedUnit.bathrooms ? `${selectedUnit.bathrooms} Unit` : null, icon: "bath" as const },
        { label: "Listrik", value: selectedUnit.electricity || null, icon: "power" as const },
        { label: "Sumber Air", value: selectedUnit.waterSource || null, icon: "water" as const },
        { label: "Luas Bangunan", value: selectedUnit.buildingArea ? `${selectedUnit.buildingArea} m²` : null, icon: "home" as const },
        { label: "Luas Tanah", value: selectedUnit.landArea ? `${selectedUnit.landArea} m²` : null, icon: "layout" as const },
    ].filter(spec => spec.value !== null) as any[] : [];

    const priceInt = selectedUnit ? parseInt(selectedUnit.price.replace(/\./g, '')) : 350000000;

    return (
        <>
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* Left: Specs & Landmarks */}
                        <div className="space-y-16">
                            <div>
                                <h3 className="font-display text-xl md:text-3xl font-bold text-white mb-4 md:mb-8">
                                    Kapling: <span className="text-accent">{selectedUnit?.label || selectedUnit?.type || "Unit"}</span>
                                </h3>
                                <SpecGrid specs={specs} />
                            </div>

                            <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 glass-blur relative overflow-hidden shadow-2xl">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none text-accent">
                                    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                </div>
                                
                                <h3 className="font-display text-xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full hidden md:block"></span>
                                    Lokasi Strategis
                                </h3>
                                
                                <div className="relative z-10">
                                    <Landmarks landmarks={landmarks} />
                                    <div className="mt-8 pt-8 border-t border-white/10 flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 -mt-1 shadow-[0_0_15px_rgba(201,169,110,0.2)]">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        </div>
                                        <p className="text-text-primary text-sm md:text-lg font-medium leading-relaxed">
                                            <span className="text-accent font-black uppercase tracking-wider text-[0.65rem] md:text-[0.75rem] block mb-1">Lokasi Proyek</span> 
                                            {locationText}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Calculator */}
                        <div className="lg:sticky lg:top-32">
                            <MortgageCalculator
                                price={priceInt}
                                propertyId={propertyId}
                                dbSchemes={mortgageSchemes}
                            />

                            <div className="mt-8 p-6 rounded-2xl border border-border-glass bg-bg-glass animate-fade-in shadow-xl">
                                <h4 className="font-display font-bold text-accent mb-2">Fasilitas Komplek</h4>
                                <ul className="text-text-secondary text-sm space-y-2 font-light">
                                    {(facilities && facilities.length > 0) ? facilities.map((facility, index) => (
                                        <li key={index}>• {facility}</li>
                                    )) : (
                                        <li>• Fasilitas lengkap dan lingkungan asri</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative py-[var(--section-padding)]" id="configurator">
                <div className="max-w-[1200px] mx-auto px-6 relative">
                    <div className="text-center mb-16">
                        <span className="inline-block font-body text-[0.8rem] font-medium text-accent uppercase tracking-[3px] mb-4">
                            Konfigurasi Unit & Siteplan
                        </span>
                        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-1px] mb-4 text-text-primary">
                            Visualisasi & Stok Real-time
                        </h2>
                        <p className="text-[1.05rem] text-text-secondary max-w-[500px] mx-auto font-light">
                            Pilih unit di daftar stok untuk melihat spesifikasi detail dan simulasi angsurannya.
                        </p>
                    </div>

                    <ModelConfigurator
                        activePropertyId={propertyId}
                        propertyName={propertyName}
                        units={units}
                        onUnitSelect={(unit: any) => setSelectedUnit(unit)}
                        selectedUnitId={selectedUnit?.id}
                        imagesStandard={imagesStandard}
                        imagesPremium={imagesPremium}
                        sitePlanImage={
                            (sitePlanImage && sitePlanImage.startsWith('http'))
                                ? sitePlanImage
                                : (mapUrl && mapUrl.startsWith('http'))
                                    ? mapUrl
                                    : "/siteplan-placeholder.png"
                        }
                    />
                </div>
            </section>
        </>
    );
}


