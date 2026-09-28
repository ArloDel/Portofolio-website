"use client";

import React, { useRef } from "react";
import { useParallax, useSpotlight } from "@/app/lib/motion";

export const AmbientBackground: React.FC = () => {
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Slow ambient drift: gradient orbs breathe via CSS, slide via GSAP parallax
  useParallax(bgRef, { global: true });
  useSpotlight();

  return (
    <>
      <div ref={bgRef} aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base wash */}
        <div className="absolute inset-0 bg-canvas" />

        {/* Aurora orb — top left */}
        <div
          data-parallax="0.35"
          className="orb-a absolute -top-32 -left-32 h-[560px] w-[560px] rounded-full opacity-70 blur-2xl animate-orb"
        />

        {/* Aurora orb — bottom right */}
        <div
          data-parallax="0.55"
          className="orb-b absolute top-[55%] -right-40 h-[520px] w-[520px] rounded-full opacity-60 blur-2xl animate-orb-slow"
        />

        {/* Third faint orb for depth */}
        <div
          data-parallax="0.25"
          className="orb-c absolute bottom-[-10%] left-[30%] h-[420px] w-[420px] rounded-full opacity-50 blur-2xl animate-orb"
        />

        {/* Dot grid, masked toward the edges */}
        <div
          className="dot-grid absolute inset-0 opacity-60"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 35%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 35%, black 30%, transparent 100%)",
          }}
        />
      </div>

      {/* Cursor spotlight layer */}
      <div className="spotlight" />
    </>
  );
};

export default AmbientBackground;
