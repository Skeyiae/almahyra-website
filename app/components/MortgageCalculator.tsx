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