"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, CreditCard, Landmark, Table, ChevronDown } from "lucide-react";
import { BANK_SCHEMES, BASE_PRICE_KEIKO } from "../data/mortgageData";

interface MortgageCalculatorProps {
    price: number;
    propertyId?: string;
    dbSchemes?: any;
    dpAmount?: number;
    bookingAmount?: number;
}

export default function MortgageCalculator({
    price,
    propertyId,
    dbSchemes,
    dpAmount = 0,
    bookingAmount = 2000000
}: MortgageCalculatorProps) {
    const isKeiko = propertyId === "griya-keiko";

    // Normalize and prefer DB schemes if valid
    const activeSchemes = useMemo(() => {
        let schemes = BANK_SCHEMES;
        if (dbSchemes && Array.isArray(dbSchemes) && dbSchemes.length > 0) {
            // Defensive: Flatten if nested like [[{...}]]
            if (Array.isArray(dbSchemes[0])) {
                schemes = dbSchemes.flat();
            } else {
                schemes = dbSchemes;
            }
        }
        return schemes;
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
        activeSchemes.find((b: any) => b?.id === selectedBankId) || activeSchemes[0]
        , [selectedBankId, activeSchemes]);

    const selectedOption = useMemo(() =>
        selectedBank?.options?.[selectedOptionIndex] || selectedBank?.options?.[0]
        , [selectedBank, selectedOptionIndex]);

    const loanAmountForScaling = useMemo(() => price - dpAmount, [price, dpAmount]);
    const scalingFactor = useMemo(() => {
        if (selectedBank?.isSubsidi) return 1;
        return loanAmountForScaling / BASE_PRICE_KEIKO;
    }, [loanAmountForScaling, selectedBank]);

    // --- Standard Calculations ---
    const standardMonthlyPayment = useMemo(() => {
        const monthlyInterest = (initialInterest / 100) / 12;
        const numberOfPayments = tenor * 12;
        const loanAmount = price - dpAmount;

        if (monthlyInterest === 0) return Math.round(loanAmount / numberOfPayments);

        const payment = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) /
            (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);

        return isNaN(payment) ? 0 : Math.round(payment);
    }, [price, tenor, dpAmount]);

    // --- Render Advanced Calculator ---
    // Gunakan tampilan advanced jika properti adalah Keiko ATAU memiliki skema bank di database
    const showAdvanced = isKeiko || (dbSchemes && Array.isArray(dbSchemes) && dbSchemes.length > 0);

    if (showAdvanced) {
        return (
            <div className="p-5 md:p-8 md:pb-10 rounded-2xl md:rounded-3xl bg-gradient-to-br from-bg-glass to-background-secondary border border-border-glass glass-blur shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                            <Landmark size={18} className="md:w-[22px] md:h-[22px]" />
                        </div>
                        <h3 className="font-display text-lg md:text-xl font-bold text-text-primary">
                            Simulasi Angsuran {dpAmount > 0 ? `(DP ${dpAmount / 1000000} Juta)` : "0% DP"}
                        </h3>
                    </div>

                    {/* DP & Booking Summary */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-[0.75rem] text-text-secondary uppercase font-bold mb-1">Uang Muka (DP)</div>
                            <div className="text-base font-display font-bold text-white">{formatCurrency(dpAmount)}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-[0.75rem] text-text-secondary uppercase font-bold mb-1">Booking Fee</div>
                            <div className="text-base font-display font-bold text-accent">{formatCurrency(bookingAmount)}</div>
                        </div>
                    </div>

                    <div className="space-y-6 md:space-y-8">
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
                        {selectedBank?.options && selectedBank.options.length > 1 && (
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
                                            {opt.label?.split(" (")[0] || "Opsi"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Main Pricing Insight */}
                        <div className="p-4 md:p-6 rounded-2xl bg-white/5 border border-border-glass relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <CreditCard size={32} className="md:w-[40px] md:h-[40px]" />
                            </div>

                            <div className="flex items-center gap-2 text-text-primary text-[0.8rem] uppercase tracking-widest mb-3 md:mb-4 font-bold">
                                Estimasi Angsuran ({selectedOption?.periods?.[0]?.label || "Periode"})
                            </div>

                            <div className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                                {formatCurrency(Math.round((selectedOption?.periods?.[0]?.monthlyPayment || 0) * scalingFactor))}
                                <span className="text-[0.4em] font-medium text-text-secondary ml-1 md:ml-2">/bulan*</span>
                            </div>

                            <button
                                onClick={() => setShowTable(!showTable)}
                                className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-[0.65rem] font-bold uppercase tracking-widest hover:bg-accent/20 transition-all"
                            >
                                {showTable ? "Tutup Rincian" : "Lihat Tabel Angsuran"}
                                <ChevronDown className={`transition-transform duration-300 ${showTable ? "rotate-180" : ""}`} size={14} />
                            </button>
                        </div>

                        {/* Breakdown Table */}
                        <AnimatePresence>
                            {showTable && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 p-5 rounded-2xl bg-black/30 border border-white/5">
                                        <div className="flex items-center gap-2 mb-4 text-[0.7rem] font-bold text-text-secondary uppercase">
                                            <Table size={14} />
                                            Rincian {selectedBank?.name || "Bank"}
                                        </div>
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="py-2 text-[0.65rem] text-text-muted uppercase font-bold">Periode</th>
                                                    <th className="py-2 text-[0.65rem] text-text-muted uppercase font-bold text-right">Angsuran</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.05]">
                                                {selectedOption?.periods?.map((period: any, idx: number) => (
                                                    <tr key={idx} className="group">
                                                        <td className="py-3 text-sm text-text-secondary font-medium">{period.label}</td>
                                                        <td className="py-3 text-sm text-white font-bold text-right">
                                                            {formatCurrency(Math.round((period.monthlyPayment || 0) * scalingFactor))}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-[0.75rem] text-text-secondary italic font-medium leading-relaxed mt-4">
                            *Estimasi angsuran dihitung berdasarkan harga {formatCurrency(price)} {dpAmount > 0 ? `dikurangi DP ${formatCurrency(dpAmount)}` : "tanpa DP"}.
                            Angka di atas bersifat simulasi dan dapat berubah sesuai kebijakan bank.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // --- Render Standard Calculator (Fallback) ---
    return (
        <div className="p-5 md:p-8 md:pb-10 rounded-2xl md:rounded-3xl bg-gradient-to-br from-bg-glass to-background-secondary border border-border-glass glass-blur shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                        <Calculator size={18} className="md:w-[22px] md:h-[22px]" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-text-primary">
                        Simulasi Angsuran {dpAmount > 0 ? `(DP ${dpAmount / 1000000} Juta)` : ""}
                    </h3>
                </div>

                <div className="space-y-8 md:space-y-10">
                    <div>
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                            <label className="text-text-primary text-sm md:text-base font-bold">Jangka Waktu (Tenor)</label>
                            <span className="text-accent font-black text-lg md:text-2xl">{tenor} Tahun</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="25"
                            step="5"
                            value={tenor}
                            onChange={(e) => setTenor(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <div className="flex justify-between text-[0.75rem] md:text-[0.85rem] text-text-secondary mt-2 md:mt-3 font-bold uppercase tracking-tighter">
                            <span>5 Thn</span>
                            <span>15 Thn</span>
                            <span>25 Thn</span>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 rounded-2xl bg-white/5 border border-border-glass relative group overflow-hidden text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-text-primary text-[0.8rem] uppercase tracking-widest mb-3 font-bold">
                            <CreditCard size={14} />
                            Estimasi Angsuran
                        </div>
                        <div className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                            {formatCurrency(standardMonthlyPayment)}
                            <span className="text-[0.4em] font-medium text-text-secondary ml-1 md:ml-2">/bulan*</span>
                        </div>
                        <p className="text-[0.75rem] text-text-secondary mt-4 italic font-medium leading-relaxed">
                            *Estimasi berdasarkan suku bunga {initialInterest}% per tahun. Perhitungan ini bersifat simulasi {dpAmount > 0 ? `DP ${formatCurrency(dpAmount)}` : "0% DP"}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
