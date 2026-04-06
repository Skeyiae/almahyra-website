"use client";

import { motion } from "framer-motion";
import { useMarketing } from "../context/MarketingContext";

export default function BrandIntroduction() {
    const { openMarketing } = useMarketing();

    return (
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 overflow-hidden" id="hero">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] hero-gradient opacity-30 pointer-events-none z-0 blur-[120px]" />
            
            <div className="relative z-[2] max-w-[900px]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <span className="inline-flex items-center gap-2 px-5 py-1.5 mb-8 bg-white/5 border border-white/10 rounded-full font-body text-[0.7rem] text-accent tracking-[3px] uppercase glass-blur opacity-80">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]" />
                        Developer & Project Research
                    </span>

                    <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tight leading-[1.1] mb-6 text-white uppercase">
                        Almahyra<br />
                        <span className="text-accent">Property</span>
                    </h1>

                    <div className="w-16 h-1 bg-accent/30 mx-auto mb-8 rounded-full" />

                    <p className="font-body text-base md:text-lg text-text-secondary max-w-[600px] mx-auto mb-10 font-light leading-relaxed opacity-70">
                        Menghadirkan standar baru hunian modern di Bandar Lampung melalui riset mendalam untuk investasi dan kenyamanan keluarga Anda.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="#projects" className="px-10 py-4 bg-white text-background-primary font-display font-bold rounded-full transition-all hover:scale-105 hover:shadow-2xl active:scale-95">
                            Mulai Eksplorasi
                        </a>
                        <button 
                            onClick={openMarketing}
                            className="px-10 py-4 bg-transparent border-2 border-white/20 text-white font-display font-bold rounded-full transition-all hover:bg-white/5 hover:border-white/40 cursor-pointer"
                        >
                            Hubungi Kami
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-4 text-text-muted opacity-40">
                <span className="text-[0.65rem] tracking-[4px] uppercase font-bold">Scroll to Review</span>
                <div className="w-px h-16 bg-gradient-to-b from-accent to-transparent" />
            </div>
        </section>
    );
}
