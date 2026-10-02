"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { useParallax, attachMouseParallax, isReducedMotion } from "@/app/lib/motion";

interface HeroSectionProps {
  name?: string;
  role?: string;
  onEmbark?: () => void;
  onNavigate?: (sectionId: string) => void;
}

const NAME = "Hakeeem";

export const HeroSection: React.FC<HeroSectionProps> = ({
  name = "Alif Nur Rahman Hakim",
  role = "Full-Stack Developer",
  onEmbark,
  onNavigate,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);

  const navigate = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
      return;
    }
    if (onEmbark) onEmbark();
  };

  // 1. anime.js entrance: character stagger for the name + gentle rise for meta
  useEffect(() => {
    const root = heroRef.current;
    if (!root || isReducedMotion()) return;

    const chars = root.querySelectorAll("[data-hero-char]");
    const meta = root.querySelectorAll("[data-hero-fade]");

    anime.set(chars, { opacity: 0, translateY: "1.1em" });
    anime.set(meta, { opacity: 0, translateY: 22 });

    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: chars,
      translateY: ["1.1em", "0em"],
      opacity: [0, 1],
      duration: 1100,
      delay: anime.stagger(42),
    }, 100)
      .add({
        targets: meta,
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 900,
        delay: anime.stagger(90),
      }, "-=700");

    return () => {
      anime.remove([chars, meta]);
    };
  }, []);

  // 2. GSAP scroll parallax on watermark & floating glass shapes
  useParallax(heroRef);

  // 3. anime.js cursor parallax on floating chips
  useEffect(() => {
    const root = heroRef.current;
    if (!root || isReducedMotion()) return;
    return attachMouseParallax(root, ".hero-float", 16);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-screen select-none flex-col justify-center overflow-hidden w-full"
    >
      {/* ---- Parallax layer: giant outlined watermark ---- */}
      <div
        data-parallax="-0.18"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-0 z-0 lg:left-24"
      >
        <span className="text-outline font-display text-[19vw] font-bold leading-none tracking-tightest">
          Hakeeem
        </span>
      </div>

      {/* ---- Parallax layer 1: cursor-reactive glass geometry (anime.js mouse parallax) ---- */}
      <div
        data-parallax="0.4"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden md:block"
      >
        <div className="hero-float absolute right-[8%] top-[16%] h-40 w-40 rounded-full border border-fill/[0.07]" />
        <div className="hero-float absolute left-[6%] top-[22%] h-2 w-2 rounded-full bg-accent/70" />
      </div>

      {/* ---- Parallax layer 2: ambient floating panels (pure CSS float) ---- */}
      <div
        data-parallax="-0.3"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden md:block"
      >
        <div className="absolute bottom-[26%] right-[16%] h-24 w-24 animate-float-slow rounded-2xl border border-fill/[0.06] bg-fill/[0.02] backdrop-blur-sm" />
        <div className="absolute bottom-[34%] left-[14%] h-1.5 w-1.5 rounded-full bg-fill/40" />
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6 sm:px-10">
        {/* Availability badge */}
        <div data-hero-fade className="mb-8 flex items-center gap-3">
          <span className="glass-chip flex items-center gap-2.5 rounded-full px-4 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="font-mono text-[10px] tracking-caption text-ink-muted">
              OPEN FOR PROJECTS
            </span>
          </span>
          <span className="hidden items-center gap-1.5 font-mono text-[10px] tracking-wider text-ink-faint sm:flex">
            <MapPin className="h-3 w-3" strokeWidth={1.5} />
            SURABAYA, ID
          </span>
        </div>

        {/* Name */}
        <h1
          aria-label={name}
          className="font-display text-[16vw] font-bold leading-[0.95] tracking-tightest text-ink-hi sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {NAME.split("").map((char, i) => (
            <span
              key={i}
              data-hero-char
              aria-hidden="true"
              className="inline-block whitespace-pre"
            >
              {i === NAME.length - 1 ? (
                <span className="text-accent">{char}</span>
              ) : (
                char
              )}
            </span>
          ))}
        </h1>

        {/* Role & statement */}
        <div data-hero-fade className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
          <p className="font-display text-lg font-medium text-accent sm:text-xl">
            {role}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
            Crafting minimal, resilient web experiences with precise UIs and
            clean architecture — Next.js on the front, Laravel on the back.
          </p>
        </div>

        {/* CTAs */}
        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("projects")}
            className="group flex items-center gap-2.5 rounded-full bg-invert px-6 py-3 text-sm font-medium text-invert-ink transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
          >
            View projects
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => navigate("contact")}
            className="glass-chip group flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium text-ink-muted transition-all duration-300 hover:border-accent/40 hover:text-ink"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.75} />
          </button>
        </div>

        {/* Quiet stat chips */}
        <div data-hero-fade className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] tracking-caption text-ink-faint">
          <span>05 — SHIPPED PRODUCTS</span>
          <span className="hidden h-3 w-px bg-fill/10 sm:block" />
          <span>3+ YRS BUILDING</span>
          <span className="hidden h-3 w-px bg-fill/10 sm:block" />
          <span>UPN JATIM — INFO SYSTEMS</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-fade
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="caption">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-fill/10">
          <span className="absolute inset-x-0 top-0 h-3 animate-scroll-dot rounded-full bg-accent/80" />
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
