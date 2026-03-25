"use client";

import { motion } from "framer-motion";

interface PromoBadgeProps {
    text: string;
    subtext?: string;
}

export default function PromoBadge({ text, subtext }: PromoBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex flex-col items-center gap-1 px-6 py-3 bg-gradient-to-br from-accent/20 to-accent-dark/10 border border-accent/30 rounded-2xl glass-blur shadow-[0_0_20px_rgba(201,169,110,0.1)] mb-6"
        >
            <span className="text-accent font-display font-bold text-sm tracking-[2px] uppercase">
                {text}
            </span>
            {subtext && (
                <span className="text-text-secondary font-body text-[0.7rem] uppercase tracking-wider opacity-60">
                    {subtext}
                </span>
            )}
        </motion.div>
    );
}
