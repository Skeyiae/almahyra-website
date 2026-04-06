"use client";

import { useMarketing } from "../context/MarketingContext";

export default function MarketingButton({ className, children }: { className?: string, children: React.ReactNode }) {
    const { openMarketing } = useMarketing();
    
    return (
        <button onClick={openMarketing} className={className}>
            {children}
        </button>
    );
}
