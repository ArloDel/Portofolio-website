"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { Github, MapPin } from "lucide-react";
import { isReducedMotion } from "@/app/lib/motion";

export interface NavigationSectionItem {
  id: string;
  label: string;
  romanNumeral: string;
  tag: string;
  anchor: string;
  aliases?: string[];
}

export const NAVIGATION_SECTIONS: NavigationSectionItem[] = [
  {
    id: "hero",
    label: "Home",
    romanNumeral: "I",
    tag: "01",
    anchor: "#hero",
    aliases: ["hero", "title", "command", "awakening"],
  },
  {
    id: "about",
    label: "About",
    romanNumeral: "II",
    tag: "02",
    anchor: "#about",
    aliases: ["about", "profile", "status", "party", "character"],
  },
  {
    id: "projects",
    label: "Projects",
    romanNumeral: "III",
    tag: "03",
    anchor: "#projects",
    aliases: ["projects", "quests", "work", "equipment"],
  },
  {
    id: "skills",
    label: "Skills",
    romanNumeral: "IV",
    tag: "04",
    anchor: "#skills",
    aliases: ["skills", "archetypes", "tree", "item"],
  },
  {
    id: "experience",
    label: "Experience",
    romanNumeral: "V",
    tag: "05",
    anchor: "#experience",
    aliases: ["experience", "journey", "chronicles", "calendar"],
  },
  {
    id: "contact",
    label: "Contact",
    romanNumeral: "VI",
    tag: "06",
    anchor: "#contact",
    aliases: ["contact", "decree", "system", "follower"],
  },
];

export interface DesktopSidebarProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
  className?: string;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeSection = "hero",
  onNavigate,
  className = "",
}) => {
  const navRef = useRef<HTMLElement | null>(null);

  // anime.js: soft stagger fade for the rail content on mount
  useEffect(() => {
    const root = navRef.current;
    if (!root || isReducedMotion()) return;

    anime.set(root.querySelectorAll("[data-rail-item]"), {
      opacity: 0,
      translateY: 12,
    });
    anime({
      targets: root.querySelectorAll("[data-rail-item]"),
      translateY: [12, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 900,
      delay: anime.stagger(70, { start: 220 }),
    });
  }, []);

  const isSectionActive = (item: NavigationSectionItem) => {
    const target = activeSection.toLowerCase();
    return item.id === target || (item.aliases?.includes(target) ?? false);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavigationSectionItem
  ) => {
    e.preventDefault();
    onNavigate?.(item.id);
    const targetEl = document.getElementById(item.id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = item.anchor;
    }
  };

  return (
    <aside
      ref={navRef}
      className={`glass-rail fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col justify-between border-y-0 border-l-0 px-6 py-8 lg:flex ${className}`}
    >
      {/* Monogram header */}
      <div data-rail-item>
        <button
          type="button"
          onClick={(e) => handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, NAVIGATION_SECTIONS[0])}
          className="group text-left"
          aria-label="Back to top"
        >
          <div className="glass-chip mb-5 flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:border-accent/40">
            <span className="font-display text-lg font-bold text-accent">H</span>
          </div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
            Hakeeem
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">Full-Stack Developer</p>
        </button>
      </div>

      {/* Nav links */}
      <nav aria-label="Primary" className="my-8">
        <ul className="flex flex-col gap-1">
          {NAVIGATION_SECTIONS.map((item) => {
            const active = isSectionActive(item);
            return (
              <li key={item.id} data-rail-item>
                <a
                  id={`nav-${item.id}`}
                  href={item.anchor}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`group relative flex items-baseline gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  {/* Active bar */}
                  <span
                    className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent transition-opacity duration-300 ${
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`font-mono text-[10px] tracking-widest ${
                      active ? "text-accent" : "text-ink-faint/50"
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span
                    className={`font-display text-sm font-medium tracking-wide transition-transform duration-200 ${
                      active ? "translate-x-0.5" : "group-hover:translate-x-0.5"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer meta */}
      <div data-rail-item className="flex flex-col gap-4">
        <div className="hairline" aria-hidden="true" />
        <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-ink-faint">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-accent" strokeWidth={1.5} />
            UTC+7
          </span>
          <span>ID — SURABAYA</span>
        </div>
        <a
          href="https://github.com/ArloDel"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-chip group flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors hover:border-accent/40"
        >
          <span className="font-mono text-[10px] tracking-wider text-ink-muted group-hover:text-ink">
            GITHUB
          </span>
          <Github className="h-3.5 w-3.5 text-ink-muted transition-colors group-hover:text-accent" strokeWidth={1.5} />
        </a>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
