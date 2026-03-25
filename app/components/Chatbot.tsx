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