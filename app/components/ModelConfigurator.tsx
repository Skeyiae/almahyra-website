"use client";

import { useState } from "react";
import Image from "next/image";
import { models } from "../data/configData";
import { Model } from "../types/config";

interface ModelCardProps {
    model: Model;
}

function ModelCard({ model }: ModelCardProps) {
    // Stage 2: Baru fokus ke layout kartu
    const activeVariant = model.variants[0];

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{model.description}</p>
            </div>

            <div className="relative aspect-[16/10] bg-gray-100">
                <Image
                    src={activeVariant.image}
                    alt={model.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Pilihan Varian
                </p>
                <div className="flex gap-2">
                    {model.variants.map((v) => (
                        <div
                            key={v.id}
                            className="w-8 h-8 rounded-full border border-gray-300 shadow-inner"
                            style={{ backgroundColor: v.color }}
                            title={v.label}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ModelConfigurator({ activePropertyId }: { activePropertyId?: string }) {
    const filteredModels = models.filter((model) => model.propertyId === activePropertyId);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Pilih Model Rumah</h2>
                <p className="text-gray-600 mt-2">Visualisasi pilihan tipe dan desain untuk Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
        </div>
    );
}
