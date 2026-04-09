export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary z-50 fixed inset-0">
            <div className="relative flex flex-col items-center">
                {/* Glowing Spinner */}
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                    <div className="absolute inset-2 rounded-full border-r-2 border-accent/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <div className="absolute inset-4 rounded-full border-b-2 border-accent/20 animate-spin" style={{ animationDuration: '2s' }} />
                </div>
                
                {/* Text Loading */}
                <div className="mt-8 flex flex-col items-center">
                    <span className="font-display text-accent font-bold tracking-[0.2em] uppercase text-sm animate-pulse">
                        Menghubungkan
                    </span>
                    <span className="text-text-muted/50 text-[0.7rem] font-medium tracking-[0.1em] mt-2">
                        Mengambil Data Properti...
                    </span>
                </div>
                
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/10 blur-2xl rounded-full pointer-events-none" />
            </div>
        </div>
    );
}
