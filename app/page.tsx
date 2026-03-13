import Link from "next/link";
import Image from "next/image";
import { getProperties } from "./lib/data";

// app/page.tsx (Versi Awal)

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-[2] max-w-[800px] animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 border border-white/10 rounded-full font-body text-[0.85rem] text-accent-light backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Almahya Property - Welcome
          </span>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold tracking-[-2px] leading-[1.1] mb-6 text-white capitalize">
            Modern Living <br />
            <span className="opacity-60 font-light tracking-[8px] uppercase text-[0.35em]">Redefined</span>
          </h1>

          <p className="font-body text-[clamp(1rem,2vw,1.25rem)] text-gray-400 max-w-[550px] mx-auto mb-12 font-light leading-relaxed">
            Kami menghadirkan desain arsitektur dan interior yang memadukan
            estetika modern dengan fungsionalitas — menciptakan ruang yang
            nyaman bagi keluarga Anda.
          </p>

          <button className="inline-flex items-center gap-[10px] px-9 py-4 bg-accent text-[#0a0a0f] font-display font-semibold text-base rounded-full transition-all hover:translate-y-[-2px]">
            Lihat Proyek Kami
          </button>
        </div>
      </section>
      {/* PROPERTY SELECTION SECTION */}
      <section className="relative z-10 -mt-10 px-6">
        <div className="max-w-[1200px] mx-auto overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-3 justify-start md:justify-center min-w-max">
            {properties.map((prop: any) => (
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


      {/* SIMPLE FOOTER */}
      <footer className="py-12 px-6 border-t border-white/10 text-center">
        <p className="text-gray-500 text-[0.85rem]">
          &copy; {new Date().getFullYear()} Almahyra Property. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
