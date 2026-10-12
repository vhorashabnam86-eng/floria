"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

interface SpecimenCard {
  id: string;
  number: string;
  name: string;
  category: string;
  latinName: string;
  description: string;
  image: string;
  aspect: string;
  colSpan: string;
  offset: string;
  hoverRotate: string;
  accentColor: string;
  status: string;
  coordinates: string;
}

const SPECIMENS: SpecimenCard[] = [
  {
    id: "astraea",
    number: "SPECIMEN 01",
    name: "Astraea Lumina",
    category: "FAUNA // LEPIDOPTERA AETHERIA",
    latinName: "Lumina noctis astraea",
    description:
      "A moth-spirit woven from translucent crystal lace, surfacing only at lunar zenith. Its gossamer wings shatter ambient starlight into living emerald auroras that drift like breath.",
    image: "/discovery_astraea.jpg",
    aspect: "aspect-[4/3] sm:aspect-[16/11]",
    colSpan: "col-span-12 lg:col-span-7",
    offset: "lg:translate-y-0",
    hoverRotate: "hover:-rotate-[1deg]",
    accentColor: "text-emerald-400",
    status: "ACTIVE // ZENITH PHASE",
    coordinates: "43°12'N 12°04'E",
  },
  {
    id: "canopy",
    number: "SECTOR 04",
    name: "The Obsidian Canopy",
    category: "BIOME // ARBORETUM NOCTIS",
    latinName: "Silva umbrae obsidianus",
    description:
      "An ancient grove where weeping elder trees drip with bioluminescent violet spores. Below, a glass-still river absorbs all shadow and reflects nothing but the celestial crescent above.",
    image: "/discovery_canopy.jpg",
    aspect: "aspect-[3/4]",
    colSpan: "col-span-12 lg:col-span-5",
    offset: "lg:translate-y-16",
    hoverRotate: "hover:rotate-[1.2deg]",
    accentColor: "text-purple-400",
    status: "SANCTUARY // PRIMORDIAL",
    coordinates: "41°08'N 14°22'E",
  },
  {
    id: "nocturne",
    number: "SPECIMEN 02",
    name: "Nocturne Solitary",
    category: "FAUNA // CERVIDAE ASTRALIS",
    latinName: "Cervus nocturnus stellata",
    description:
      "A silent, regal guardian drifting through shallows of violet mist. Its crystalline antlers resonate at low harmonic frequencies, drawing lost wanderers safely through the veil.",
    image: "/discovery_nocturne.jpg",
    aspect: "aspect-[4/3]",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-5",
    offset: "lg:-translate-y-6",
    hoverRotate: "hover:-rotate-[0.8deg]",
    accentColor: "text-cyan-400",
    status: "RARE // SOLITARY SENTINEL",
    coordinates: "44°55'N 10°18'E",
  },
  {
    id: "solarium",
    number: "SECTOR 09",
    name: "The Sunken Solarium",
    category: "RUIN // VESTIGES OF GLASS",
    latinName: "Sanctuarium subaquaticum",
    description:
      "Submerged Greco-cosmic arches flooded with celestial spring water. Ancient silver algae blooms quietly beneath carved columns, eternally bathed in twilight amber.",
    image: "/discovery_solarium.jpg",
    aspect: "aspect-[16/10]",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-7",
    offset: "lg:translate-y-8",
    hoverRotate: "hover:rotate-[0.8deg]",
    accentColor: "text-indigo-300",
    status: "ARCHIVE // SUBMERGED RELIC",
    coordinates: "42°30'N 13°44'E",
  },
  {
    id: "zephyr",
    number: "SPECIMEN 03",
    name: "Zephyr Phantasm",
    category: "FAUNA // PHANTASMATIDAE",
    latinName: "Aves medusa aetheria",
    description:
      "Drifting weightlessly through nocturnal cloud banks, this avian-medusa entity rides stratosphere currents, trailing gossamer ribbons of iridescent stardust in its silent wake.",
    image: "/discovery_zephyr.jpg",
    aspect: "aspect-[16/10]",
    colSpan: "col-span-12 lg:col-span-8 lg:col-start-3",
    offset: "my-4 lg:my-8",
    hoverRotate: "hover:-rotate-[0.5deg]",
    accentColor: "text-pink-400",
    status: "ATMOSPHERIC // DRIFTBORNE",
    coordinates: "45°01'N 11°59'E",
  },
];

export default function DiscoverySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});


  // GSAP kinetic reveal for section header
  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const animateHeader = () => {
      if (!headerRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        // 1. DISCOVER word blooms in with luminous scale & glow
        tl.fromTo(
          ".discover-gradient-word",
          { opacity: 0, scale: 0.88, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.95,
            ease: "back.out(1.4)",
          }
        );

        // 3. DUSK word blooms in with luminous scale & glow
        tl.fromTo(
          ".dusk-gradient-word",
          { opacity: 0, scale: 0.88, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.95,
            ease: "back.out(1.4)",
          },
          "-=0.55"
        );

        // 4. Accent line & narrative paragraph slide in
        tl.fromTo(
          ".header-narrative-group",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );

        // 5. Metadata badges cascade in
        tl.fromTo(
          ".header-badge-pill",
          { opacity: 0, y: 16, scale: 0.93 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.4"
        );

        // 6. Right-side Telemetry HUD panel slides in gracefully
        tl.fromTo(
          ".header-hud-panel",
          { opacity: 0, x: 35, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.85, ease: "power2.out" },
          "-=0.6"
        );
      }, headerRef);
    };

    // Trigger reveal when header enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateHeader();
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      observer.disconnect();
      if (ctx) ctx.revert();
    };
  }, []);

  // Specimen card reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-specimen-id");
            if (id) {
              setRevealedCards((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = sectionRef.current?.querySelectorAll("[data-specimen-id]");
    elements?.forEach((el) => observer.observe(el));

    // Safety timer so cards are never permanently invisible
    const safetyTimer = setTimeout(() => {
      setRevealedCards((prev) => {
        const all: Record<string, boolean> = {};
        SPECIMENS.forEach((s) => (all[s.id] = true));
        return { ...all, ...prev };
      });
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <section
      id="creatures"
      ref={sectionRef}
      className="relative w-full bg-[#000000] text-white pt-24 sm:pt-32 md:pt-40 pb-28 sm:pb-36 px-6 sm:px-10 md:px-14 lg:px-20 overflow-hidden selection:bg-white selection:text-black"
    >
      {/* Ghost Watermark Background Typographic Ephemera */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[6%] -left-[8%] text-[15vw] font-black tracking-[-0.04em] uppercase text-white/[0.018] -rotate-6 whitespace-nowrap">
          NOCTURNAL ARCHIVE
        </div>
        <div className="absolute top-[40%] -right-[6%] text-[13vw] font-serif italic text-white/[0.02] rotate-3 whitespace-nowrap">
          Sanctuary of Starlight
        </div>
        <div className="absolute bottom-[10%] -left-[4%] text-[14vw] font-mono font-bold text-white/[0.015] -rotate-2 whitespace-nowrap">
          SPECIMEN NOCTIS
        </div>
        {/* Soft Ambient Radial Aurora */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[85vw] h-[650px] bg-radial from-purple-950/25 via-transparent to-transparent blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-[65vw] h-[550px] bg-radial from-emerald-950/20 via-transparent to-transparent blur-3xl opacity-60 pointer-events-none" />
      </div>

      {/* =========================================================================
          SECTION HEADER — GSAP Kinetic Typography & Atmospheric Observatory HUD
          Balanced layout covering previously blank right space
          ========================================================================= */}
      <header
        ref={headerRef}
        className="relative z-10 w-full mb-20 sm:mb-28 md:mb-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
      >
        {/* Left Column: Kinetic Typography & Editorial Content (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Grand Kinetic Headline: "DISCOVER DUSK" */}
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-[-0.035em] leading-[0.88] select-none">
            {/* "DISCOVER" styled like Dusk with radiant gradient & font-serif italic */}
            <span
              className="discover-gradient-word font-serif italic font-light inline-block tracking-normal pb-2"
              style={{
                background:
                  "linear-gradient(135deg, #fef08a 0%, #f472b6 32%, #c084fc 68%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 35px rgba(192, 132, 252, 0.45))",
              }}
            >
              Discover
            </span>
            <br />
            {/* "DUSK" with Radiant Multi-Stop Twilight Gradient */}
            <span
              className="dusk-gradient-word font-serif italic font-light inline-block tracking-normal pb-2"
              style={{
                background:
                  "linear-gradient(135deg, #fef08a 0%, #f472b6 32%, #c084fc 68%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 35px rgba(192, 132, 252, 0.45))",
              }}
            >
              Dusk
            </span>
          </h2>

          {/* 3. Editorial Narrative & Accent Line */}
          <div className="header-narrative-group mt-8 sm:mt-10 max-w-2xl flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
            <div className="w-12 h-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-transparent mt-2.5 shrink-0 hidden sm:block" />
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed tracking-wide">
              A living sanctuary of entities born from twilight, lost celestial passages,
              and biomes that pulse with their own sentient will. Each entry is preserved
              in situ — waiting to be witnessed by those willing to cross the starlight veil.
            </p>
          </div>

          {/* 4. Interactive Metadata Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="header-badge-pill group px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-300 hover:border-purple-400/60 hover:text-white transition-all cursor-default">
              <span className="text-purple-400 mr-2">✦</span>
              5 DOCUMENTED ENTITIES
            </div>
            <div className="header-badge-pill group px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-300 hover:border-emerald-400/60 hover:text-white transition-all cursor-default">
              <span className="text-emerald-400 mr-2">●</span>
              STATUS: NOCTURNAL VIGIL
            </div>
            <div className="header-badge-pill group px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.22em] text-emerald-400/90 hover:border-cyan-400/60 transition-all cursor-default">
              <span className="text-cyan-400 mr-2">◈</span>
              BIOLUMINESCENT PHENOMENA
            </div>
          </div>
        </div>

        {/* Right Column: Observatory HUD Telemetry Widget (Covers Empty Blank Space) */}
        <div className="header-hud-panel lg:col-span-4 hidden lg:flex flex-col">
          <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.01] backdrop-blur-xl p-6 shadow-2xl overflow-hidden">
            {/* Subtle glow behind card */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Radar Status */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-300 uppercase">
                  ASTRAL HUD // LIVE
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                LAT 43.2°
              </span>
            </div>

            {/* Radar Circle & Observation Readout */}
            <div className="my-5 flex items-center gap-5">
              {/* Radar Reticle Graphic */}
              <div className="relative w-16 h-16 rounded-full border border-purple-400/30 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 rounded-full border border-dashed border-white/20 animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-0 rounded-full border-t border-purple-400/80 animate-[spin_3s_linear_infinite]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_#c084fc]" />
              </div>

              {/* Data Summary */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-zinc-200">
                  SECTOR: CELESTIAL VEIL
                </span>
                <span className="text-[10px] font-mono tracking-[0.15em] text-purple-300/80">
                  TWILIGHT LUX: 0.042 cd/m²
                </span>
                <span className="text-[9px] font-mono tracking-[0.15em] text-zinc-400">
                  ATMOSPHERIC HARMONY: 99.4%
                </span>
              </div>
            </div>

            {/* Telemetry Metrics Table */}
            <div className="space-y-2 pt-4 border-t border-white/10 text-[10px] font-mono uppercase tracking-[0.2em]">
              <div className="flex items-center justify-between text-zinc-400">
                <span>FAUNA COHORT</span>
                <span className="text-white font-medium">3 ENTITIES</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>SANCTUARIES</span>
                <span className="text-white font-medium">2 BIOMES</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>CHRONO PHASE</span>
                <span className="text-emerald-400 font-medium">DEEP DUSK</span>
              </div>
            </div>

            {/* Micro Coordinates Footer */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[8px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
              <span>REF: FLORIA-NOCTIS-2026</span>
              <span>VERIFIED ARCHIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          ASYMMETRIC EDITORIAL SPECIMEN GRID
          Varied card sizes, offsets, hover transforms, and rich field notes
          ========================================================================= */}
      <div className="relative z-10 grid grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-start">
        {SPECIMENS.map((specimen, idx) => {
          const isRevealed = revealedCards[specimen.id];

          return (
            <article
              key={specimen.id}
              data-specimen-id={specimen.id}
              className={`group relative ${specimen.colSpan} ${specimen.offset} transition-all duration-700 ease-out`}
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed
                  ? "translateY(0px) scale(1)"
                  : "translateY(35px) scale(0.97)",
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Outer Card Container with Subtle Float / Tilt on Hover */}
              <div
                className={`relative rounded-2xl sm:rounded-3xl border border-white/15 bg-black/60 backdrop-blur-md overflow-hidden p-3.5 sm:p-5 transition-all duration-500 ease-out group-hover:border-white/40 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${specimen.hoverRotate} group-hover:-translate-y-2`}
              >
                {/* Image Showcase Frame */}
                <div
                  className={`relative w-full ${specimen.aspect} overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-950 mb-5 sm:mb-6`}
                >
                  <img
                    src={specimen.image}
                    alt={specimen.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Edge Card Corner Stamps */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-[9px] font-mono tracking-[0.25em] text-white/80 uppercase pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                      {specimen.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-zinc-300">
                      {specimen.coordinates}
                    </span>
                  </div>

                  {/* Hover Reveal Quick Details Badge */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] uppercase transition-all duration-300 opacity-80 group-hover:opacity-100 pointer-events-none">
                    <span className={specimen.accentColor}>
                      ● {specimen.status}
                    </span>
                    <span className="text-zinc-400 group-hover:text-white transition-colors">
                      [ DETAILS + ]
                    </span>
                  </div>
                </div>

                {/* Editorial Typography & Metadata Information */}
                <div className="flex flex-col gap-2">
                  {/* Category & Latin Taxonomy */}
                  <div className="flex items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
                    <span>{specimen.category}</span>
                    <span className="italic font-serif text-zinc-500 normal-case hidden sm:inline">
                      {specimen.latinName}
                    </span>
                  </div>

                  {/* Creature / Realm Name */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-[0.08em] uppercase text-white group-hover:text-white transition-colors flex items-center justify-between">
                    <span>{specimen.name}</span>
                    <span className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 text-lg">
                      ↗
                    </span>
                  </h3>

                  {/* Mysterious Narrative Description */}
                  <p className="text-xs sm:text-[13px] text-zinc-400 font-light leading-relaxed tracking-wide mt-1 line-clamp-3 group-hover:text-zinc-200 transition-colors">
                    {specimen.description}
                  </p>

                  {/* Subtle Expanding Scientific Specimen Bar on Hover */}
                  <div className="pt-4 mt-2 border-t border-white/[0.08] flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                    <span>ARCHIVE REF: DSK-{specimen.id.toUpperCase()}-07</span>
                    <span className="text-white/60">OBSERVED 2026</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* =========================================================================
          TERMINAL CALL-TO-ACTION: "CROSS THE THRESHOLD →"
          ========================================================================= */}
      <div className="relative z-10 mt-28 sm:mt-36 md:mt-44 flex flex-col items-center justify-center text-center">
        {/* Subtle Ambient Radial Aura behind CTA */}
        <div className="absolute w-80 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -translate-y-4" />

        <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-zinc-400 mb-5 select-none">
          ✦ PASSAGE BEYOND THE VEIL ✦
        </p>

        <Link
          href="#explore"
          className="group relative inline-flex items-center gap-4 border border-white/30 bg-black/60 backdrop-blur-lg hover:bg-white hover:text-black hover:border-white px-8 py-4 sm:px-10 sm:py-5 text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-white transition-all duration-300 rounded-full shadow-[0_0_35px_rgba(192,132,252,0.18)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
          id="btn-enter-world"
        >
          <span>CROSS THE THRESHOLD</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 text-lg leading-none">
            →
          </span>
        </Link>

        <span className="mt-4 text-[9px] font-mono tracking-[0.2em] text-zinc-600 uppercase select-none">
          ALL PASSAGES UNSEALED // ENTER FREELY
        </span>
      </div>
    </section>
  );
}
