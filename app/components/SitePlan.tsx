"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Pin, X, Move } from "lucide-react";

interface SitePlanProps {
    imageUrl: string;
    propertyName: string;
}

export default function SitePlan({ imageUrl, propertyName }: SitePlanProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

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
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsPinned(!isPinned)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-smooth border ${
                                isPinned 
                                ? "bg-accent text-background-primary border-accent" 
                                : "bg-white/5 text-text-muted border-white/10 hover:border-accent/40 hover:text-accent"
                            }`}
                        >
                            <Pin size={16} className={isPinned ? "fill-current" : ""} />
                            {isPinned ? "Lepaskan Denah" : "Pin ke Layar"}
                        </button>
                        <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl text-accent text-sm font-medium transition-smooth"
                        >
                            {isZoomed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            {isZoomed ? "Kecilkan" : "Perbesar"}
                        </button>
                    </div>
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

            {/* FLOATING MINI-MAP OVERLAY */}
            <AnimatePresence>
                {isPinned && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="fixed bottom-6 right-6 z-[999] w-[280px] md:w-[400px] aspect-video bg-background-primary/80 backdrop-blur-xl border border-accent/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col group/pin"
                    >
                        {/* Floating Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-[0.7rem] font-black uppercase tracking-widest text-text-primary">Live Mini-Map</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => setIsPinned(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg text-text-muted transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Floating Content */}
                        <div className="relative flex-1 bg-black/20 p-2 overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={`Floating Site Plan`}
                                fill
                                className="object-contain p-2"
                            />
                            
                            {/* Drag Indicator Overlay (Visual only to keep it simple) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 bg-black/40 transition-opacity pointer-events-none overflow-hidden">
                                <div className="flex flex-col items-center gap-2 text-white/70">
                                    <Move size={24} />
                                    <span className="text-[0.6rem] font-bold uppercase tracking-widest">Pinned View</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
