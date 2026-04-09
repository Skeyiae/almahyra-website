"use client";

import { motion } from "framer-motion";

interface PromoBadgeProps {
    text: string;
    subtext?: string;
}

export default function PromoBadge({ text, subtext }: PromoBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
                opacity: 1, 
                scale: [0.95, 1.05, 1],
                y: 0 
            }}
            transition={{ 
                duration: 0.6, 
                delay: 0.2,
                scale: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                    ease: "easeInOut"
                }
            }}
            className="inline-flex flex-col items-center gap-2 px-10 py-5 bg-gradient-to-br from-accent/30 to-accent-dark/20 border-2 border-accent/50 rounded-[2rem] bg-black/20 md:bg-transparent md:glass-blur md:shadow-[0_0_40px_rgba(16,185,129,0.25)] mb-10 relative overflow-hidden group"
        >
            {/* Animated Flare effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-flare pointer-events-none" />
            
            <span className="text-accent font-display font-black text-xl md:text-2xl tracking-[4px] uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                {text}
            </span>
            {subtext && (
                <span className="text-white font-body text-[0.85rem] md:text-[0.95rem] font-medium uppercase tracking-[3px] opacity-90">
                    {subtext}
                </span>
            )}
        </motion.div>
    );
}
