"use client";

import { useState, useEffect, useRef } from "react";

interface Unit {
    id: string;
    propertyId: string;
    label: string | null;
    type: string;
    price: string;
    status: string;
    features: string[];
}

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
    timestamp: Date;
}

interface ChatbotProps {
    salesPhone?: string;
    salesName?: string;
    propertyName?: string;
}

export default function Chatbot({
    salesPhone = "62895610098292",
    salesName = "Almahyra Sales",
    propertyName = "Almahyra"
}: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: `Halo! Saya Asisten Virtual ${propertyName}. Ada yang bisa saya bantu hari ini?`,
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [units, setUnits] = useState<Unit[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch units from Supabase on mount
    useEffect(() => {
        fetch("/api/units")
            .then(res => res.json())
            .then(data => setUnits(data))
            .catch(err => console.error("Failed to fetch units:", err));
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");

        // Simple Bot Logic
        setTimeout(() => {
            processBotResponse(text.toLowerCase());
        }, 600);
    };

    const processBotResponse = (input: string) => {
        let response = "";
        const cleanInput = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

        // 1. Cek apakah input adalah ID Unit atau Label spesifik (misal: A-01)
        const matchedUnit = units.find(u => {
            const unitIdClean = u.id.toUpperCase().replace(/[^A-Z0-9]/g, "");
            const unitLabelClean = u.label?.toUpperCase().replace(/[^A-Z0-9]/g, "");
            return unitIdClean === cleanInput || unitLabelClean === cleanInput;
        });

        if (matchedUnit) {
            const statusEmoji = matchedUnit.status === "Available" ? "✅" : matchedUnit.status === "Booked" ? "🟡" : "🔴";
            const displayLabel = matchedUnit.label || matchedUnit.id;

            response = `Baik! Berikut adalah detail untuk unit **${displayLabel}**:\n\n` +
                `SPESIFIKASI|DETAIL\n` +
                `Unit|${displayLabel}\n` +
                `ID Sistem|${matchedUnit.id}\n` +
                `Lokasi|${matchedUnit.propertyId}\n` +
                `Tipe|${matchedUnit.type}\n` +
                `Harga|Rp ${matchedUnit.price}\n` +
                `Status|${statusEmoji} ${matchedUnit.status}\n` +
                `Fasilitas|${matchedUnit.features.join(", ")}\n\n` +
                `Apakah Anda tertarik untuk survey lokasi atau memesan unit ini? Anda bisa langsung chat Sales kami.`;
        }