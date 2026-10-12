"use client";

import { useEffect, useRef, useState } from "react";

export default function StorytellingSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const updateDimensions = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    let animId: number;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalScrollable = trackRef.current.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const raw = -rect.top / totalScrollable;
      targetProgress.current = Math.max(0, Math.min(1, raw));
    };

    const updateLoop = () => {
      // Lerp for velvety cinematic smooth motion
      const lerpFactor = 0.12;
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0003) {
        currentProgress.current += diff * lerpFactor;
        setProgress(currentProgress.current);
      } else if (currentProgress.current !== targetProgress.current) {
        currentProgress.current = targetProgress.current;
        setProgress(targetProgress.current);
      }
      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const { width: vw, height: vh } = viewport;
  const isMobile = vw < 768;

  // Initial 9:16 portrait dimensions with generous negative space
  const initialWidth = isMobile
    ? Math.min(vw * 0.58, 230)
    : Math.min(vw * 0.22, Math.min(vh * 0.52 * (9 / 16), 300));
  const initialHeight = initialWidth * (16 / 9);

  // Progressive Expansion timing (progress 0.12 -> 0.85)
  const expandStart = 0.12;
  const expandEnd = 0.85;
  const rawExpand = Math.max(
    0,
    Math.min(1, (progress - expandStart) / (expandEnd - expandStart))
  );

  // Smooth cubic ease-in-out curve
  const easeExpand =
    rawExpand < 0.5
      ? 4 * rawExpand * rawExpand * rawExpand
      : 1 - Math.pow(-2 * rawExpand + 2, 3) / 2;

  // Interpolated card dimensions: from 9:16 portrait to full viewport
  const cardWidth = initialWidth + (vw - initialWidth) * easeExpand;
  const cardHeight = initialHeight + (vh - initialHeight) * easeExpand;

  // Border radius smoothly softens: 24px -> 0px
  const borderRadius = Math.max(0, 24 * (1 - easeExpand * 1.25));

  // Card frame border & glow opacity fades as it expands
  const frameBorderOpacity = Math.max(0, 1 - easeExpand * 2.2);

  // Staggered exit calculation helper for editorial text fragments
  const calcExit = (
    start: number,
    end: number,
    deltaX = 0,
    deltaY = 0,
    deltaRot = 0,
    deltaScale = 0
  ) => {
    const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    // Smooth ease out
    const easeT = 1 - Math.pow(1 - t, 2.5);
    const opacity = Math.max(0, 1 - easeT);
    const x = deltaX * easeT;
    const y = deltaY * easeT;
    const rot = deltaRot * easeT;
    const scale = 1 + deltaScale * easeT;
    return {
      opacity,
      transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`,
      pointerEvents: (opacity < 0.05 ? "none" : "auto") as "none" | "auto",
    };
  };

  // Staggered exit thresholds
  const scrollPill = calcExit(0.04, 0.18, 0, 25, 0, -0.15); // Bottom Center pill
  const text1 = calcExit(0.14, 0.4, -50, -30, -4, 0.05); // Top Left
  const text2 = calcExit(0.18, 0.44, 60, -25, 4, 0.06); // Top Right
  const text3 = calcExit(0.22, 0.48, -60, 0, -6, -0.05); // Left Center Ribbon
  const text4 = calcExit(0.26, 0.52, 65, 0, 5, -0.06); // Right Center Pill
  const text5 = calcExit(0.3, 0.58, -45, 40, -3, 0.04); // Bottom Left Narrative
  const text6 = calcExit(0.34, 0.62, 50, 35, 4, -0.05); // Bottom Right Fig VII

  return (
    <section
      id="explore"
      ref={trackRef}
      className="relative w-full h-[320vh] bg-[#000000] text-white selection:bg-white selection:text-black"
    >
      {/* Sticky Fullscreen Art Display Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#000000]">
        {/* Subtle Ambient Cosmic Aura Behind Portrait */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(192, 132, 252, 0.14) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 75%)",
            opacity: Math.max(0, 1 - easeExpand * 1.5),
          }}
        />

        {/* Dynamic Expanding Artwork Container */}
        <div
          className="relative flex items-center justify-center overflow-hidden z-20 transition-shadow"
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            borderRadius: `${borderRadius}px`,
            boxShadow:
              frameBorderOpacity > 0.05
                ? `0 0 70px rgba(192, 132, 252, ${0.25 * frameBorderOpacity}), 0 25px 60px -12px rgba(0, 0, 0, 0.95)`
                : "none",
          }}
          id="story-image-card"
        >
          {/* Celestial Artwork */}
          <img
            src="/img1.png"
            alt="The Lunar Ascent — Floria Celestial Realm"
            className="w-full h-full object-cover object-center select-none"
            style={{
              transform: `scale(${1 + 0.04 * (1 - easeExpand)})`,
              transition: "transform 0.1s ease-out",
            }}
          />

          {/* Elegant Framed Border Overlay (fades out during expansion) */}
          <div
            className="absolute inset-0 pointer-events-none border border-white/25 transition-opacity duration-300"
            style={{
              opacity: frameBorderOpacity,
              borderRadius: `${borderRadius}px`,
            }}
          />

          {/* Inner Vignette / Rim Glow on the portrait card */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/55 via-transparent to-black/25 transition-opacity duration-300"
            style={{ opacity: frameBorderOpacity }}
          />

          {/* Micro Card Label (in initial portrait state) */}
          <div
            className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] tracking-[0.25em] text-white/90 uppercase font-light pointer-events-none transition-opacity duration-300 drop-shadow-sm"
            style={{ opacity: Math.max(0, 1 - rawExpand * 3) }}
          >
            <span>REALM VII</span>
            <span className="text-purple-300">✦ THE LUNAR STAIRWAY</span>
          </div>
        </div>

        {/* =========================================================================
            ASYMMETRIC EDITORIAL "ORGANIZED CHAOS" TYPOGRAPHY & ARTIFACTS
            Refined, expressive, layered around the 9:16 portrait
            ========================================================================= */}



        {/* 2. TOP LEFT: Expressive Italic Serif Editorial Callout */}
        <div
          className="absolute top-[8%] sm:top-[10%] lg:top-[12%] left-[5%] sm:left-[8%] lg:left-[11%] z-10 max-w-[220px] sm:max-w-[290px] text-left border border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl transition-all"
          style={text2}
        >
          <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-zinc-400 font-mono mb-1">
            [ INSCRIPTION ]
          </span>
          <p className="text-xs sm:text-sm md:text-base font-serif italic text-zinc-100 leading-relaxed tracking-wide">
            &ldquo;The night does not fall here — it rises, carrying all who
            surrender to its luminous current.&rdquo;
          </p>
          <p className="text-[9px] sm:text-[10px] tracking-[0.25em] text-purple-300/80 uppercase font-light mt-1.5">
            — The Velvet Codex, Vol. VII
          </p>
        </div>



        {/* 4. LEFT CENTER: Celestial Measurement Glass Pill */}
        <div
          className="absolute top-[50%] -translate-y-1/2 left-[3%] sm:left-[5%] lg:left-[8%] z-10"
          style={text4}
        >
          <div className="border border-white/15 bg-black/50 backdrop-blur-md px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl shadow-2xl flex flex-col gap-1.5 min-w-[140px] sm:min-w-[160px]">
            <div className="flex items-center justify-between gap-3 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-mono text-zinc-300">
              <span className="text-zinc-400">LUMEN</span>
              <span className="text-emerald-400 font-semibold">99.4%</span>
            </div>
            <div className="h-[1px] w-full bg-white/10" />
            <div className="flex items-center justify-between gap-3 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-mono text-zinc-300">
              <span className="text-zinc-400">REALM</span>
              <span className="text-purple-300">CELESTIAL</span>
            </div>
            <div className="h-[1px] w-full bg-white/10" />
            <div className="flex items-center justify-between gap-3 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-mono text-zinc-300">
              <span className="text-zinc-400">ORBIT</span>
              <span className="text-zinc-200">PERIGEE</span>
            </div>
          </div>
        </div>



        {/* 6. BOTTOM RIGHT: Curated Artifact Code & Typography */}
        <div
          className="absolute bottom-[8%] sm:bottom-[10%] lg:bottom-[12%] right-[5%] sm:right-[8%] lg:right-[11%] z-10 max-w-[210px] sm:max-w-[270px] text-right border border-white/10 bg-black/40 backdrop-blur-md px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl shadow-xl transition-all"
          style={text6}
        >
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-zinc-300">
              FIG. VII
            </span>
            <span className="w-1.5 h-1.5 rounded-sm bg-purple-400" />
          </div>
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-white/95">
            Sanctuary
          </p>
          <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.18em] text-purple-300/80 uppercase mt-1">
            IMMERSIVE THRESHOLD PASSAGE
          </p>
        </div>

        {/* 7. BOTTOM CENTER: Subtle Scroll Prompt Pill (fades quickly) */}
        <div
          className="absolute bottom-[3%] sm:bottom-[3.5%] left-1/2 -translate-x-1/2 z-15 flex flex-col items-center gap-1.5"
          style={scrollPill}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase font-light text-zinc-400 select-none">
            SCROLL TO DESCEND
          </span>
          <div className="w-4 h-6 rounded-full border border-white/25 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-white animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
