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
