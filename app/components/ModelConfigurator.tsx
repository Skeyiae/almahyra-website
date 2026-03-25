"use client";

import { useState } from "react";
import Image from "next/image";
import { models } from "../data/configData";
import { Model } from "../types/config";

interface ModelConfiguratorProps {
    activePropertyId: string;
    propertyName: string;
    units: any[];
    onUnitSelect: (unit: any) => void;
    selectedUnitId?: string;
    imagesStandard?: any;
    imagesPremium?: any;
    sitePlanImage: string;
}

export default function ModelConfigurator({
    activePropertyId,
    propertyName,
    units,
    onUnitSelect,
    selectedUnitId,
    imagesStandard,
    imagesPremium,
    sitePlanImage
}: ModelConfiguratorProps) {
    const filteredModels = models.filter((model) => model.propertyId === activePropertyId);
    const [activeTab, setActiveTab] = useState<"siteplan" | "models">("siteplan");

    return (
        <div className="space-y-12">
            {/* Tabs Selection */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setActiveTab("siteplan")}
                    className={`px-8 py-3 rounded-full font-display font-bold text-sm transition-all ${activeTab === "siteplan"
                        ? "bg-accent text-background-primary shadow-lg shadow-accent/20"
                        : "bg-white/5 text-text-muted border border-white/10 hover:bg-white/10"
                        }`}
                >
                    Site Plan & Unit
                </button>
                <button
                    onClick={() => setActiveTab("models")}
                    className={`px-8 py-3 rounded-full font-display font-bold text-sm transition-all ${activeTab === "models"
                        ? "bg-accent text-background-primary shadow-lg shadow-accent/20"
                        : "bg-white/5 text-text-muted border border-white/10 hover:bg-white/10"
                        }`}
                >
                    Tipe & Denah
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left side: Preview Section */}
                <div className="lg:col-span-8 space-y-8">
                    {activeTab === "siteplan" ? (
                        <div className="relative aspect-[16/10] bg-white/5 rounded-3xl overflow-hidden border border-border-glass group">
                            <Image
                                src={sitePlanImage}
                                alt="Site Plan"
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-background-primary/80 glass-blur border border-white/10 text-[0.6rem] font-bold uppercase tracking-widest text-accent">
                                Peta Lokasi Unit
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredModels.map((model) => (
                                <div key={model.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border-glass group">
                                    <Image
                                        src={model.variants[0].image}
                                        alt={model.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-background-primary to-transparent">
                                        <h4 className="text-white font-display font-bold">{model.name}</h4>
                                        <p className="text-text-muted text-xs mt-1">{model.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right side: Unit Selection List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-8 rounded-3xl bg-white/5 border border-border-glass glass-blur">
                        <h3 className="text-xl font-display font-bold text-white mb-6">Daftar Unit Tersedia</h3>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                            {units.map((unit) => (
                                <button
                                    key={unit.id}
                                    onClick={() => onUnitSelect(unit)}
                                    className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all ${selectedUnitId === unit.id
                                        ? "bg-accent/10 border-accent/50 shadow-[0_0_20px_rgba(201,169,110,0.1)]"
                                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                        }`}
                                >
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-base font-display font-bold ${selectedUnitId === unit.id ? "text-accent" : "text-white"}`}>
                                                {unit.label || unit.id}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${unit.status === "Available"
                                                ? "border-green-500/30 text-green-400 bg-green-500/5"
                                                : "border-red-500/30 text-red-400 bg-red-500/5"
                                                }`}>
                                                {unit.status}
                                            </span>
                                        </div>
                                        <div className="text-[0.65rem] text-text-muted font-medium mt-1 uppercase tracking-wider">
                                            Tipe {unit.type} • Rp {unit.price}
                                        </div>
                                    </div>
                                    {selectedUnitId === unit.id && (
                                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-background-primary">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20">
                        <p className="text-[0.7rem] text-accent-light leading-relaxed">
                            <strong>Tips:</strong> Klik nomor kapling di atas untuk melihat simulasi angsuran yang sesuai dengan harga unit tersebut.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
