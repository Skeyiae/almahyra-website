"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { models } from "../data/configData";
import { Model } from "../types/config";
import { Maximize2, Minimize2, Smartphone, Monitor } from "lucide-react";
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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenOrientation, setFullscreenOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const cardRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    const activeVariant = model.variants[activeIndex];

    const requestFullscreen = async (orientation: 'landscape' | 'portrait') => {
        setFullscreenOrientation(orientation);
        if (!isFullscreen) {
            try {
                if (fullscreenContainerRef.current) {
                    if (fullscreenContainerRef.current.requestFullscreen) {
                        await fullscreenContainerRef.current.requestFullscreen();
                    }
                    if (window.screen && window.screen.orientation && (window.screen.orientation as any).lock) {
                        try {
                            await (window.screen.orientation as any).lock(orientation);
                        } catch (e) {
                            // Ignore orientation lock errors
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
            setIsFullscreen(true);
        } else {
            // Already fullscreen, just attempt to switch orientation
            if (window.screen && window.screen.orientation && (window.screen.orientation as any).lock) {
                try {
                    await (window.screen.orientation as any).lock(orientation);
                } catch (e) {
                    // Ignore
                }
            }
        }
    };

    const exitFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                if (window.screen && window.screen.orientation && (window.screen.orientation as any).unlock) {
                    try {
                        (window.screen.orientation as any).unlock();
                    } catch (e) {}
                }
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        } catch (e) {
            console.error(e);
        }
        setIsFullscreen(false);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                if (window.screen && window.screen.orientation && (window.screen.orientation as any).unlock) {
                    try {
                        (window.screen.orientation as any).unlock();
                    } catch (e) {}
                }
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Sync scroll position when fullscreen layout changes
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            // Delay slightly to allow layout to update after fullscreen change
            setTimeout(() => {
                container.scrollTo({
                    left: activeIndex * container.offsetWidth,
                    behavior: 'instant' as ScrollBehavior
                });
            }, 50);
        }
    }, [isFullscreen]);

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
            {/* Image Viewer - Scroll Slider (Full width on mobile) */}
            <div 
                ref={fullscreenContainerRef} 
                className={`relative ${isFullscreen ? 'bg-black w-full h-full flex flex-col justify-center items-center' : 'md:px-8 py-0 md:py-6'}`}
            >
                {/* Fullscreen Toggle Buttons */}
                <div className={`absolute z-[25] flex gap-2 ${isFullscreen ? 'top-4 right-4 md:top-8 md:right-8' : 'top-2 right-2 md:top-8 md:right-10'}`}>
                    {isFullscreen ? (
                        <>
                            {fullscreenOrientation === 'landscape' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); requestFullscreen('portrait'); }}
                                    className="p-2 px-3 rounded-full bg-black/40 hover:bg-accent border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5 md:text-sm text-xs"
                                    title="Ubah ke Portrait"
                                >
                                    <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="hidden md:inline">Portrait</span>
                                </button>
                            )}
                            {fullscreenOrientation === 'portrait' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); requestFullscreen('landscape'); }}
                                    className="p-2 px-3 rounded-full bg-black/40 hover:bg-accent border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5 md:text-sm text-xs"
                                    title="Ubah ke Landscape"
                                >
                                    <Monitor className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="hidden md:inline">Landscape</span>
                                </button>
                            )}
                            <button 
                                onClick={(e) => { e.stopPropagation(); exitFullscreen(); }}
                                className="p-2 rounded-full bg-black/40 hover:bg-red-500/80 border border-white/20 text-white backdrop-blur-md transition-all"
                                title="Keluar Fullscreen"
                            >
                                <Minimize2 size={16} className="md:w-5 md:h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); requestFullscreen('portrait'); }}
                                className="p-2 rounded-full bg-black/40 hover:bg-accent border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5 md:text-sm text-xs"
                                title="Fullscreen Portrait"
                            >
                                <Smartphone size={16} className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); requestFullscreen('landscape'); }}
                                className="p-2 rounded-full bg-black/40 hover:bg-accent border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5 md:text-sm text-xs"
                                title="Fullscreen Landscape"
                            >
                                <Monitor size={16} className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Type Dimension Label Inside Image (Top Left) */}
                <div className={`absolute z-[15] pointer-events-none ${isFullscreen ? 'top-4 left-4 md:top-8 md:left-8' : 'top-2 md:top-8 left-2 md:left-10'}`}>
                    <span className={`font-display font-black text-black/90 bg-white/70 backdrop-blur-md rounded-sm tracking-[0.1em] uppercase shadow-sm ${isFullscreen ? 'text-[0.8rem] md:text-sm px-3 py-1' : 'text-[0.6rem] md:text-[0.75rem] px-2 py-0.5'}`}>
                        {model.category}
                    </span>
                </div>
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className={`relative flex overflow-x-auto snap-x snap-mandatory no-scrollbar shadow-lg ${isFullscreen ? 'w-full h-full items-center' : 'md:rounded-md aspect-[16/10] bg-background-secondary'}`}
                >
                    {model.variants.map((variant, idx) => (
                        <div key={variant.id} className="relative flex-shrink-0 w-full h-full snap-center flex justify-center items-center">
                            {isFullscreen && <div className="absolute inset-0 bg-black" />} {/* Prevents white flash while loading */}
                            <Image
                                src={variant.image}
                                alt={`${model.name} - ${variant.label}`}
                                fill
                                sizes={isFullscreen ? "100vw" : "(max-width: 768px) 100vw, 1200px"}
                                className={isFullscreen ? "object-contain" : "object-cover"}
                                priority={idx === 0 || isFullscreen}
                            />
                        </div>
                    ))}
                </div>

                {/* Overlay Info (Centered at the bottom) - RESTORED */}
                <div className={`absolute left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-[5] gap-1 md:gap-2 ${isFullscreen ? 'bottom-8 md:bottom-12' : 'bottom-4 md:bottom-8'}`}>
                    <span className={`font-display font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,1)] ${isFullscreen ? 'text-[0.85rem] md:text-xl' : 'text-[0.65rem] md:text-[0.85rem]'}`}>
                        {activeVariant.label}
                    </span>
                    <span className={`text-white/40 font-bold tracking-widest drop-shadow-md ${isFullscreen ? 'text-[0.75rem] md:text-sm' : 'text-[0.55rem] md:text-[0.65rem]'}`}>
                        {activeIndex + 1} &nbsp;|&nbsp; {model.variants.length}
                    </span>
                </div>

            </div>

            {/* Thumbnails - RESTORED */}
            <div className="px-5 md:px-8 pb-8">
                <div className="flex gap-2.5 mt-2 overflow-x-auto pb-1 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
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
    const [filter, setFilter] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    // Helper to format type as LB/LT
    const formatType = (u: any) => {
        if (u.buildingArea && u.landArea) return `${u.buildingArea}/${u.landArea}`;
        return u.type;
    };

    // Extract unique types available in this property
    const availableTypes = useMemo(() => {
        const types = new Set<string>();
        units.forEach(u => {
            types.add(formatType(u));
        });
        return Array.from(types).sort();
    }, [units]);

    // Filter and Sort units based on the selected type and natural label order
    const filteredUnits = units
        .filter((unit: any) => {
            if (filter === "All") return true;
            return formatType(unit) === filter;
        })
        .sort((a: any, b: any) => {
            const labelA = a.label || a.id || "";
            const labelB = b.label || b.id || "";
            return labelA.localeCompare(labelB, undefined, { numeric: true, sensitivity: 'base' });
        });

    // Reset pagination when filter or property changes
    useEffect(() => {
        setCurrentPage(0);
    }, [filter, activePropertyId]);

    const totalPages = Math.ceil(filteredUnits.length / pageSize);
    const visibleUnits = filteredUnits.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    // Build separate models for each type found
    const dbModels = useMemo(() => {
        const models = [];

        // Helper to convert arrays of {label, url} to variants
        const buildVariants = (data: any, suffix: string, typeName: string) => {
            if (!data || !Array.isArray(data)) return [];
            return data.map((img: any, idx: number) => ({
                id: `db-${suffix}-${idx}`,
                label: img.label || `${typeName} - View ${idx + 1}`,
                color: suffix === 'standard' ? "#f5f0e8" : "#8B6914",
                image: img.url,
                category: typeName // Use typeName instead of Standard/Premium
            }));
        };

        // Find which unit types correspond to Standard and Premium images
        const standardUnit = units.find(u => (u.bedrooms === 2 || u.bedrooms === 1) || u.type?.includes("60/84") || u.type?.toLowerCase().includes("standard"));
        const premiumUnit = units.find(u => u.bedrooms === 3 || u.type?.includes("80/105") || u.type?.toLowerCase().includes("premium"));
        
        const standardTypeName = standardUnit ? formatType(standardUnit) : "Standard";
        const premiumTypeName = premiumUnit ? formatType(premiumUnit) : "Premium";

        const standardVariants = buildVariants(imagesStandard, 'standard', standardTypeName);
        const premiumVariants = buildVariants(imagesPremium, 'premium', premiumTypeName);

        // Merge logic: If both types are the same, combine their images into one card
        if (standardTypeName === premiumTypeName) {
            const combinedVariants = [...standardVariants, ...premiumVariants];
            if (combinedVariants.length > 0) {
                models.push({
                    id: `db-model-combined-${activePropertyId}`,
                    propertyId: activePropertyId || "",
                    name: `Tipe ${standardTypeName}`,
                    description: ``,
                    variants: combinedVariants,
                    category: standardTypeName
                });
            }
        } else {
            // Otherwise, keep them separate but with correct type labels
            if (standardUnit && standardVariants.length > 0) {
                models.push({
                    id: `db-model-standard-${activePropertyId}`,
                    propertyId: activePropertyId || "",
                    name: `Tipe ${standardTypeName}`,
                    description: ``,
                    variants: standardVariants,
                    category: standardTypeName
                });
            }

            if (premiumUnit && premiumVariants.length > 0) {
                models.push({
                    id: `db-model-premium-${activePropertyId}`,
                    propertyId: activePropertyId || "",
                    name: `Tipe ${premiumTypeName}`,
                    description: ``,
                    variants: premiumVariants,
                    category: premiumTypeName
                });
            }
        }

        return models;
    }, [imagesStandard, imagesPremium, activePropertyId, units]);

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
                        <p className="text-text-primary text-sm font-medium mt-1">Klik pada baris unit untuk melihat detail spesifikasi</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto no-scrollbar max-w-full">
                            <button
                                onClick={() => setFilter("All")}
                                className={`px-4 py-1.5 rounded-md text-[0.7rem] font-bold transition-all whitespace-nowrap ${filter === "All"
                                    ? "bg-accent text-background-primary shadow-lg"
                                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                                    }`}
                            >
                                SEMUA
                            </button>
                            {availableTypes.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-4 py-1.5 rounded-md text-[0.7rem] font-bold transition-all whitespace-nowrap ${filter === t
                                        ? "bg-accent text-background-primary shadow-lg"
                                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                                        }`}
                                >
                                    {t.toUpperCase()}
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
                                    {visibleUnits.map((unit: any) => (
                                        <tr
                                            key={unit.id}
                                            className={`cursor-pointer transition-all duration-200 ${selectedUnitId === unit.id ? 'bg-accent/10 border-l-4 border-l-accent' : 'hover:bg-white/[0.05] border-l-4 border-l-transparent'}`}
                                            onClick={() => onUnitSelect?.(unit)}
                                        >
                                            <td className="px-6 py-4 font-body text-sm font-bold text-accent">{unit.label || unit.id}</td>
                                            <td className="px-6 py-4 font-body text-sm text-text-secondary">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-text-primary">Tipe {formatType(unit)}</span>
                                                    <span className="text-[10px] opacity-50 px-1.5 py-0.5 border border-white/10 rounded uppercase">{unit.type}</span>
                                                </div>
                                            </td>
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
                                            <td className="px-6 py-4 font-body text-[11px] text-text-primary font-bold leading-relaxed">
                                                {unit.features.join(", ")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* VIEW MOBILE: Ultra-Slim List (Hidden on Desktop) */}
                        <div className="md:hidden flex flex-col gap-2">
                            {visibleUnits.map((unit: any) => (
                                <div
                                    key={unit.id}
                                    className={`px-3 py-2.5 rounded-lg border transition-all duration-200 flex items-center justify-between gap-3 ${selectedUnitId === unit.id ? 'bg-accent/10 border-accent' : 'bg-bg-card border-border-glass'}`}
                                    onClick={() => onUnitSelect?.(unit)}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="font-display font-black text-accent text-sm whitespace-nowrap">{unit.label || unit.id}</span>
                                        <div className="h-4 w-px bg-white/10"></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-body font-black text-text-primary text-[0.85rem] leading-none mb-1">Rp {unit.price}</span>
                                            <span className="text-[0.6rem] text-text-secondary font-black leading-tight truncate">Tipe {formatType(unit)} | {unit.bedrooms}KT {unit.bathrooms}KM</span>
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

                        {/* Pagination with Arrows */}
                        {filteredUnits.length > pageSize && (
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                        className={`group flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${
                                            currentPage === 0 
                                            ? "opacity-20 cursor-not-allowed border-white/5" 
                                            : "opacity-100 cursor-pointer border-white/10 bg-white/5 hover:border-accent/50 hover:bg-white/10 text-text-secondary hover:text-accent shadow-lg"
                                        }`}
                                        aria-label="Halaman Sebelumnya"
                                    >
                                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M15 18l-6-6 6-6" />
                                        </svg>
                                    </button>

                                    <div className="flex flex-col items-center">
                                        <span className="font-display text-[0.65rem] font-black text-accent tracking-[3px] uppercase mb-0.5">Halaman</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-display text-lg font-bold text-white">{currentPage + 1}</span>
                                            <span className="text-white/20 text-sm">/</span>
                                            <span className="text-text-muted font-medium text-sm">{totalPages}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className={`group flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${
                                            currentPage === totalPages - 1 
                                            ? "opacity-20 cursor-not-allowed border-white/5" 
                                            : "opacity-100 cursor-pointer border-white/10 bg-white/5 hover:border-accent/50 hover:bg-white/10 text-text-secondary hover:text-accent shadow-lg"
                                        }`}
                                        aria-label="Halaman Selanjutnya"
                                    >
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-[0.6rem] text-text-muted font-bold tracking-[0.1em] uppercase opacity-50 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    Menampilkan {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, filteredUnits.length)} dari {filteredUnits.length} Unit
                                </div>
                            </div>
                        )}
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
