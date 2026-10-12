"use client";

import Link from "next/link";

export default function FloriaFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#000000] text-white pt-24 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-6 sm:px-10 md:px-14 lg:px-20 overflow-hidden selection:bg-white selection:text-black">
      {/* Ambient Starlight Radial Aura behind DUSK */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-radial from-purple-950/25 via-transparent to-transparent blur-3xl opacity-70 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Minimal Supporting Kicker matching Hero */}
        <div className="mb-4 sm:mb-6">
          <p
            className="inline-block px-4 py-1 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-medium tracking-[0.25em] text-zinc-300 uppercase select-none drop-shadow-sm"
            id="footer-kicker"
          >
            Where starlight breathes and creatures dream
          </p>
        </div>

        {/* Monumental "DUSK" Title with Exact Hero Shaded Color Theme */}
        <div className="w-full overflow-hidden select-none my-2">
          <h2
            className="text-[18vw] sm:text-[18vw] lg:text-[16vw] font-black uppercase tracking-[-0.04em] leading-[0.84] text-center whitespace-nowrap transition-transform duration-500 hover:scale-[1.01]"
            style={{
              background:
                "linear-gradient(135deg, #fcd34d 0%, #fb923c 25%, #e879f9 50%, #a78bfa 75%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 12px 40px rgba(232, 121, 249, 0.28))",
            }}
            id="footer-headline"
          >
            DUSK
          </h2>
        </div>

        {/* Minimal Narrative One-Liner with Shaded Hero Text Gradient */}
        <p
          className="max-w-md mx-auto text-xs sm:text-sm font-light leading-relaxed tracking-wide mt-4 mb-8 sm:mb-10 text-center"
          style={{
            background: "linear-gradient(90deg, #fde68a, #f0abfc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          id="footer-description"
        >
          A luminous sanctuary of nocturnal creatures, ancient celestial passages,
          and stories whispered only in moonlight.
        </p>

        {/* Minimal Clean Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-zinc-400 mb-12 sm:mb-16">
          <Link
            href="/"
            className="hover:text-white transition-colors duration-200"
            id="footer-nav-home"
          >
            HOME
          </Link>
          <span className="text-zinc-600">✦</span>
          <Link
            href="#explore"
            className="hover:text-white transition-colors duration-200"
            id="footer-nav-explore"
          >
            ASCENT
          </Link>
          <span className="text-zinc-600">✦</span>
          <Link
            href="#creatures"
            className="hover:text-white transition-colors duration-200"
            id="footer-nav-creatures"
          >
            FAUNA
          </Link>
          <span className="text-zinc-600">✦</span>
          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
            id="footer-nav-top"
          >
            <span>TOP</span>
            <span className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </nav>

        {/* Clean Minimal Copyright Bar */}
        <div className="w-full pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
          <span>© 2026 DUSK • ALL PASSAGES RESERVED</span>
          <span>NOCTURNAL DIGITAL SANCTUARY</span>
        </div>
      </div>
    </footer>
  );
}
