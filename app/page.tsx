import Link from "next/link";
import ModelConfigurator from "./components/ModelConfigurator";
import { getProperties, getUnitsByPropertyId } from "./lib/data";
import Chatbot from "./components/Chatbot";

export default async function Home() {
  const properties = await getProperties();
  const activeProperty = properties[0]; // Home page displays the first property by default

  // Fetch units for the first property to pass to configurator
  const units = activeProperty ? await getUnitsByPropertyId(activeProperty.id) : [];

  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 overflow-hidden" id="hero">
        {/* Hero Background Glow */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] hero-gradient opacity-40 pointer-events-none z-0" />

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-background-primary to-transparent pointer-events-none z-[1]" />

        <div className="relative z-[2] max-width-[800px] animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-bg-glass border border-border-glass rounded-full font-body text-[0.85rem] color-accent-light glass-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)] animate-pulse-dot" />
            Almahya Property - Welcome
          </span>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-6 text-gradient capitalize">
            {activeProperty?.titleTop || "Modern Living"}
            <span className="block text-[0.35em] font-light tracking-[8px] uppercase opacity-60 mt-3">
              {activeProperty?.titleBottom || "Redefined"}
            </span>
          </h1>

          <p className="font-body text-[clamp(1rem,2vw,1.25rem)] text-text-secondary max-w-[550px] mx-auto mb-12 font-light leading-relaxed">
            Kami menghadirkan desain arsitektur dan interior yang memadukan
            estetika modern dengan fungsionalitas — menciptakan ruang yang
            menginspirasi dan nyaman untuk ditinggali oleh keluarga Anda.
          </p>

          <a href="#configurator" className="inline-flex items-center gap-[10px] px-9 py-4 bg-gradient-to-br from-accent to-accent-dark text-[#0a0a0f] font-display font-semibold text-base rounded-full transition-smooth hover:translate-y-[-2px] hover:shadow-[0_20px_40px_var(--accent-glow)] group">
            Lihat Proyek Kami
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 text-text-muted text-[0.75rem] tracking-[2px] uppercase">
          <span>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* PROPERTY SELECTION SECTION */}
      <section className="relative z-10 -mt-10 px-6">
        <div className="max-w-[1200px] mx-auto overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-3 justify-start md:justify-center min-w-max">
            {properties.map((prop) => (
              <Link
                key={prop.id}
                href={`/${prop.id}`}
                className="px-6 py-3 rounded-full font-display text-sm font-medium transition-all duration-300 border bg-bg-glass text-text-secondary border-border-glass hover:border-accent hover:text-accent-light hover:bg-white/5"
              >
                {prop.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIGURATOR SECTION */}
      <section className="relative py-[var(--section-padding)]" id="configurator">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] hero-gradient opacity-[0.15] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block font-body text-[0.8rem] font-medium text-accent uppercase tracking-[3px] mb-4">
              Showcase Utama: {activeProperty?.name}
            </span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-1px] mb-4 text-text-primary">
              Pilih &amp; Jelajahi Unit
            </h2>
            <p className="text-[1.05rem] text-text-secondary max-w-[500px] mx-auto font-light">
              Klik nama perumahan di atas untuk melihat detail lengkap per lokasi,
              atau jelajahi desain {activeProperty?.name} di bawah ini.
            </p>
          </div>

          {activeProperty && (
            <ModelConfigurator
              key={activeProperty.id}
              activePropertyId={activeProperty.id}
              propertyName={activeProperty.name}
              units={units as any}
              sitePlanImage={activeProperty.sitePlanImage}
            />
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border-glass text-center">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4">
          <div className="font-display text-2xl font-bold text-accent">
            Almahyra <span className="text-text-primary opacity-50 font-light">| Property Research</span>
          </div>
          <p className="text-text-muted text-[0.85rem]">
            &copy; {new Date().getFullYear()} Almahyra Property Research &amp; Development. All rights reserved.
          </p>
        </div>
      </footer>
      <Chatbot />
    </main>
  );
}
