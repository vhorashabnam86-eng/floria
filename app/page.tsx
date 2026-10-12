"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CreatureCanvas from "./components/CreatureCanvas";
import StorytellingSection from "./components/StorytellingSection";
import DiscoverySection from "./components/DiscoverySection";
import FloriaFooter from "./components/FloriaFooter";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    let animationFrameId: number;
    const lerp = 0.20;

    const animate = () => {
      // Lerp smooth easing movement
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;

      const x = currentPos.current.x.toFixed(1);
      const y = currentPos.current.y.toFixed(1);

      // Reveal radius: 260px with soft feathered edge
      const maskGradient = `radial-gradient(circle 260px at ${x}px ${y}px, black 0%, black 140px, transparent 260px)`;

      if (revealRef.current) {
        revealRef.current.style.maskImage = maskGradient;
        revealRef.current.style.webkitMaskImage = maskGradient;
      }

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle 260px at ${x}px ${y}px, transparent 180px, rgba(253, 230, 138, 0.22) 235px, rgba(216, 180, 254, 0.35) 255px, transparent 260px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isHoveredRef.current) {
      currentPos.current = { x, y };
      isHoveredRef.current = true;
      setIsHovered(true);
    }
    targetPos.current = { x, y };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentPos.current = { x, y };
    targetPos.current = { x, y };
    isHoveredRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
  };

  return (
    <div className="w-full bg-[#000000] text-white">
      {/* Existing FLORIA Hero Section (Unmodified) */}
      <main
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-20 py-8 sm:py-10 md:py-12 overflow-hidden selection:bg-white selection:text-black"
      >
      {/* Base Background Image Layer (Swapped: Now bg-reveal.jpg) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/bg-reveal.jpg"
          alt="Dusk World Base"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark overlay to ensure text contrast while retaining aesthetic vibrance */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Spotlight Reveal Layer (Swapped: Now bg-base.jpg) - Cursor Following Spotlight */}
      <div
        ref={revealRef}
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          maskImage: "radial-gradient(circle 260px at -1000px -1000px, black 0%, black 140px, transparent 260px)",
          WebkitMaskImage: "radial-gradient(circle 260px at -1000px -1000px, black 0%, black 140px, transparent 260px)",
        }}
      >
        <img
          src="/bg-base.jpg"
          alt="Dusk World Reveal"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft feathered glowing ring along the spotlight radius */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* 3D Interactive Creature Model (GLB) in Center of Hero */}
      <CreatureCanvas />

      {/* Top Navigation Bar - Enhanced Legibility UI Layer */}
      <header className="w-full flex items-center justify-between relative z-30">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-[11px] sm:text-xs font-bold tracking-[0.32em] uppercase text-white px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/25 shadow-md hover:border-white hover:bg-black/70 transition-all drop-shadow-sm"
            id="brand-logo"
          >
            DUSK
          </Link>
        </div>
      </header>

      {/* Main Hero Section: Dominant Headline & Supporting Kicker — Centered behind 3D creature */}
      <section className="w-full my-auto py-12 sm:py-16 md:py-20 flex flex-col justify-center items-center text-center relative z-[5]">
        {/* Supporting Kicker */}
        <div className="w-full mb-3 sm:mb-4 md:mb-5">
          <p
            className="inline-block px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-white uppercase select-none drop-shadow-md"
            id="hero-kicker"
          >
            Where starlight breathes and creatures dream
          </p>
        </div>

        {/* Oversized Dominant Headline */}
        <div className="w-full overflow-hidden">
          <h1
            className="text-[20vw] sm:text-[20vw] lg:text-[20vw] font-black uppercase tracking-[-0.04em] leading-[0.84] select-none whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #fcd34d 0%, #fb923c 25%, #e879f9 50%, #a78bfa 75%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.85))',
            }}
            id="hero-headline"
          >
            DUSK
          </h1>
        </div>
      </section>

      {/* Bottom Editorial Area & CTAs - Enhanced Legibility UI Layer */}
      <footer className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 relative z-30">
        {/* Editorial Description in Glassmorphic Card */}
        <div className="max-w-[300px] sm:max-w-[320px] p-4 sm:p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl">
          <p
            className="text-xs sm:text-[13px] md:text-sm font-normal leading-[1.7] tracking-wide drop-shadow-sm"
            style={{
              background: 'linear-gradient(90deg, #fde68a, #f0abfc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            id="hero-description"
          >
            A luminous sanctuary of nocturnal creatures, ancient celestial passages, and stories whispered only in moonlight.
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="#explore"
            id="btn-explore"
            className="group inline-flex items-center gap-2.5 border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-white hover:text-black hover:border-white px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs md:text-[13px] font-normal tracking-wider text-white transition-all duration-300 rounded-full"
          >
            <span>Begin the Descent</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="#creatures"
            id="btn-creatures"
            className="group inline-flex items-center gap-2.5 border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-white hover:text-black hover:border-white px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs md:text-[13px] font-normal tracking-wider text-white transition-all duration-300 rounded-full"
          >
            <span>Encounter the Fauna</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </footer>
    </main>

    {/* Cinematic Scroll-Driven Storytelling Section directly following hero */}
    <StorytellingSection />

    {/* Highly Creative "FLORIA DISCOVERY" Interactive Digital Archive */}
    <DiscoverySection />

    {/* Large, Visually Striking Fine Art-Book Footer */}
    <FloriaFooter />
  </div>
);
}
