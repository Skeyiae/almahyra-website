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

    const activeVariant = model.variants[activeIndex];

    const handlePrev = () => {
        setActiveIndex((prev) =>
            prev === 0 ? model.variants.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prev) =>
            prev === model.variants.length - 1 ? 0 : prev + 1
        );
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
            <div className="p-8 pb-0 flex items-start justify-between gap-5">
                <div className="model-info">
                    <h3 className="font-display text-2xl font-semibold mb-1.5 text-text-primary">
                        {model.name}
                    </h3>
                    <p className="text-[0.9rem] text-text-secondary font-light">
                        {model.description}
                    </p>
                </div>
            </div>
            {/* Image Viewer */}
            <div className="relative px-8 py-6">
                <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-background-secondary">
                    {model.variants.map((variant, idx) => (
                        <Image
                            key={variant.id}
                            src={variant.image}
                            alt={`${model.name} - ${variant.label}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 1200px"
                            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${idx === activeIndex ? "opacity-100" : "opacity-0"}`}
                            priority={idx === 0}
                        />
                    ))}

                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between">
                        <span className="font-display text-[0.9rem] font-medium text-white px-4 py-1.5 bg-white/15 rounded-full backdrop-blur-md">
                            {activeVariant.label}
                        </span>
                        <span className="text-[0.8rem] text-white/60 font-normal">
                            {activeIndex + 1} / {model.variants.length}
                        </span>
                    </div>
                </div>

                {/* Navigation Arrows */}
                {model.variants.length > 1 && (
                    <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 flex justify-between pointer-events-none z-[5]">
                        <button
                            className="w-11 h-11 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center cursor-pointer pointer-events-auto transition-fast backdrop-blur-md hover:bg-[rgba(201,169,110,0.3)] hover:border-accent hover:scale-110"
                            onClick={handlePrev}
                            aria-label="Previous"
                        >
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            className="w-11 h-11 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center cursor-pointer pointer-events-auto transition-fast backdrop-blur-md hover:bg-[rgba(201,169,110,0.3)] hover:border-accent hover:scale-110"
                            onClick={handleNext}
                            aria-label="Next"
                        >
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
