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
