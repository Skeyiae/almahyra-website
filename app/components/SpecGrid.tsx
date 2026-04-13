"use client";

import { motion } from "framer-motion";
import * as Fc from "react-icons/fc";
import * as Gi from "react-icons/gi";
import * as Hi2 from "react-icons/hi2";
import * as Md from "react-icons/md";
import * as Ci from "react-icons/ci";
import * as Ai from "react-icons/ai";
import * as Fa from "react-icons/fa";
import * as Io5 from "react-icons/io5";
import * as Lu from "react-icons/lu";
import * as Pi from "react-icons/pi";

interface Spec {
    label: string;
    value: string;
    icon: string;
}

interface SpecGridProps {
    specs: Spec[];
}

export default function SpecGrid({ specs }: SpecGridProps) {
    const getIcon = (type: string) => {
        const t = type.toLowerCase().trim();
        const AnyFc = Fc as any;
        const AnyGi = Gi as any;
        const AnyHi2 = Hi2 as any;
        const AnyMd = Md as any;
        const AnyCi = Ci as any;
        const AnyAi = Ai as any;
        const AnyFa = Fa as any;
        const AnyIo5 = Io5 as any;
        const AnyLu = Lu as any;
        const AnyPi = Pi as any;

        // Mendukung input nama icon langsung dari Supabase
        if (AnyFc[type]) { const Icon = AnyFc[type]; return <Icon size={22} />; }
        if (AnyGi[type]) { const Icon = AnyGi[type]; return <Icon size={22} />; }
        if (AnyHi2[type]) { const Icon = AnyHi2[type]; return <Icon size={22} />; }
        if (AnyMd[type]) { const Icon = AnyMd[type]; return <Icon size={22} />; }
        if (AnyCi[type]) { const Icon = AnyCi[type]; return <Icon size={22} />; }
        if (AnyAi[type]) { const Icon = AnyAi[type]; return <Icon size={22} />; }
        if (AnyFa[type]) { const Icon = AnyFa[type]; return <Icon size={22} />; }
        if (AnyIo5[type]) { const Icon = AnyIo5[type]; return <Icon size={22} />; }
        if (AnyLu[type]) { const Icon = AnyLu[type]; return <Icon size={22} />; }
        if (AnyPi[type]) { const Icon = AnyPi[type]; return <Icon size={22} />; }

        switch (t) {
            case "bed":
            case "kamar":
                return <Fa.FaBed size={22} />;
            case "bath":
            case "toilet":
                return <Lu.LuToilet size={22} />;
            case "water":
            case "sumur":
            case "air":
                return <Io5.IoWaterSharp size={22} />;
            case "power":
            case "listrik":
                return <Fc.FcFlashOn size={22} />;
            case "layout":
            case "tanah":
                return <Fc.FcGrid size={22} />;
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
            case "park":
            case "taman":
                return <Pi.PiPark size={22} />;
            default: return <Fc.FcPrivacy size={22} />;
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
