export default function Loading() {
  return (
    <main className="min-h-screen bg-background-primary overflow-hidden">
      {/* HERO SKELETON */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/10 blur-[120px] opacity-20 pointer-events-none z-0" />
        
        {/* Back Button Skeleton */}
        <div className="absolute top-6 left-6 z-[10] md:top-10 md:left-10 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
          <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
        </div>

        <div className="relative z-[2] w-full max-w-[800px] flex flex-col items-center">
          {/* Spinner Overlay (Subtle) */}
          <div className="mb-8 w-12 h-12 relative opacity-20">
              <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
          </div>

          {/* Badge Skeleton */}
          <div className="w-48 h-10 bg-white/5 border border-white/10 rounded-full mb-8 animate-pulse" />

          {/* Title Skeleton */}
          <div className="w-[80%] h-16 md:h-24 bg-white/5 rounded-2xl mb-6 animate-pulse" />
          <div className="w-[40%] h-6 bg-white/5 rounded-lg mb-12 animate-pulse" />

          {/* Description Skeleton */}
          <div className="w-[60%] h-4 bg-white/5 rounded-full mb-4 animate-pulse" />
          <div className="w-[50%] h-4 bg-white/5 rounded-full mb-12 animate-pulse" />

          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-6">
            <div className="w-full sm:w-48 h-14 bg-accent/20 rounded-full animate-pulse" />
            <div className="w-full sm:w-48 h-14 bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Scroll Indicator Skeleton */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 opacity-30">
          <div className="w-10 h-3 bg-white/5 rounded animate-pulse" />
          <div className="w-px h-10 bg-white/10" />
        </div>
      </section>

      {/* PROPERTY SELECTION SKELETON */}
      <section className="relative z-10 -mt-10 px-6">
        <div className="max-w-[1200px] mx-auto flex gap-3 justify-center">
          <div className="w-32 h-12 bg-white/5 rounded-full animate-pulse" />
          <div className="w-32 h-12 bg-white/5 rounded-full animate-pulse" />
          <div className="w-32 h-12 bg-white/5 rounded-full animate-pulse opacity-50" />
        </div>
      </section>
    </main>
  );
}
