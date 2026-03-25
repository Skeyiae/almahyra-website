"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, CreditCard, Landmark, Table, ChevronDown } from "lucide-react";
import { BANK_SCHEMES, BASE_PRICE_KEIKO } from "../data/mortgageData";

interface MortgageCalculatorProps {
    price: number;
    propertyId?: string;
    dbSchemes?: any;
}