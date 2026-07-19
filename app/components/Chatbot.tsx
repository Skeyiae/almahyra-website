"use client";

import { useState, useEffect, useRef } from "react";
import { useMarketing } from "../context/MarketingContext";

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
    propertyId?: string;
}

export default function Chatbot({
    salesPhone = "62895610098292",
    salesName = "Almahyra Sales",
    propertyName = "Almahyra",
    propertyId
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
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { openMarketing } = useMarketing();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date(),
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        sender: m.sender,
                        text: m.text
                    })),
                    propertyId
                }),
            });

            const data = await response.json();

            if (response.ok && data.response) {
                // Strip markdown bold asterisks (**) for a cleaner text presentation
                const cleanText = data.response.replace(/\*\*/g, "");
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: cleanText,
                    sender: "bot",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMsg]);
            } else {
                throw new Error(data.error || "Gagal mendapatkan respons");
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Maaf, saat ini asisten AI sedang sibuk atau ada gangguan koneksi. 🙏\n\nSilakan langsung klik tombol WhatsApp di bawah untuk menghubungi marketing kami.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
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
                                    <span className="text-[10px] text-background-primary/70 uppercase tracking-wider font-medium">AI Agent Online</span>
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
                                    ? "bg-accent text-background-primary rounded-tr-none font-medium"
                                    : "bg-white/5 border border-white/10 text-text-primary rounded-tl-none font-light leading-relaxed"
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
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 text-text-primary px-4 py-3 rounded-2xl rounded-tl-none text-sm flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-border-glass">
                        <button onClick={() => handleQuickAction("Daftar Harga Unit")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-full text-[11px] text-text-secondary transition-all">
                            💰 Cek Harga
                        </button>
                        <button onClick={() => handleQuickAction("Unit Kosong yang Tersedia")} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 rounded-full text-[11px] text-text-secondary transition-all">
                            🏠 Unit Kosong
                        </button>
                        <button onClick={openMarketing} className="whitespace-nowrap px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-full text-[11px] text-green-400 transition-all font-medium">
                            📞 Hubungi Marketing
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
                                disabled={isLoading}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
                            />
                            <button type="submit" disabled={isLoading || !inputValue.trim()} className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-background-primary hover:bg-accent-light transition-colors shadow-[0_0_15px_var(--accent-glow-subtle)] disabled:opacity-50 disabled:cursor-not-allowed">
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
