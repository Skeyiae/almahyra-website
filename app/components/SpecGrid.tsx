"use client";

import { motion } from "framer-motion";
import { FcHome, FcFlashOn, FcGrid, FcInspection, FcPrivacy, FcBiomass } from "react-icons/fc";

interface Spec {
    label: string;
    value: string;
    icon: "bed" | "bath" | "water" | "power" | "home" | "layout";
}

interface SpecGridProps {
    specs: Spec[];
}

export default function SpecGrid({ specs }: SpecGridProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "bed": return <FcHome size={22} />;
            case "bath": return <FcInspection size={22} />;
            case "water": return <FcBiomass size={22} />;
            case "power": return <FcFlashOn size={22} />;
            case "layout": return <FcGrid size={22} />;
            default: return <FcPrivacy size={22} />;
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {specs.map((spec, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-2.5 md:flex-col md:items-center md:justify-center md:p-5 rounded-xl md:rounded-2xl bg-bg-glass border border-border-glass glass-blur hover:bg-white/5 hover:border-accent/30 transition-smooth group"
                >
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 md:bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-smooth shadow-sm">
                        {getIcon(spec.icon)}
                    </div>
                    <div className="flex flex-col md:items-center">
                        <span className="text-text-primary font-display font-semibold text-[0.7rem] md:text-sm leading-tight">{spec.value}</span>
                        <span className="text-text-muted text-[0.55rem] md:text-[0.65rem] uppercase tracking-wider md:tracking-widest mt-0.5 md:mt-1 md:text-center">{spec.label}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
