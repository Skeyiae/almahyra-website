"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, CreditCard, Landmark, Table, ChevronDown } from "lucide-react";
import { BANK_SCHEMES, BASE_PRICE_KEIKO } from "../data/mortgageData.ts";

interface MortgageCalculatorProps {
    price: number;
    propertyId?: string;
    dbSchemes?: any;
}

export default function MortgageCalculator({
    price,
    propertyId,
    dbSchemes
}: MortgageCalculatorProps) {
    const isKeiko = propertyId === "griya-keiko";

    // Normalize and prefer DB schemes if valid
    const activeSchemes = useMemo(() => {
        if (dbSchemes && Array.isArray(dbSchemes) && dbSchemes.length > 0) {
            return dbSchemes;
        }
        return BANK_SCHEMES;
    }, [dbSchemes]);

    // --- State for Advanced mode (Keiko) ---
    const [selectedBankId, setSelectedBankId] = useState(activeSchemes[0]?.id || "bni");
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const [showTable, setShowTable] = useState(false);

    // --- State for Standard mode (Non-Keiko) ---
    const [tenor, setTenor] = useState(15);
    const initialInterest = 5; // Default interest rate for standard fallback

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(val);
    };

    // --- Advanced Calculations ---
    const selectedBank = useMemo(() =>
        activeSchemes.find((b: any) => b.id === selectedBankId) || activeSchemes[0]
        , [selectedBankId, activeSchemes]);

    const selectedOption = useMemo(() =>
        selectedBank?.options[selectedOptionIndex] || selectedBank?.options[0]
        , [selectedBank, selectedOptionIndex]);

    const scalingFactor = useMemo(() => price / BASE_PRICE_KEIKO, [price]);

    // --- Standard Calculations ---
    const standardMonthlyPayment = useMemo(() => {
        const monthlyInterest = (initialInterest / 100) / 12;
        const numberOfPayments = tenor * 12;
        const loanAmount = price;

        if (monthlyInterest === 0) return Math.round(loanAmount / numberOfPayments);

        const payment = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) /
            (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);

        return isNaN(payment) ? 0 : Math.round(payment);
    }, [price, tenor]);

    // --- Render Advanced Calculator (Keiko) ---
    if (isKeiko) {
        return (
            <div className="p-8 pb-10 rounded-3xl bg-gradient-to-br from-bg-glass to-background-secondary border border-border-glass glass-blur shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                            <Landmark size={22} />
                        </div>
                        <h3 className="font-display text-xl font-bold text-text-primary">Simulasi Angsuran 0% DP</h3>
                    </div>

                    <div className="space-y-8">
                        {/* Bank Selection */}
                        <div className="space-y-3">
                            <label className="text-text-secondary text-[0.75rem] font-bold uppercase tracking-wider block">Pilih Bank</label>
                            <div className="grid grid-cols-2 gap-2">
                                {activeSchemes.map((bank: any) => (
                                    <button
                                        key={bank.id}
                                        onClick={() => {
                                            setSelectedBankId(bank.id);
                                            setSelectedOptionIndex(0);
                                        }}
                                        className={`px-4 py-3 rounded-xl border text-xs font-display font-medium transition-all ${selectedBankId === bank.id
                                            ? "bg-accent text-background-primary border-accent shadow-lg shadow-accent/20"
                                            : "bg-white/5 text-text-secondary border-white/10 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        {bank.name.replace("Bank ", "")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Option Selection */}
                        {selectedBank.options.length > 1 && (
                            <div className="space-y-3">
                                <label className="text-text-secondary text-[0.75rem] font-bold uppercase tracking-wider block">Skema Pembayaran</label>
                                <div className="flex gap-2">
                                    {selectedBank.options.map((opt: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedOptionIndex(idx)}
                                            className={`flex-1 px-4 py-2.5 rounded-lg border text-[0.65rem] font-bold uppercase transition-all ${selectedOptionIndex === idx
                                                ? "bg-white/20 text-white border-white/30"
                                                : "bg-transparent text-text-muted border-white/10 hover:bg-white/5"
                                                }`}
                                        >
                                            {opt.label.split(" (")[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}