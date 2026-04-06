"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MarketingContextType {
    isOpen: boolean;
    openMarketing: () => void;
    closeMarketing: () => void;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export function MarketingProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openMarketing = () => setIsOpen(true);
    const closeMarketing = () => setIsOpen(false);

    return (
        <MarketingContext.Provider value={{ isOpen, openMarketing, closeMarketing }}>
            {children}
        </MarketingContext.Provider>
    );
}

export function useMarketing() {
    const context = useContext(MarketingContext);
    if (context === undefined) {
        throw new Error("useMarketing must be used within a MarketingProvider");
    }
    return context;
}
