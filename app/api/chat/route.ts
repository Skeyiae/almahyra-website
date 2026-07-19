import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../lib/prisma";

export async function POST(request: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not configured in .env file" },
            { status: 500 }
        );
    }

    let messages: any[] = [];
    let propertyId: string | undefined = undefined;

    try {
        const body = await request.json();
        messages = body.messages;
        propertyId = body.propertyId;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request: messages array is required" },
                { status: 400 }
            );
        }

        // 1. Fetch real-time data from database to feed as context
        let dbContextText = "";
        let salesContact = { phone: "62895610098292", name: "Almahyra Sales" };

        if (propertyId) {
            const property = await prisma.property.findUnique({
                where: { id: propertyId },
                include: { units: true }
            });

            if (property) {
                salesContact = {
                    phone: property.salesPhone || salesContact.phone,
                    name: property.salesName || salesContact.name
                };

                const unitsList = property.units.map(u => 
                    `- Unit/Kapling: ${u.label || u.id}, Tipe: ${u.type}, Harga: Rp ${u.price}, Status: ${u.status}, Kamar Tidur: ${u.bedrooms}, Kamar Mandi: ${u.bathrooms}, Luas Bangunan: ${u.buildingArea}m², Luas Tanah: ${u.landArea}m², Listrik: ${u.electricity}, Air: ${u.waterSource}, Fitur: ${u.features.join(", ")}`
                ).join("\n");

                const landmarksList = Array.isArray(property.landmarks) 
                    ? (property.landmarks as any[]).map(l => `- ${l.label} (${l.time} perjalanan, kategori: ${l.type})`).join("\n")
                    : "";

                dbContextText = `
DATA PROPERTI AKTIF SAAT INI:
Nama Properti: ${property.name}
Judul: ${property.titleTop} - ${property.titleBottom}
Deskripsi: ${property.description}
Lokasi: ${property.locationText}
Promo Badge: ${property.promoBadge || "Tidak ada promo saat ini"} ${property.promoSubtext ? `(${property.promoSubtext})` : ""}
Landmarks Terdekat:
${landmarksList || "Tidak ada data landmark"}

DAFTAR UNIT YANG TERSEDIA:
${unitsList || "Tidak ada data unit di properti ini"}
`;
            }
        } else {
            // General query for all properties
            const allProperties = await prisma.property.findMany({
                include: { units: true }
            });

            dbContextText = "DATA SEMUA PROPERTI ALMAHYRA:\n";
            allProperties.forEach(p => {
                const unitsSummary = p.units.map(u => 
                    `- Kapling ${u.label || u.id} (Tipe ${u.type}, Rp ${u.price}, Status: ${u.status})`
                ).join("\n");

                dbContextText += `\n---
Nama Properti: ${p.name}
Lokasi: ${p.locationText}
Daftar Unit:
${unitsSummary || "Tidak ada data unit"}
`;
            });
        }

        // 2. Format the chat history for Gemini Multi-turn Chat
        // Gemini expects the history to start with a 'user' message, and alternate role.
        const formatted = messages.map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
        }));

        const firstUserIdx = formatted.findIndex(m => m.role === "user");

        let history: any[] = [];
        let latestText = "";

        if (firstUserIdx !== -1) {
            history = formatted.slice(firstUserIdx, -1);
            latestText = messages[messages.length - 1].text;
        } else {
            latestText = messages[messages.length - 1].text;
        }

        // 3. Define the list of models to try (primary and fallbacks)
        // Since Gemini API's free tier applies rate limits per model, falling back to 
        // older or smaller models is a highly effective way to bypass quota/rate limits.
        const modelsToTry = [
            "gemini-3.5-flash",
            "gemini-2.0-flash", 
            "gemini-flash-latest",
            "gemini-flash-lite-latest"
        ];

        let textResponse = "";
        let success = false;
        let lastError: any = null;

        for (const modelName of modelsToTry) {
            try {
                // Initialize Gemini API Client for this model
                const ai = new GoogleGenerativeAI(apiKey);
                const model = ai.getGenerativeModel({
                    model: modelName,
                    systemInstruction: `
Anda adalah Asisten Virtual (Virtual Assistant) ramah dan profesional dari Almahyra Property.
Tugas Anda adalah melayani calon pembeli rumah, memberikan informasi unit, harga, ketersediaan, simulasi angsuran, serta mengarahkan mereka untuk menghubungi marketing jika tertarik survey atau booking.

Berikut adalah data real-time properti dan unit dari database kami untuk membantu Anda menjawab pertanyaan:
${dbContextText}

Hubungi Marketing:
Nama Marketing: ${salesContact.name}
Nomor WhatsApp: ${salesContact.phone} (Format URL chat: https://wa.me/${salesContact.phone})

ATURAN MENJAWAB:
1. Jawablah menggunakan bahasa Indonesia yang sopan, ramah, persuasif, dan komunikatif.
2. Gunakan sapaan yang hangat seperti "Kak", "Bapak", atau "Ibu".
3. JIKA pengguna menanyakan tentang unit tertentu (misal: A-01), berikan spesifikasi lengkapnya secara jelas.
4. JIKA pengguna menanyakan harga atau unit kosong, Anda dapat menggunakan format tabel markdown menggunakan pemisah pipa (|) untuk baris spesifikasi/data agar chatbot merendernya dalam bentuk tabel yang rapi.
   Contoh format tabel yang dipahami chat UI:
   KAPLING|PROPERTI & TIPE
   A-01|Griya Keiko - Tipe 60/84
   A-02|Griya Keiko - Tipe 60/84
5. Di akhir jawaban, tawarkan bantuan lanjutan dan ajak mereka untuk survey lokasi atau hubungi marketing (berikan link WhatsApp dengan ramah).
6. Jawab secara ringkas dan padat karena ruang obrolan (chat window) berukuran kecil. Hindari penjelasan yang terlalu panjang lebar kecuali ditanyakan detailnya.
7. JANGAN gunakan tanda tebal markdown (seperti **teks**) atau simbol asterisk ganda (**) untuk mempertebal kata dalam jawaban Anda. Gunakan teks biasa yang bersih agar rapi.
`
                });

                // Start Chat Session and Send Message
                const chatSession = model.startChat({ history });
                const responseResult = await chatSession.sendMessage(latestText);
                textResponse = responseResult.response.text();
                success = true;
                break; // Exit the loop on success
            } catch (error: any) {
                console.warn(`[Chat API] Error using model ${modelName}:`, error.message || error);
                lastError = error;
            }
        }

        if (!success) {
            throw lastError || new Error("Semua model Gemini gagal merespons.");
        }

        return NextResponse.json({ response: textResponse });

    } catch (error: any) {
        console.error("Error in Chat API Route:", error);

        // --- EMERGENCY FALLBACK: If Gemini API fails, attempt to respond from local Database ---
        try {
            if (messages && messages.length > 0) {
                const latestText = messages[messages.length - 1].text;
                const query = latestText.toLowerCase();

                let salesContact = { phone: "62895610098292", name: "Almahyra Sales" };
                if (propertyId) {
                    const property = await prisma.property.findUnique({
                        where: { id: propertyId }
                    });
                    if (property) {
                        salesContact = {
                            phone: property.salesPhone || salesContact.phone,
                            name: property.salesName || salesContact.name
                        };
                    }
                }

                // If asking about price
                if (query.includes("harga") || query.includes("price") || query.includes("bayar") || query.includes("cicil") || query.includes("kpr")) {
                    let fallbackResponse = `Berikut adalah daftar harga unit yang tersedia saat ini:\n\n`;
                    
                    if (propertyId) {
                        const property = await prisma.property.findUnique({
                            where: { id: propertyId },
                            include: { units: true }
                        });
                        if (property && property.units.length > 0) {
                            fallbackResponse += "KAPLING|TIPE & ESTIMASI HARGA\n";
                            property.units.forEach(u => {
                                fallbackResponse += `${u.label || u.id}|Tipe ${u.type} - Rp ${u.price} (${u.status})\n`;
                            });
                            fallbackResponse += `\nUntuk info promo & simulasi cicilan KPR terlengkap, hubungi marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}).`;
                        } else {
                            fallbackResponse = `Maaf, saat ini belum ada data unit yang diinput untuk properti ini.\n\nSilakan tanyakan langsung ke marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}).`;
                        }
                    } else {
                        const allProperties = await prisma.property.findMany({
                            include: { units: true }
                        });
                        fallbackResponse += "KAPLING|PROPERTI - TIPE & HARGA\n";
                        let count = 0;
                        allProperties.forEach(p => {
                            p.units.forEach(u => {
                                fallbackResponse += `${u.label || u.id}|${p.name} (Tipe ${u.type}) - Rp ${u.price}\n`;
                                count++;
                            });
                        });
                        
                        if (count === 0) {
                            fallbackResponse = `Maaf, saat ini belum ada data unit yang tersedia.\n\nSilakan tanyakan langsung ke marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}).`;
                        } else {
                            fallbackResponse += `\nSilakan hubungi marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}) jika tertarik booking.`;
                        }
                    }

                    return NextResponse.json({ response: fallbackResponse });
                }

                // If asking about vacant / available units
                if (query.includes("kosong") || query.includes("tersedia") || query.includes("stok") || query.includes("unit") || query.includes("kapling")) {
                    let fallbackResponse = `Berikut adalah daftar unit yang masih tersedia saat ini:\n\n`;

                    if (propertyId) {
                        const property = await prisma.property.findUnique({
                            where: { id: propertyId },
                            include: { units: true }
                        });
                        if (property && property.units.length > 0) {
                            const availableUnits = property.units.filter(u => 
                                !u.status.toLowerCase().includes("sold") && 
                                !u.status.toLowerCase().includes("terjual")
                            );

                            if (availableUnits.length > 0) {
                                fallbackResponse += "KAPLING|SPESIFIKASI & STATUS\n";
                                availableUnits.forEach(u => {
                                    fallbackResponse += `${u.label || u.id}|Tipe ${u.type} (${u.bedrooms} KT / ${u.bathrooms} KM) - ${u.status}\n`;
                                });
                                fallbackResponse += `\nUntuk survey lokasi dan booking kapling sebelum kehabisan, langsung hubungi marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}).`;
                            } else {
                                fallbackResponse = `Semua unit di properti ini sudah terjual. Silakan hubungi marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}) untuk alternatif unit terdekat.`;
                            }
                        } else {
                            fallbackResponse = `Belum ada unit yang terdaftar untuk properti ini.\n\nSilakan hubungi marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}) untuk info terbaru.`;
                        }
                    } else {
                        const allProperties = await prisma.property.findMany({
                            include: { units: true }
                        });
                        fallbackResponse += "KAPLING|PROPERTI - TIPE & STATUS\n";
                        let count = 0;
                        allProperties.forEach(p => {
                            p.units.forEach(u => {
                                if (!u.status.toLowerCase().includes("sold") && !u.status.toLowerCase().includes("terjual")) {
                                    fallbackResponse += `${u.label || u.id}|${p.name} (Tipe ${u.type}) - ${u.status}\n`;
                                    count++;
                                }
                            });
                        });

                        if (count === 0) {
                            fallbackResponse = `Maaf, saat ini seluruh unit sudah terjual/terisi.\n\nHubungi marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}) untuk info unit baru.`;
                        } else {
                            fallbackResponse += `\nHubungi marketing kami **${salesContact.name}** via [WhatsApp](https://wa.me/${salesContact.phone}) untuk konfirmasi ketersediaan unit terbaru.`;
                        }
                    }

                    return NextResponse.json({ response: fallbackResponse });
                }
            }
        } catch (fallbackError) {
            console.error("Emergency DB fallback failed:", fallbackError);
        }

        return NextResponse.json(
            { error: error.message || "Failed to process chat session" },
            { status: 500 }
        );
    }
}
