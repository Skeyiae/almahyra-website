"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { models } from "../data/configData";
import { Model } from "../types/config";
import SitePlan from "./SitePlan";


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

interface ModelCardProps {
    model: Model;
}

function ModelCard({ model }: ModelCardProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    const activeVariant = model.variants[activeIndex];

    // Handle button click - scroll to that image
    const handleVariantClick = (idx: number) => {
        if (!scrollRef.current) return;
        
        isScrollingRef.current = true;
        setActiveIndex(idx);
        
        const container = scrollRef.current;
        const targetScroll = idx * container.offsetWidth;
        
        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
        
        // Unlock auto-sync after animation
        setTimeout(() => {
            isScrollingRef.current = false;
        }, 600);
    };

    // Auto-sync index on scroll
    const handleScroll = () => {
        if (isScrollingRef.current || !scrollRef.current) return;
        
        const container = scrollRef.current;
        const scrollPosition = container.scrollLeft;
        const itemWidth = container.offsetWidth;
        
        if (itemWidth > 0) {
            const newIndex = Math.round(scrollPosition / itemWidth);
            if (newIndex !== activeIndex && newIndex >= 0 && newIndex < model.variants.length) {
                setActiveIndex(newIndex);
            }
        }
    };

    // Intersection Observer for reveal animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            className="bg-bg-card border border-border-glass rounded-lg overflow-hidden glass-blur transition-smooth hover:border-[rgba(201,169,110,0.15)] reveal"
            ref={cardRef}
        >
            {/* Header */}
            <div className="p-5 md:p-8 pb-0 flex items-start justify-between gap-5">
                <div className="model-info">
                    <h3 className="font-display text-2xl font-bold text-text-primary">
                        {model.name}
                    </h3>
                    {model.description && (
                        <p className="text-[0.9rem] text-text-secondary font-light">
                            {model.description}
                        </p>
                    )}
                </div>
            </div>
            {/* Image Viewer - Scroll Slider (Full width on mobile) */}
            <div className="relative md:px-8 py-0 md:py-6">
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="relative flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:rounded-md aspect-[16/10] bg-background-secondary"
                >
                    {model.variants.map((variant, idx) => (
                        <div key={variant.id} className="relative flex-shrink-0 w-full h-full snap-center">
                            <Image
                                src={variant.image}
                                alt={`${model.name} - ${variant.label}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 1200px"
                                className="object-cover"
                                priority={idx === 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Overlay Info (Centered at the bottom) */}
                <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-[5] gap-1 md:gap-2">
                    <span className="font-display text-[0.65rem] md:text-[0.85rem] font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                        {activeVariant.label}
                    </span>
                    <span className="text-[0.55rem] md:text-[0.65rem] text-white/40 font-bold tracking-widest drop-shadow-md">
                        {activeIndex + 1} &nbsp;|&nbsp; {model.variants.length}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="px-5 md:px-8 pb-8">
                <div className="text-[0.65rem] md:text-[0.75rem] font-medium text-text-muted uppercase tracking-[2px] mb-4">
                    Pilih Varian
                </div>
                <div className="flex overflow-x-auto md:flex-wrap gap-3 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 pb-2">
                    {model.variants.map((variant, idx) => (
                        <button
                            key={variant.id}
                            className={`flex items-center gap-2 px-3.5 py-2 md:px-4.5 md:py-2.5 bg-bg-glass border-2 rounded-sm cursor-pointer transition-fast font-body text-xs md:text-[0.85rem] whitespace-nowrap ${idx === activeIndex ? "border-accent bg-[rgba(201,169,110,0.08)] text-text-primary" : "border-transparent text-text-secondary hover:bg-white/10 hover:text-text-primary"}`}
                            onClick={() => handleVariantClick(idx)}
                        >
                            <span
                                className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white/15 transition-fast flex-shrink-0 ${idx === activeIndex ? "border-accent shadow-[0_0_12px_var(--accent-glow)]" : ""}`}
                                style={{ backgroundColor: variant.color }}
                            />
                            {variant.label}
                        </button>
                    ))}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2.5 mt-5 overflow-x-auto pb-1 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
                    {model.variants.map((variant, idx) => (
                        <button
                            key={variant.id}
                            className={`w-16 h-11 md:w-20 md:h-[54px] rounded-sm overflow-hidden cursor-pointer border-2 transition-fast flex-shrink-0 ${idx === activeIndex ? "border-accent opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
                            onClick={() => handleVariantClick(idx)}
                        >
                            <Image
                                src={variant.image}
                                alt={variant.label}
                                width={80}
                                height={54}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ModelConfiguratorProps {
    activePropertyId?: string;
    propertyName?: string;
    sitePlanImage?: string | null;
    units: Unit[];
    onUnitSelect?: (unit: any) => void;
    selectedUnitId?: string;
    imagesStandard?: any;
    imagesPremium?: any;
}

export default function ModelConfigurator({
    activePropertyId,
    propertyName,
    sitePlanImage,
    units,
    onUnitSelect,
    selectedUnitId,
    imagesStandard,
    imagesPremium
}: ModelConfiguratorProps) {
    const [filter, setFilter] = useState<"All" | "Standard" | "Premium">("All");

    // Filter and Sort units based on the selected type and natural label order
    const filteredUnits = units
        .filter((unit: any) => {
            if (filter === "All") return true;

            const unitType = unit.type.toLowerCase();
            const filterType = filter.toLowerCase();

            // Rule 1: Based on number of bedrooms
            if (filter === "Premium" && unit.bedrooms === 3) return true;
            if (filter === "Standard" && (unit.bedrooms === 2 || unit.bedrooms === 1)) return true;

            // Rule 2: Direct match in type string (e.g., "Premium" in "Type 70 Premium")
            if (unitType.includes(filterType)) return true;

            // Rule 3: Custom mapping for legacy dimension-based types
            if (filter === "Standard" && unitType.includes("60x84")) return true;
            if (filter === "Premium" && unitType.includes("80x105")) return true;

            return false;
        })
        .sort((a: any, b: any) => {
            const labelA = a.label || a.id || "";
            const labelB = b.label || b.id || "";
            return labelA.localeCompare(labelB, undefined, { numeric: true, sensitivity: 'base' });
        });

    // Build separate models for Standard and Premium types
    const dbModels = useMemo(() => {
        const models = [];

        // Helper to convert arrays of {label, url} to variants
        const buildVariants = (data: any, suffix: string) => {
            if (!data || !Array.isArray(data)) return [];
            return data.map((img: any, idx: number) => ({
                id: `db-${suffix}-${idx}`,
                label: img.label || `Tampilan ${idx + 1}`,
                color: suffix === 'standard' ? "#f5f0e8" : "#8B6914",
                image: img.url,
                category: suffix === 'standard' ? "Standard" : "Premium"
            }));
        };

        const standardVariants = buildVariants(imagesStandard, 'standard');
        if (standardVariants.length > 0) {
            models.push({
                id: `db-model-standard-${activePropertyId}`,
                propertyId: activePropertyId || "",
                name: `Tipe Standard`,
                description: ``,
                variants: standardVariants,
                category: "Standard"
            });
        }


        const premiumVariants = buildVariants(imagesPremium, 'premium');
        if (premiumVariants.length > 0) {
            models.push({
                id: `db-model-premium-${activePropertyId}`,
                propertyId: activePropertyId || "",
                name: `Tipe Premium`,
                description: ``,
                variants: premiumVariants,
                category: "Premium"
            });
        }

        return models;
    }, [imagesStandard, imagesPremium, activePropertyId, propertyName]);

    // Filter models based on the active property and unit type filter
    const filteredModels = useMemo(() => {
        const baseModels = dbModels.length > 0
            ? dbModels
            : models.filter((model) => model.propertyId === activePropertyId);

        if (filter === "All") return baseModels;
        return baseModels.filter((m: any) => m.category === filter || (m.variants && m.variants[0]?.category === filter));
    }, [dbModels, activePropertyId, filter]);

    if (filteredModels.length === 0 && units.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed border-border-glass rounded-lg">
                <p className="text-text-muted font-body">Belum ada model untuk perumahan ini.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-16">
            {/* Model Showcase */}
            {filteredModels.length > 0 && (
                <div className="flex flex-col gap-12">
                    {filteredModels.map((model) => (
                        <ModelCard key={model.id} model={model} />
                    ))}
                </div>
            )}

            {/* Site Plan Visualization */}
            {sitePlanImage && (
                <div className="mt-8">
                    <SitePlan
                        imageUrl={sitePlanImage}
                        propertyName={propertyName || activePropertyId || ""}
                    />
                </div>
            )}

            {/* Unit Status Table */}
            <div className="mt-8 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h3 className="font-display text-2xl font-bold text-text-primary">Status & Stok Unit</h3>
                        <p className="text-text-secondary text-sm font-light mt-1">Klik pada baris unit untuk melihat detail spesifikasi</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                            {(["All", "Standard", "Premium"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-4 py-1.5 rounded-md text-[0.75rem] font-bold transition-all ${filter === t
                                        ? "bg-accent text-background-primary shadow-lg"
                                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                                        }`}
                                >
                                    {t === "All" ? "SEMUA" : t.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-white/10 hidden md:block mx-1"></div>

                        <div className="flex gap-4 text-[0.7rem] font-medium uppercase tracking-wider text-text-muted">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> Available
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]"></span> Booking
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></span> Terjual / Akad
                            </div>
                        </div>
                    </div>
                </div>

                {filteredUnits.length > 0 ? (
                    <div className="animate-fade-in-up">
                        {/* VIEW DESKTOP: Tabel (Hidden on Mobile) */}
                        <div className="hidden md:block bg-bg-card border border-border-glass rounded-xl overflow-hidden glass-blur shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-6 py-4 font-display text-sm font-bold text-text-primary">No. Kapling</th>
                                        <th className="px-6 py-4 font-display text-sm font-bold text-text-primary">Tipe</th>
                                        <th className="px-6 py-4 font-display text-sm font-bold text-text-primary">Harga</th>
                                        <th className="px-6 py-4 font-display text-sm font-bold text-text-primary">Status</th>
                                        <th className="px-6 py-4 font-display text-sm font-bold text-text-primary">Fasilitas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUnits.map((unit: any) => (
                                        <tr
                                            key={unit.id}
                                            className={`cursor-pointer transition-all duration-200 ${selectedUnitId === unit.id ? 'bg-accent/10 border-l-4 border-l-accent' : 'hover:bg-white/[0.05] border-l-4 border-l-transparent'}`}
                                            onClick={() => onUnitSelect?.(unit)}
                                        >
                                            <td className="px-6 py-4 font-body text-sm font-bold text-accent">{unit.label || unit.id}</td>
                                            <td className="px-6 py-4 font-body text-sm text-text-secondary">{unit.type}</td>
                                            <td className="px-6 py-4 font-body text-sm text-text-primary font-semibold">Rp {unit.price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    unit.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    (unit.status === 'Booked' || unit.status === 'Booking') ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' :
                                                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                    }`}>
                                                    {unit.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-body text-[11px] text-text-muted leading-relaxed">
                                                {unit.features.join(", ")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* VIEW MOBILE: Ultra-Slim List (Hidden on Desktop) */}
                        <div className="md:hidden flex flex-col gap-2">
                            {filteredUnits.map((unit: any) => (
                                <div
                                    key={unit.id}
                                    className={`px-3 py-2.5 rounded-lg border glass-blur transition-all duration-200 flex items-center justify-between gap-3 ${selectedUnitId === unit.id ? 'bg-accent/10 border-accent' : 'bg-bg-card border-border-glass'}`}
                                    onClick={() => onUnitSelect?.(unit)}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="font-display font-black text-accent text-sm whitespace-nowrap">{unit.label || unit.id}</span>
                                        <div className="h-4 w-px bg-white/10"></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-body font-bold text-text-primary text-[0.75rem] leading-none truncate">Rp {unit.price}</span>
                                            <span className="text-[0.6rem] text-text-muted font-medium leading-tight truncate">{unit.type} | {unit.bedrooms}KT {unit.bathrooms}KM</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-tighter ${
                                            unit.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            (unit.status === 'Booked' || unit.status === 'Booking') ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' :
                                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                            {unit.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-border-glass rounded-xl">
                        <p className="text-text-muted font-body">Belum ada data unit untuk perumahan ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}



