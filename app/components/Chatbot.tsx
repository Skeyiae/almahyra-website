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
        // 2. Cek keyword Harga
        else if (input.includes("harga") || input.includes("price") || input.includes("biaya")) {
            // Get unique properties from units in state
            const props = Array.from(new Set(units.map(u => u.propertyId)));
            const priceList = props.map(pId => {
                const propUnits = units.filter(u => u.propertyId === pId);
                const minPrice = propUnits.length > 0 ? propUnits.sort((a, b) => parseFloat(a.price.replace(/\D/g, "")) - parseFloat(b.price.replace(/\D/g, "")))[0].price : "Hubungi Sales";
                return `${pId}|Rp ${minPrice}`;
            }).join("\n");

            response = "Tentu! Berikut adalah daftar harga terbaru dari database kami:\n\n" +
                "PROPERTI|MULAI DARI\n" +
                (priceList || "Data harga sedang diperbarui...") + "\n\n" +
                "Ketik ID unit (contoh: **A-01**) untuk melihat detail spesifikasinya.";
        }
        // 3. Cek keyword Unit Kosong
        else if (input.includes("kosong") || input.includes("stok") || input.includes("ready") || input.includes("sisa")) {
            const available = units.filter(u => u.status === "Available").slice(0, 8);
            if (available.length > 0) {
                const list = available.map(u => `${u.label || u.id}|${u.propertyId} - Tipe ${u.type}`).join("\n");
                response = "Berikut unit yang masih **TERSEDIA** saat ini:\n\n" +
                    "KAPLING|PROPERTI & TIPE\n" +
                    list + "\n\n" +
                    "Ketik nomor kapling di atas (contoh: **A-01**) untuk melihat detail lengkapnya.";
            } else {
                response = "Wah, sepertinya saat ini unit kami sedang penuh. Silakan hubungi Sales kami untuk info daftar tunggu (waitlist).";
            }
        }
        // 4. Default
        else {
            response = "Maaf, saya belum mengenali perintah itu. 🙏\n\n" +
                "Coba ketik **'Harga'**, **'Unit Kosong'**, atau langsung ketik ID unit yang ingin Anda ketahui (contoh: **A-01**).";
        }

        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: response,
            sender: "bot",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
    };

    const handleQuickAction = (action: string) => {
        handleSend(action);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-background-primary/95 border border-border-glass rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-fade-in-up glass-blur">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-accent to-accent-dark flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-background-primary font-display font-bold text-sm leading-tight">{propertyName} Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] text-background-primary/70 uppercase tracking-wider font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-background-primary/60 hover:text-background-primary transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${msg.sender === "user"
                                    ? "bg-accent text-background-primary rounded-tr-none"
                                    : "bg-white/5 border border-white/10 text-text-primary rounded-tl-none"
                                    }`}>
                                    {/* Detect if it includes table data via '|' */}
                                    {msg.text.includes("|") ? (
                                        <div className="space-y-3">
                                            {/* Extract prefix text if any */}
                                            <div className="whitespace-pre-line">{msg.text.split("\n\n")[0]}</div>

                                            {/* Render the Table/Grid */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                                {(() => {
                                                    const tableLines = msg.text.split("\n").filter(l => l.includes("|"));
                                                    const [headerLine, ...dataLines] = tableLines;
                                                    const [labelHead, valueHead] = headerLine.split("|");

                                                    return (
                                                        <>
                                                            <div className="grid grid-cols-[100px_1fr] border-b border-white/5 bg-white/5 px-3 py-2">
                                                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{labelHead}</div>
                                                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider pl-3 border-l border-white/5">{valueHead}</div>
                                                            </div>
                                                            <div className="grid grid-cols-[100px_1fr] gap-y-0 text-[12px]">
                                                                {dataLines.map((line, i) => {
                                                                    const [label, value] = line.split("|");
                                                                    return (
                                                                        <div key={i} className="contents group">
                                                                            <div className="px-3 py-2 bg-white/[0.02] text-text-secondary font-medium border-b border-white/5">{label}</div>
                                                                            <div className="px-3 py-2 text-text-primary border-l border-white/5 border-b border-white/5 group-last:border-b-0">{value}</div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>

                                            {/* Extract suffix text if any */}
                                            {msg.text.split("\n\n")[2] && (
                                                <div className="whitespace-pre-line text-text-secondary text-[13px] pt-1">
                                                    {msg.text.split("\n\n")[2]}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-line">{msg.text}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-border-glass">
                        <button onClick={() => handleQuickAction("Cek Harga")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-full text-[11px] text-text-secondary transition-all">
                            💰 Cek Harga
                        </button>
                        <button onClick={() => handleQuickAction("Unit Kosong")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-full text-[11px] text-text-secondary transition-all">
                            🏠 Unit Kosong
                        </button>
                        <button onClick={() => window.open(`https://wa.me/${salesPhone}?text=Halo ${salesName}, saya ingin tanya tentang properti ini`, '_blank')} className="whitespace-nowrap px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-full text-[11px] text-green-400 transition-all">
                            📞 Chat {salesName}
                        </button>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border-glass bg-white/5">
                        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Tulis pesan..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <button type="submit" className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-background-primary hover:bg-accent-light transition-colors shadow-[0_0_15px_var(--accent-glow-subtle)]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform ${isOpen ? "rotate-90 bg-white/10" : "bg-accent hover:scale-110"}`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7 text-background-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}

                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-background-primary animate-bounce" />
                )}
            </button>
        </div>
    );
}
