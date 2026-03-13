import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Almahyra — Model & Interior Configurator",
  description:
    "Jelajahi koleksi desain model dan interior Almahyra. Pilih warna, lihat interior, dan temukan inspirasi untuk hunian impian Anda.",
  keywords: ["Almahyra", "interior design", "3D model", "configurator", "arsitektur"],
  openGraph: {
    title: "Almahyra — Model & Interior Configurator",
    description: "Jelajahi koleksi desain model dan interior Almahyra.",
    type: "website",
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
