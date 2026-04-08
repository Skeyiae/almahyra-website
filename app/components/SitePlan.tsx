"use client";

import Image from "next/image";
import { useState } from "react";

interface SitePlanProps {
    imageUrl: string;
    propertyName: string;
}

export default function SitePlan({ imageUrl, propertyName }: SitePlanProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    if (!imageUrl) return null;

    return (
        <div className="relative w-full mb-16 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="group relative overflow-hidden rounded-3xl border border-border-glass bg-bg-glass glass-blur p-4 md:p-8 transition-smooth hover:border-accent/40 shadow-2xl">
                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="font-display text-2xl font-bold text-text-primary capitalize">
                            Site Plan {propertyName}
                        </h3>
                        <p className="text-text-secondary text-sm font-light mt-1">
                            Denah tata ruang dan posisi unit dalam kawasan perumahan.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl text-accent text-sm font-medium transition-smooth"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isZoomed ? (
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            ) : (
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            )}
                        </svg>
                        {isZoomed ? "Kecilkan Tampilan" : "Perbesar Tampilan"}
                    </button>
                </div>

                {/* Image Container */}
                <div
                    className={`relative w-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden rounded-2xl ${isZoomed ? "h-[600px] md:h-[800px]" : "h-[350px] md:h-[500px]"
                        }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <Image
                        src={imageUrl}
                        alt={`Site Plan ${propertyName}`}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                        priority
                    />

                    {/* Overlay info */}
                    {!isZoomed && (
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pointer-events-none">
                            <span className="text-white/80 text-xs tracking-widest uppercase font-medium">Klik untuk memperbesar gambar</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-[100px] rounded-full pointer-events-none opacity-50" />
        </div>
    );
}
