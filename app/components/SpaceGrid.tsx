"use client";

import { motion } from "framer-motion";
import { Bed, Bath, Droplets, Zap, Home, Layout } from "lucide-react";

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
            case "bed": return <Bed size={20} />;
            case "bath": return <Bath size={20} />;
            case "water": return <Droplets size={20} />;
            case "power": return <Zap size={20} />;
            case "layout": return <Layout size={20} />;
            default: return <Home size={20} />;
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {specs.map((spec, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-bg-glass border border-border-glass glass-blur hover:bg-white/5 hover:border-accent/30 transition-smooth group text-center"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3 group-hover:scale-110 transition-smooth">
                        {getIcon(spec.icon)}
                    </div>
                    <span className="text-text-primary font-display font-semibold text-sm">{spec.value}</span>
                    <span className="text-text-muted text-[0.65rem] uppercase tracking-widest mt-1">{spec.label}</span>
                </motion.div>
            ))}
        </div>
    );
}
