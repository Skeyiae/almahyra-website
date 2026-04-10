"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProgressBar() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Sembunyikan loading bar saat navigasi selesai (URL berubah)
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    // Listen for custom navigation events
    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleStop = () => setIsLoading(false);

        window.addEventListener("nav-start", handleStart);
        window.addEventListener("nav-stop", handleStop);

        return () => {
            window.removeEventListener("nav-start", handleStart);
            window.removeEventListener("nav-stop", handleStop);
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ width: "0%", opacity: 0 }}
                    animate={{ width: "70%", opacity: 1 }}
                    exit={{ width: "100%", opacity: 0 }}
                    transition={{ 
                        width: { duration: 10, ease: "easeOut" },
                        opacity: { duration: 0.2 }
                    }}
                    className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent via-accent-light to-accent z-[10000] shadow-[0_0_15px_var(--accent-glow)]"
                />
            )}
        </AnimatePresence>
    );
}
