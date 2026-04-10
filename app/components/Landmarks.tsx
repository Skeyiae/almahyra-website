"use client";

import { motion } from "framer-motion";
import * as Fc from "react-icons/fc";
import * as Gi from "react-icons/gi";
import * as Hi2 from "react-icons/hi2";
import * as Md from "react-icons/md";

interface Landmark {
    label: string;
    time: string;
    type: string;
}

interface LandmarksProps {
    landmarks: Landmark[];
}

export default function Landmarks({ landmarks }: LandmarksProps) {
    const getIcon = (type: string) => {
        const t = type.toLowerCase().trim();
        
        // Dynamic icon lookup from supported sets
        const AnyFc = Fc as any;
        const AnyGi = Gi as any;
        const AnyHi2 = Hi2 as any;
        const AnyMd = Md as any;

        if (AnyFc[type]) return <AnyFc[type] size={22} />;
        if (AnyGi[type]) return <AnyGi[type] size={22} />;
        if (AnyHi2[type]) return <AnyHi2[type] size={22} />;
        if (AnyMd[type]) return <AnyMd[type] size={22} />;

        switch (t) {
            case "school": 
            case "sekolah":
            case "education":
                return <Fc.FcGraduationCap size={22} />;
            case "mall": 
            case "perbelanjaan":
            case "store":
                return <Fc.FcShop size={22} />;
            case "transport": 
            case "perjalanan":
            case "akses":
                return <Fc.FcAutomotive size={22} />;
            case "hospital":
            case "kesehatan":
            case "medical":
                return <Fc.FcBusiness size={22} />;
            default: return <Fc.FcBusiness size={22} />;
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
