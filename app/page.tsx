"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Github } from "lucide-react";
import DesktopSidebar from "@/app/components/navigation/DesktopSidebar";
import MobileHud from "@/app/components/navigation/MobileHud";
import AmbientBackground from "@/app/components/ui/AmbientBackground";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import HeroSection from "@/app/components/sections/HeroSection";
import ProfileSection from "@/app/components/sections/ProfileSection";
import QuestLogSection from "@/app/components/sections/QuestLogSection";
import ArchetypeTreeSection from "@/app/components/sections/ArchetypeTreeSection";
import JourneyLogSection from "@/app/components/sections/JourneyLogSection";
import ContactSection from "@/app/components/sections/ContactSection";

const SECTION_IDS = [
  "hero",
  "about",
  "projects",
  "skills",
  "experience",
  "contact",
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);

  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Master scroll-spy for active section tracking
  useEffect(() => {
    const sectionElements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-15% 0px -35% 0px",
        threshold: [0.25, 0.5, 0.75],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Fixed ambient parallax background */}
      <AmbientBackground />

      {/* Light / dark theme toggle */}
      <ThemeToggle />

      {/* Desktop glass rail navigation */}
      <DesktopSidebar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main content */}
      <main className="flex min-h-screen w-full flex-col items-center overflow-x-hidden pb-24 lg:pb-0 lg:pl-60">
        <HeroSection onNavigate={handleNavigate} />
        <ProfileSection />
        <QuestLogSection highlightedSkill={highlightedSkill} />
        <ArchetypeTreeSection onSelectSkill={setHighlightedSkill} />
        <JourneyLogSection />
        <ContactSection />

        {/* Minimal footer */}
        <footer className="w-full border-t border-fill/[0.06] px-6 py-10 sm:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="glass-chip flex h-8 w-8 items-center justify-center rounded-lg font-display text-sm font-bold text-accent">
                H
              </span>
              <span className="font-display text-sm font-medium text-ink-muted">
                Hakeeem — Full-Stack Developer
              </span>
            </div>

            <div className="flex items-center gap-6">
              <p className="font-mono text-[10px] tracking-caption text-ink-faint">
                © 2024—2026 • BUILT WITH NEXT.JS + ANIME.JS + GSAP
              </p>
              <a
                href="https://github.com/ArloDel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-ink-faint transition-colors hover:text-accent"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile glass dock */}
      <MobileHud activeSection={activeSection} onNavigate={handleNavigate} />
    </div>
  );
}
