import type { Metadata } from "next";
import "./globals.css";
import { MarketingProvider } from "./context/MarketingContext";
import MarketingPopup from "./components/MarketingPopup";

export const metadata: Metadata = {
// ... existing metadata ...
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
        <MarketingProvider>
          {children}
          <MarketingPopup />
        </MarketingProvider>
      </body>
    </html>
  );
}
