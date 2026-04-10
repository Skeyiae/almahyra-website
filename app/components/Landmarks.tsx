"use client";

import { motion } from "framer-motion";
import { FcGraduationCap, FcShop, FcAutomotive, FcBusiness } from "react-icons/fc";

interface Landmark {
    label: string;
    time: string;
    type: "school" | "mall" | "transport" | "other";
}

interface LandmarksProps {
    landmarks: Landmark[];
}

export default function Landmarks({ landmarks }: LandmarksProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "school": return <FcGraduationCap size={22} />;
            case "mall": return <FcShop size={22} />;
            case "transport": return <FcAutomotive size={22} />;
            default: return <FcBusiness size={22} />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {(!landmarks || landmarks.length === 0) ? (
                <p className="text-text-muted text-sm col-span-2">Belum ada lokasi strategis yang ditambahkan.</p>
            ) : landmarks.map((landmark, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-2.5 md:p-4 rounded-lg md:rounded-xl bg-bg-glass border border-border-glass group hover:border-accent/40 transition-smooth"
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-smooth shadow-sm">
                        {getIcon(landmark.type)}
                    </div>
                    <div>
                        <h4 className="text-text-primary font-display font-bold text-sm md:text-base leading-tight">{landmark.label}</h4>
                        <p className="text-accent-light text-[0.75rem] md:text-sm font-bold mt-1">{landmark.time}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
