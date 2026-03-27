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
    mortgageSchemes
}: PropertyInteractiveContentProps) {
    // State untuk unit yang sedang dipilih
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(units.length > 0 ? units[0] : null);

    // Fungsi untuk update specs berdasarkan unit yang dipilih
    const specs = selectedUnit ? [
        { label: "Kamar Tidur", value: `${selectedUnit.bedrooms} Unit`, icon: "bed" as const },
        { label: "Kamar Mandi", value: `${selectedUnit.bathrooms} Unit`, icon: "bath" as const },
        { label: "Listrik", value: selectedUnit.electricity || "1300 VA", icon: "power" as const },
        { label: "Sumber Air", value: selectedUnit.waterSource || "Sumur Bor", icon: "water" as const },
        { label: "Luas Bangunan", value: `${selectedUnit.buildingArea} m²`, icon: "home" as const },
        { label: "Luas Tanah", value: `${selectedUnit.landArea} m²`, icon: "layout" as const },
    ] : [];

    const priceInt = selectedUnit ? parseInt(selectedUnit.price.replace(/\./g, '')) : 350000000;

    return (
        <>
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* Left: Specs & Landmarks */}
                        <div className="space-y-16">
                            <div>
                                <h3 className="font-display text-3xl font-bold text-white mb-8">
                                    Kapling: <span className="text-accent">{selectedUnit?.label || selectedUnit?.type || "Unit"}</span>
                                </h3>
                                <SpecGrid specs={specs} />
                            </div>

                            <div>
                                <h3 className="font-display text-3xl font-bold text-white mb-8">Lokasi Strategis</h3>
                                <Landmarks landmarks={landmarks} />
                                <p className="mt-6 text-text-muted text-sm font-light italic">
                                    *Lokasi: {locationText}
                                </p>
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
                                    <li>• Cluster One Gate System (Keamanan 24 Jam)</li>
                                    <li>• Fasilitas Masjid di dalam komplek</li>
                                    <li>• Jalan Lebar dan Lingkungan Asri</li>
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


