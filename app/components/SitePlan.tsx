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
    const [isZoomed, setIsZoomed] = useState(false);
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
                    <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent-glow)]" />
                            <div className="flex flex-col">
                                <span className="text-[0.7rem] md:text-[0.85rem] font-black uppercase tracking-[0.3em] text-accent leading-none mb-1">Site Plan Aktif</span>
                                <span className="text-[0.6rem] md:text-[0.7rem] text-text-muted font-bold uppercase tracking-widest leading-none">{propertyName}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsPinned(false)}
                            className="group flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-full text-rose-500 text-[10px] md:text-xs font-black transition-all hover:scale-105"
                        >
                            <X size={14} className="transition-transform group-hover:rotate-90" />
                            TUTUP PETA
                        </button>
                    </div>

                    {/* Image Panel */}
                    <div className="relative flex-1 bg-black/40 overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt={`Pinned Site Plan`}
                            fill
                            className="object-contain p-4 md:p-6"
                            priority
                        />
                        
                        {/* Status Bar Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-background-primary/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 pointer-events-none opacity-60">
                            <Move size={12} className="text-accent" />
                            <span className="text-[0.6rem] font-bold text-white uppercase tracking-widest whitespace-nowrap">Scroll daftar unit di bawah</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="relative w-full mb-16 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="group relative overflow-hidden rounded-3xl border border-border-glass bg-bg-glass glass-blur p-4 md:p-8 transition-smooth hover:border-accent/40 shadow-2xl">
                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="font-display text-3xl md:text-4xl font-black tracking-[0.1em] text-accent uppercase italic">
                            SITE PLAN
                        </h3>
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
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 md:blur-3xl rounded-full pointer-events-none opacity-30 hidden md:block" />

            {/* Teleport the sticky overlay to the body to avoid containing block issues */}
            {mounted && createPortal(stickyOverlay, document.body)}
        </div>
    );
}
