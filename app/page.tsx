import { getProperties } from "./lib/data";
import Chatbot from "./components/Chatbot";
import PropertySlider from "./components/PropertySlider";
import BrandIntroduction from "./components/BrandIntroduction";
import Link from "next/link";

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-background-primary overflow-x-hidden">
      <BrandIntroduction />

      {/* PROPERTY SELECTION SECTION - RESTORED SPACING */}
      <section className="relative z-10 py-12 px-6 bg-background-primary/50 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-3 justify-start md:justify-center min-w-max">
            {properties.map((prop) => (
              <Link
                key={prop.id}
                href={`/${prop.id}`}
                className="px-8 py-3.5 rounded-full font-display text-sm font-bold transition-all duration-300 border bg-white/5 text-white/70 border-white/10 hover:border-accent hover:text-accent hover:bg-white/10 hover:shadow-[0_0_20px_rgba(201,169,110,0.1)]"
              >
                {prop.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTY REVIEW SLIDER SECTION */}
      <section id="projects" className="relative z-10 py-20 bg-background-primary border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 mb-12 text-center lg:text-left">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                Review Program <span className="text-accent underline underline-offset-[12px] decoration-accent/30 decoration-4">Perumahan</span>
            </h2>
            <p className="text-text-muted max-w-xl font-light text-lg">
                Jelajahi berbagai proyek hunian prestisius kami di lokasi strategis Bandar Lampung dan sekitarnya.
            </p>
        </div>
        
        <PropertySlider properties={properties as any} />
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 text-center bg-black/20">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-8">
          <div className="font-display text-4xl font-black tracking-tighter text-accent italic">
            ALMAHYRA
          </div>
          <div className="flex gap-8 text-text-muted text-sm font-medium uppercase tracking-widest">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="hover:text-accent transition-colors">YouTube</a>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
          <p className="text-text-muted text-[0.8rem] opacity-50 tracking-wider">
            &copy; {new Date().getFullYear()} ALMAHYRA PROPERTY RESEARCH & DEVELOPMENT.<br />
            ALL RIGHTS RESERVED. BANDAR LAMPUNG, INDONESIA.
          </p>
        </div>
      </footer>
      <Chatbot />
    </main>
  );
}
