"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Pin, X, Move } from "lucide-react";

interface SitePlanProps {
    imageUrl: string;
    propertyName: string;
}

export default function SitePlan({ imageUrl, propertyName }: SitePlanProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!imageUrl) return null;

    const stickyOverlay = (
        <AnimatePresence>
            {isPinned && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] h-[40vh] md:h-[75vh] bg-background-primary/98 backdrop-blur-md border-b border-accent/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                >
                    {/* Header Panel */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/5 border-b border-white/10">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent-glow)]" />
                            <div className="flex flex-col">
                                <span className="text-[0.6rem] md:text-[0.85rem] font-black uppercase tracking-[0.3em] text-accent leading-none mb-1">Site Plan Aktif</span>
                                <span className="text-[0.5rem] md:text-[0.7rem] text-text-muted font-bold uppercase tracking-widest leading-none">{propertyName}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsPinned(false)}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-full text-rose-500 text-[9px] md:text-xs font-black transition-all"
                        >
                            <X size={12} className="md:w-3.5 md:h-3.5" />
                            TUTUP
                        </button>
                    </div>

                    {/* Image Panel */}
                    <div className="relative flex-1 bg-black/40 overflow-hidden cursor-zoom-in" onClick={() => { setIsPinned(false); setIsLightboxOpen(true); }}>
                        <Image
                            src={imageUrl}
                            alt={`Pinned Site Plan`}
                            fill
                            className="object-contain p-4 md:p-10"
                            priority
                        />
                        
                        {/* Status Bar Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-background-primary/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 pointer-events-none opacity-60">
                            <Move size={12} className="text-accent" />
                            <span className="text-[0.55rem] md:text-[0.6rem] font-bold text-white uppercase tracking-widest whitespace-nowrap">Daftar unit ada di bawah</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* FULL SCREEN LIGHTBOX (REAL ZOOM) */}
            {isLightboxOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-[10001]">
                        <X size={24} />
                    </button>
                    
                    <div className="relative w-full h-full">
                        <Image
                            src={imageUrl}
                            alt="Full Screen Site Plan"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="relative w-full mb-16 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="group relative overflow-hidden rounded-3xl border border-border-glass bg-bg-glass glass-blur p-4 md:p-8 transition-smooth hover:border-accent/40 shadow-2xl">
                {/* Header Container */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="font-display text-2xl md:text-4xl font-black tracking-[0.1em] text-accent uppercase italic">
                            SITE PLAN
                        </h3>
                    </div>
                    <div className="flex gap-1.5 md:gap-3">
                        <button
                            onClick={() => setIsPinned(!isPinned)}
                            className={`inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-3 rounded-xl text-[0.65rem] md:text-sm font-bold transition-smooth border ${
                                isPinned 
                                ? "bg-accent text-background-primary border-accent" 
                                : "bg-white/5 text-text-muted border-white/10 hover:border-accent/40 hover:text-accent font-black tracking-wider"
                            }`}
                        >
                            <Pin size={14} className={`md:w-4 md:h-4 ${isPinned ? "fill-current" : ""}`} />
                            <span className="uppercase">{isPinned ? "Lepas" : "Pin"}</span>
                        </button>
                        <button
                            onClick={() => setIsLightboxOpen(true)}
                            className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl text-accent text-[0.65rem] md:text-sm font-black uppercase tracking-wider transition-smooth"
                        >
                            <Maximize2 size={14} className="md:w-4 md:h-4" />
                            Detail
                        </button>
                    </div>
                </div>

                {/* Image Container */}
                <div
                    className="relative w-full h-[300px] md:h-[500px] transition-all duration-700 ease-in-out cursor-zoom-in overflow-hidden rounded-2xl"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <Image
                        src={imageUrl}
                        alt={`Site Plan ${propertyName}`}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        priority
                    />

                    {/* Overlay info */}
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pointer-events-none">
                        <span className="text-white/80 text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            Klik untuk Zoom Penuh
                        </span>
                    </div>
                </div>
            </div>

            {/* Teleport the sticky & lightbox overlay to the body */}
            {mounted && createPortal(stickyOverlay, document.body)}
        </div>
    );
}
