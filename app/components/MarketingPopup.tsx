"use client";

import { useEffect, useState } from "react";
import { useMarketing } from "../context/MarketingContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageSquare } from "lucide-react";

interface MarketingContact {
    id: number;
    name: string;
    photo: string | null;
    whatsapp: string;
    position: string | null;
}

export default function MarketingPopup() {
    const { isOpen, closeMarketing } = useMarketing();
    const [contacts, setContacts] = useState<MarketingContact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch("/api/marketing")
                .then((res) => res.json())
                .then((data) => {
                    setContacts(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch marketing contacts:", err);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeMarketing();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeMarketing]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMarketing}
                        className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-background-primary border border-border-glass rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden glass-blur"
                    >
                        {/* Header */}
                        <div className="relative p-6 text-center border-b border-border-glass bg-gradient-to-br from-accent/10 to-transparent">
                            <button
                                onClick={closeMarketing}
                                className="absolute right-4 top-4 p-2 text-text-muted hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="font-display text-2xl font-bold text-white mb-1">Hubungi Marketing</h2>
                            <p className="font-body text-sm text-text-secondary">Pilih konsultan kami untuk konsultasi unit atau survey lokasi</p>
                        </div>

                        {/* List Contacts */}
                        <div className="p-6 space-y-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                                    <p className="text-text-muted text-sm">Memuat data marketing...</p>
                                </div>
                            ) : (
                                contacts.map((contact) => (
                                    <motion.div
                                        key={contact.id}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all group"
                                    >
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent/50 transition-colors">
                                            {contact.photo ? (
                                                <img
                                                    src={contact.photo}
                                                    alt={contact.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                                                    <span className="text-accent font-bold text-xl">{contact.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#12121e] rounded-full" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-display font-semibold text-white text-base truncate">{contact.name}</h3>
                                            <p className="text-accent text-[0.75rem] font-medium uppercase tracking-wider">{contact.position || "Marketing"}</p>
                                        </div>

                                        <a
                                            href={`https://wa.me/${contact.whatsapp.startsWith('0') ? '62' + contact.whatsapp.slice(1) : contact.whatsapp}?text=Halo ${contact.name}, saya ingin tanya tentang properti Almahyra.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-10 h-10 bg-green-500 rounded-xl text-background-primary hover:bg-green-400 hover:scale-110 transition-all shadow-lg"
                                        >
                                            <Phone size={18} fill="currentColor" />
                                        </a>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-white/5 text-center">
                            <p className="text-[10px] text-text-muted uppercase tracking-[2px] font-bold">Fast Response • Senin - Minggu</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
