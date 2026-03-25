"use client";

import { useState } from "react";
import SpecGrid from "./SpecGrid";
import Landmarks from "./Landmarks";
import MortgageCalculator from "./MortgageCalculator";
import ModelConfigurator from "./ModelConfigurator";

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

interface PropertyInteractiveContentProps {
    propertyId: string;
    propertyName: string;
    units: Unit[];
    landmarks: any[];
    locationText: string;
    sitePlanImage: string | null;
    mapUrl: string | null;
    imagesStandard?: any;
    imagesPremium?: any;
    mortgageSchemes?: any;
}

export default function PropertyInteractiveContent({
    propertyId,
    propertyName,
    units,
    landmarks,
    locationText,
    sitePlanImage,
    mapUrl,
    imagesStandard,
    imagesPremium,
    mortgageSchemes
}: PropertyInteractiveContentProps) {
    // State untuk unit yang sedang dipilih
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(units.length > 0 ? units[0] : null);

    // Fungsi untuk update specs berdasarkan unit yang dipilih
    const specs = selectedUnit ? [
        { label: "Kamar Tidur", value: `${selectedUnit.bedrooms} Unit`, icon: "bed" as const },
        { label: "Kamar Mandi", value: `${selectedUnit.bathrooms} Unit`, icon: "bath" as const },
        { label: "Listrik", value: selectedUnit.electricity || "1300 VA", icon: "power" as const },
        { label: "Sumber Air", value: selectedUnit.waterSource || "Sumur Bor", icon: "water" as const },
        { label: "Luas Bangunan", value: `${selectedUnit.buildingArea} m²`, icon: "home" as const },
        { label: "Luas Tanah", value: `${selectedUnit.landArea} m²`, icon: "layout" as const },
    ] : [];

