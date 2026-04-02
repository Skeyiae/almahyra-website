"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Property {
    id: string;
    name: string;
    description: string | null;
    imagesStandard: any; // Simplified for parsing
}

interface PropertySliderProps {
    properties: Property[];
}

export default function PropertySlider({ properties }: PropertySliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-slide effect
    useEffect(() => {
        if (!isHovered) {
            const timer = setInterval(() => {
                paginate(1);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [currentIndex, isHovered]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + properties.length) % properties.length);
    };

    const activeProperty = properties[currentIndex];
    
    // Parse images from JSON string if necessary
    const parseImages = (imgData: any) => {
        try {
            if (typeof imgData === 'string') return JSON.parse(imgData);
            return imgData || [];
        } catch (e) {
            return [];
        }
    };

    const images = parseImages(activeProperty.imagesStandard);
    const displayImage = images[0]?.url || "/property-placeholder.jpg";

    return (
        <section className="relative w-full py-20 overflow-hidden bg-background-primary">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    
                    {/* Left Side: Content */}
                    <div className="w-full lg:w-2/5 z-20 order-2 lg:order-1">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeProperty.id}
                                custom={direction}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <span className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-bold tracking-[2px] uppercase">
                                    Featured Project
                                </span>
                                <div className="flex items-center gap-1 text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                    <span className="text-white/60 text-xs ml-2 font-medium">4.9 (120+ Reviews)</span>
                                </div>
                                <h2 className="font-display text-4xl lg:text-6xl font-black text-white leading-tight">
                                    {activeProperty.name}
                                </h2>
                                <p className="text-text-secondary font-light leading-relaxed max-w-md">
                                    {activeProperty.description?.substring(0, 150)}...
                                </p>
                                <div className="pt-4 flex items-center gap-6">
                                    <Link 
                                        href={`/${activeProperty.id}`}
                                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-light text-background-primary font-display font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
                                    >
                                        Review Detail
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                    
                                    {/* Pagination Dots */}
                                    <div className="flex gap-2">
                                        {properties.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setDirection(idx > currentIndex ? 1 : -1);
                                                    setCurrentIndex(idx);
                                                }}
                                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                                    idx === currentIndex ? "bg-accent w-8" : "bg-white/20 hover:bg-white/40"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Slider Box */}
                    <div 
                        className="w-full lg:w-3/5 relative h-[400px] lg:h-[600px] order-1 lg:order-2"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="absolute inset-0 bg-accent/5 rounded-[2.5rem] blur-3xl z-0" />
                        
                        <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] border border-white/10 glass-blur shadow-2xl z-10 group">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={activeProperty.id}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.4 },
                                        scale: { duration: 0.6 }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <Image 
                                        src={displayImage} 
                                        alt={activeProperty.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            <button 
                                onClick={() => paginate(-1)}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-accent border border-white/20 text-white hover:text-background-primary glass-blur transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 z-30"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => paginate(1)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-accent border border-white/20 text-white hover:text-background-primary glass-blur transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 z-30"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Background numbers for aesthetic */}
                        <div className="absolute -bottom-10 -right-10 text-[120px] font-display font-black text-white/5 pointer-events-none select-none italic -rotate-12">
                            {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
