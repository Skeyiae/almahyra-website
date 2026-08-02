"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  updatePropertyImage, 
  resetPropertyImage, 
  uploadWatermarkedToCloudinary 
} from "../lib/pcdActions";
import { 
  Lock, 
  Check, 
  RotateCcw, 
  Save, 
  Image as ImageIcon, 
  FileText, 
  Eye, 
  Layers, 
  ArrowLeft,
  Loader2,
  Sparkles,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

interface PropertyImage {
  label: string;
  url: string;
  originalUrl?: string;
}

interface Property {
  id: string;
  name: string;
  imagesStandard: any; // JSON string or array
  imagesPremium: any;  // JSON string or array
}

interface PcdDashboardProps {
  properties: Property[];
}

export default function PcdDashboard({ properties }: PcdDashboardProps) {
  // --- STATE PROTEKSI PIN ---
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  // --- STATE UTAMA ---
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || "");
  const [isPremiumType, setIsPremiumType] = useState<boolean>(false);
  const [selectedImageLabel, setSelectedImageLabel] = useState<string>("");
  
  // --- STATE WATERMARK ---
  const [watermarkText, setWatermarkText] = useState("MILIK ALMAHYRA - DEMO PCD");
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right"); // top-left, top-right, center, bottom-left, bottom-right, tile
  const [watermarkColor, setWatermarkColor] = useState("#ffffff"); // #ffffff, #000000, #10b981 (emerald), #c9a96e (gold)
  const [watermarkOpacity, setWatermarkOpacity] = useState("0.5");
  const [watermarkFontSize, setWatermarkFontSize] = useState(24);

  // --- STATE PROSESING & NOTIFIKASI ---
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- CEK PIN DARI SESSION STORAGE ---
  useEffect(() => {
    const savedUnlock = sessionStorage.getItem("pcd_unlocked");
    if (savedUnlock === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "pcd2026") {
      setIsUnlocked(true);
      setPinError(false);
      sessionStorage.setItem("pcd_unlocked", "true");
    } else {
      setPinError(true);
      setPin("");
    }
  };

  // --- AMBIL PROPERTY YANG SEDANG AKTIF ---
  const activeProperty = properties.find((p) => p.id === selectedPropertyId);

  // Ambil list images berdasarkan tipe (Standard/Premium)
  const getImagesList = (): PropertyImage[] => {
    if (!activeProperty) return [];
    const rawImages = isPremiumType ? activeProperty.imagesPremium : activeProperty.imagesStandard;
    if (!rawImages) return [];
    if (typeof rawImages === "string") {
      try {
        return JSON.parse(rawImages);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(rawImages) ? rawImages : [];
  };

  const imagesList = getImagesList();

  // Set default image label saat properti atau tipe berubah
  useEffect(() => {
    if (imagesList.length > 0) {
      // Cari label yang cocok atau pakai yang pertama
      const found = imagesList.find(img => img.label === selectedImageLabel);
      if (!found) {
        setSelectedImageLabel(imagesList[0].label);
      }
    } else {
      setSelectedImageLabel("");
    }
  }, [selectedPropertyId, isPremiumType, imagesList]);

  // Ambil data gambar aktif yang sedang dipilih
  const activeImage = imagesList.find((img) => img.label === selectedImageLabel);

  // --- RENDER CANVAS JIKA SETTING BERUBAH ---
  useEffect(() => {
    if (!isUnlocked || !activeImage?.url) return;
    
    let isMounted = true;
    setIsLoadingImage(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bersihkan canvas dan tulis loading
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Memuat gambar dari Cloudinary...", canvas.width / 2, canvas.height / 2);

    const img = new Image();
    img.crossOrigin = "anonymous"; // Penting agar canvas tidak tainted saat toDataURL
    img.src = activeImage.url;
    
    img.onload = () => {
      if (!isMounted) return;
      setIsLoadingImage(false);

      // Set backing store sesuai resolusi asli gambar
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 800;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw Watermark
      ctx.save();
      ctx.fillStyle = watermarkColor;
      ctx.globalAlpha = parseFloat(watermarkOpacity);
      
      // Hitung skala font agar pas dengan resolusi canvas
      const scaleFactor = canvas.width / 800; 
      const scaledFontSize = Math.round(watermarkFontSize * scaleFactor);
      
      ctx.font = `bold ${scaledFontSize}px 'Outfit', 'Inter', sans-serif`;
      ctx.textBaseline = "middle";

      const text = watermarkText || "ALMAHYRA PROPERTY";
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = scaledFontSize;
      const padding = 24 * scaleFactor;

      if (watermarkPosition === "tile") {
        // Mode Ubin (PCD Grid Pattern)
        ctx.rotate(-Math.PI / 6); // Putar 30 derajat
        ctx.font = `${scaledFontSize * 0.8}px 'Outfit', 'Inter', sans-serif`;
        
        const stepX = textWidth * 1.5;
        const stepY = textHeight * 3.5;

        // Gambar pola grid watermark
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
            ctx.fillText(text, x, y);
          }
        }
      } else {
        // Mode Sudut Dinamis
        let x = padding;
        let y = padding;

        switch (watermarkPosition) {
          case "top-left":
            x = padding;
            y = padding + textHeight / 2;
            ctx.textAlign = "left";
            break;
          case "top-right":
            x = canvas.width - padding;
            y = padding + textHeight / 2;
            ctx.textAlign = "right";
            break;
          case "center":
            x = canvas.width / 2;
            y = canvas.height / 2;
            ctx.textAlign = "center";
            break;
          case "bottom-left":
            x = padding;
            y = canvas.height - padding - textHeight / 2;
            ctx.textAlign = "left";
            break;
          case "bottom-right":
          default:
            x = canvas.width - padding;
            y = canvas.height - padding - textHeight / 2;
            ctx.textAlign = "right";
            break;
        }
        ctx.fillText(text, x, y);
      }
      ctx.restore();
    };

    img.onerror = () => {
      if (!isMounted) return;
      setIsLoadingImage(false);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#7f1d1d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f87171";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Gagal memuat gambar. Cek koneksi Anda.", canvas.width / 2, canvas.height / 2);
    };

    return () => {
      isMounted = false;
    };
  }, [isUnlocked, activeImage, watermarkText, watermarkPosition, watermarkColor, watermarkOpacity, watermarkFontSize]);

  // --- AKSI: TERAPKAN KE WEBSITE (CLOUD & DB) ---
  const handleApplyToWebsite = async () => {
    if (!canvasRef.current || !activeProperty || !activeImage) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // 1. Ekstrak gambar dari Canvas sebagai Base64
      const base64Image = canvasRef.current.toDataURL("image/jpeg", 0.9);

      // 2. Upload ke Cloudinary lewat Server Action
      setMessage({ type: "success", text: "Mengunggah hasil ke Cloudinary..." });
      const newCloudinaryUrl = await uploadWatermarkedToCloudinary(
        base64Image,
        activeProperty.id,
        activeImage.label
      );

      // 3. Simpan URL Cloudinary baru ke database Supabase
      setMessage({ type: "success", text: "Menyimpan ke database Supabase..." });
      await updatePropertyImage(
        activeProperty.id,
        activeImage.label,
        isPremiumType,
        newCloudinaryUrl
      );

      setMessage({ type: "success", text: "Watermark BERHASIL diterapkan ke website secara real-time!" });
      
      // Update state local agar langsung sinkron tanpa refresh penuh
      activeImage.url = newCloudinaryUrl;
      activeImage.originalUrl = activeImage.originalUrl || activeImage.url;
    } catch (error: any) {
      console.error(error);
      setMessage({ type: "error", text: error.message || "Gagal menerapkan watermark" });
    } finally {
      setIsSaving(false);
    }
  };

  // --- AKSI: RESET KE FOTO ASLI ---
  const handleResetToOriginal = async () => {
    if (!activeProperty || !activeImage) return;

    if (!confirm("Apakah Anda yakin ingin mengembalikan foto ini ke kondisi asli tanpa watermark?")) {
      return;
    }

    setIsResetting(true);
    setMessage(null);

    try {
      setMessage({ type: "success", text: "Mereset data di database Supabase..." });
      await resetPropertyImage(activeProperty.id, activeImage.label, isPremiumType);
      
      setMessage({ type: "success", text: "Foto berhasil dikembalikan ke kondisi asli!" });
      
      // Kembalikan URL lokal ke originalUrl cadangan jika ada
      if (activeImage.originalUrl) {
        activeImage.url = activeImage.originalUrl;
      }
    } catch (error: any) {
      console.error(error);
      setMessage({ type: "error", text: error.message || "Gagal mereset foto" });
    } finally {
      setIsResetting(false);
    }
  };

  // --- TAMPILAN 1: LAYAR KUNCI PIN ---
  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Glow BG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[24px] p-8 glass-blur relative z-10 text-center">
          <div className="w-16 h-16 bg-accent/20 text-accent border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-2">Akses Terkunci</h1>
          <p className="text-text-muted text-sm mb-6">
            Dasbor pengeditan watermark dilindungi PIN. Silakan masukkan PIN Admin untuk melanjutkan.
          </p>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Masukkan PIN Admin (pcd2026)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-full text-center text-white text-lg tracking-[6px] placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
              {pinError && (
                <p className="text-red-400 text-xs mt-2 font-medium">PIN yang Anda masukkan salah. Coba lagi!</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-accent to-accent-dark text-black font-display font-bold text-sm rounded-full transition-all hover:scale-[1.02] cursor-pointer"
            >
              Masuk Dasbor
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Home Website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- TAMPILAN 2: DASBOR UTAMA ---
  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 md:p-8">
      {/* Top Header */}
      <header className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 bg-accent/20 border border-accent/20 rounded text-[0.7rem] text-accent font-semibold tracking-wider uppercase">
              Proyek PCD 2026
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-text-muted">Supabase & Cloudinary Sinkron</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight text-gradient">
            ALMAHYRA PHOTO WATERMARKER
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-display text-xs font-semibold tracking-wider uppercase flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Lihat Live Website
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("pcd_unlocked");
              setIsUnlocked(false);
              setPin("");
            }}
            className="px-5 py-2.5 bg-red-950/40 border border-red-900/30 hover:bg-red-950/80 rounded-full font-display text-xs font-semibold tracking-wider text-red-400 uppercase flex items-center gap-2 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" /> Kunci Dasbor
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: PANEL KONTROL (4/12) */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* Box 1: Pilihan Citra */}
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 glass-blur">
            <h2 className="font-display text-md font-bold flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <ImageIcon className="w-4 h-4 text-accent" /> 1. Pilih Gambar Properti
            </h2>

            <div className="space-y-4">
              {/* Dropdown Properti */}
              <div>
                <label className="block text-xs text-text-muted font-medium mb-1.5 uppercase">Perumahan / Proyek</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-accent text-sm transition-colors text-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#020617]">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipe Unit (Standard/Premium) */}
              <div>
                <label className="block text-xs text-text-muted font-medium mb-1.5 uppercase">Kategori Tipe Unit</label>
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 border border-white/10 rounded-xl">
                  <button
                    onClick={() => setIsPremiumType(false)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      !isPremiumType 
                        ? "bg-accent text-black shadow" 
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    Standard (Tipe 60)
                  </button>
                  <button
                    onClick={() => setIsPremiumType(true)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isPremiumType 
                        ? "bg-accent text-black shadow" 
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    Premium (Tipe 70)
                  </button>
                </div>
              </div>

              {/* Pilihan Foto Aktif */}
              {imagesList.length > 0 ? (
                <div>
                  <label className="block text-xs text-text-muted font-medium mb-1.5 uppercase">Pilih Foto Unit</label>
                  <div className="grid grid-cols-2 gap-2">
                    {imagesList.map((img) => (
                      <button
                        key={img.label}
                        onClick={() => setSelectedImageLabel(img.label)}
                        className={`px-3 py-2 text-xs border rounded-xl text-left transition-all truncate flex items-center justify-between cursor-pointer ${
                          selectedImageLabel === img.label
                            ? "bg-white/10 border-accent text-accent"
                            : "bg-black/20 border-white/5 text-text-muted hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span>{img.label}</span>
                        {img.originalUrl && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" title="Sudah ber-watermark di database" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs">
                  Tidak ada foto yang tersedia untuk kategori unit ini.
                </div>
              )}
            </div>
          </div>

          {/* Box 2: Pengaturan Watermark */}
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 glass-blur">
            <h2 className="font-display text-md font-bold flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Layers className="w-4 h-4 text-accent" /> 2. Desain Watermark
            </h2>

            <div className="space-y-4">
              {/* Teks Input */}
              <div>
                <label className="block text-xs text-text-muted font-medium mb-1.5 uppercase">Teks Watermark</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-accent text-sm transition-colors text-white"
                  placeholder="Ketik teks watermark..."
                />
              </div>

              {/* Posisi */}
              <div>
                <label className="block text-xs text-text-muted font-medium mb-1.5 uppercase">Posisi Penempatan</label>
                <select
                  value={watermarkPosition}
                  onChange={(e) => setWatermarkPosition(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-accent text-sm transition-colors text-white"
                >
                  <option value="bottom-right" className="bg-[#020617]">Bottom Right (Standar Properti)</option>
                  <option value="bottom-left" className="bg-[#020617]">Bottom Left</option>
                  <option value="top-right" className="bg-[#020617]">Top Right</option>
                  <option value="top-left" className="bg-[#020617]">Top Left</option>
                  <option value="center" className="bg-[#020617]">Center</option>
                  <option value="tile" className="bg-[#020617]">Tile Pattern (Pola Ubin Penuh)</option>
                </select>
              </div>

              {/* Pilihan Warna */}
              <div>
                <label className="block text-xs text-text-muted font-medium mb-1.5 uppercase">Warna Teks</label>
                <div className="flex gap-2">
                  {[
                    { name: "Putih", value: "#ffffff" },
                    { name: "Hitam", value: "#000000" },
                    { name: "Gold", value: "#c9a96e" },
                    { name: "Emerald", value: "#10b981" }
                  ].map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setWatermarkColor(color.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        watermarkColor === color.value
                          ? "border-accent text-accent bg-white/5"
                          : "border-white/5 text-text-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-white/20" 
                        style={{ backgroundColor: color.value }} 
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between text-xs text-text-muted font-medium mb-1 uppercase">
                  <span>Transparansi (Alpha)</span>
                  <span className="text-accent">{Math.round(parseFloat(watermarkOpacity) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(e.target.value)}
                  className="w-full accent-accent bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Ukuran Font */}
              <div>
                <div className="flex justify-between text-xs text-text-muted font-medium mb-1 uppercase">
                  <span>Ukuran Font</span>
                  <span className="text-accent">{watermarkFontSize} px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="150"
                  step="1"
                  value={watermarkFontSize}
                  onChange={(e) => setWatermarkFontSize(parseInt(e.target.value))}
                  className="w-full accent-accent bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* KOLOM TENGAH: CANVAS PREVIEW (5/12) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 glass-blur flex flex-col h-full justify-between">
            <div>
              <h2 className="font-display text-md font-bold flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                <Eye className="w-4 h-4 text-accent" /> 3. Pratinjau Citra Terproses
              </h2>

              {/* Status Message */}
              {message && (
                <div className={`p-4 mb-4 rounded-xl text-xs flex items-start gap-2.5 border ${
                  message.type === "success" 
                    ? "bg-emerald-950/30 border-emerald-900/30 text-emerald-400" 
                    : "bg-red-950/30 border-red-900/30 text-red-400"
                }`}>
                  {isSaving || isResetting ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-0.5" />
                  ) : (
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Area Canvas */}
              <div className="relative aspect-[3/2] w-full bg-slate-950/80 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                {isLoadingImage && (
                  <div className="absolute inset-0 z-10 bg-slate-950/80 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <p className="text-xs text-text-muted font-display tracking-widest uppercase">Rendering Canvas...</p>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain max-h-[400px]"
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={handleApplyToWebsite}
                disabled={isSaving || isResetting || !activeImage}
                className="w-full py-3.5 bg-gradient-to-r from-accent to-accent-dark text-black font-display font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Terapkan ke Website
              </button>

              <button
                onClick={handleResetToOriginal}
                disabled={isSaving || isResetting || !activeImage?.originalUrl}
                className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-display font-bold text-sm rounded-xl transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center gap-2 cursor-pointer"
              >
                {isResetting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                Reset ke Asli
              </button>
            </div>
          </div>
        </section>

        {/* KOLOM KANAN: MATERI PCD / TEORI (3/12) */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 glass-blur">
            <h2 className="font-display text-md font-bold flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <FileText className="w-4 h-4 text-accent" /> Panel Teori & Rumus PCD
            </h2>

            <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
              <div>
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" /> 1. Konsep Alpha Blending
                </h3>
                <p className="text-xs text-text-muted mb-2">
                  Watermark transparan digabungkan dengan citra asli menggunakan metode interpolasi linear warna (Alpha Blending):
                </p>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-center text-xs text-accent font-mono mb-2">
                  C_res = α·C_wm + (1 - α)·C_orig
                </div>
                <p className="text-[10px] text-text-muted">
                  Di mana <code className="text-white">α</code> adalah slider Opacity (0.1 - 1.0), <code className="text-white">C_wm</code> adalah warna watermark, dan <code className="text-white">C_orig</code> adalah piksel asli.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent" /> 2. Transformasi Spasial (Tile)
                </h3>
                <p className="text-xs text-text-muted mb-2">
                  Pada mode <b>Tile Pattern</b>, teks dirender berulang pada koordinat grid dua dimensi yang dihitung secara dinamis:
                </p>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-[10px] text-text-muted font-mono space-y-0.5">
                  <div>X_pos = i * step_x</div>
                  <div>Y_pos = j * step_y</div>
                  <div>Rotasi = -30° (canvas.rotate)</div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-accent" /> 3. Alur Data Citra
                </h3>
                <p className="text-xs text-text-muted">
                  Citra hasil manipulasi pixel di canvas dikonversi menjadi data string <b>Base64 (Data URI)</b>. Data dikirim ke server, ditandatangani dengan <b>SHA-1</b>, lalu diunggah ke <b>Cloudinary</b>. URL baru kemudian disimpan di <b>Supabase (PostgreSQL)</b>.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
