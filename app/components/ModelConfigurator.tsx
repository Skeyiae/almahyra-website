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