import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Almahyra Property — Pilihan Hunian & Investasi Properti Terbaik",
  description:
    "Cari rumah impian Anda di Almahyra Property. Menghadirkan berbagai pilihan perumahan dengan desain modern, fitur interior configurator, dan lokasi strategis.",
  keywords: ["Almahyra Property", "perumahan", "rumah dijual", "investasi properti", "interior configurator", "almahyra"],
  openGraph: {
    title: "Almahyra Property — Hunian Modern & Strategis",
    description: "Jelajahi koleksi perumahan eksklusif Almahyra. Pilih unit, lihat simulasi angsuran, dan temukan rumah impian Anda.",
    type: "website",
    url: "https://almahyra-property.com",
    siteName: "Almahyra Property",
    locale: "id_ID",
  },
  alternates: {
    canonical: "https://almahyra-property.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
