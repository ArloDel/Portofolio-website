"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { Home, User, LayoutGrid, Sparkles, Milestone, Mail } from "lucide-react";
import { isReducedMotion } from "@/app/lib/motion";

export interface MobileHudItem {
  id: string;
  label: string;
  shortLabel: string;
  anchor: string;
  iconSvg: React.ReactNode;
  aliases?: string[];
}

const iconProps = {
  strokeWidth: 1.5,
  className: "h-[18px] w-[18px]",
} as const;

export const MOBILE_HUD_ITEMS: MobileHudItem[] = [
  {
    id: "hero",
    label: "Home",
    shortLabel: "HOME",
    anchor: "#hero",
    aliases: ["hero", "title", "command"],
    iconSvg: <Home {...iconProps} />,
  },
  {
    id: "about",
    label: "About",
    shortLabel: "ABOUT",
    anchor: "#about",
    aliases: ["about", "profile", "status", "party"],
    iconSvg: <User {...iconProps} />,
  },
  {
    id: "projects",
    label: "Projects",
    shortLabel: "WORK",
    anchor: "#projects",
    aliases: ["projects", "quests", "work", "equipment"],
    iconSvg: <LayoutGrid {...iconProps} />,
  },
  {
    id: "skills",
    label: "Skills",
    shortLabel: "SKILLS",
    anchor: "#skills",
    aliases: ["skills", "archetypes", "tree", "item"],
    iconSvg: <Sparkles {...iconProps} />,
  },
  {
    id: "experience",
    label: "Experience",
    shortLabel: "LOG",
    anchor: "#experience",
    aliases: ["experience", "journey", "calendar"],
    iconSvg: <Milestone {...iconProps} />,
  },
  {
    id: "contact",
    label: "Contact",
    shortLabel: "CONTACT",
    anchor: "#contact",
    aliases: ["contact", "decree", "system", "follower"],
    iconSvg: <Mail {...iconProps} />,
  },
];

export interface MobileHudProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
  className?: string;
}

export const MobileHud: React.FC<MobileHudProps> = ({
  activeSection = "hero",
  onNavigate,
  className = "",
}) => {
  const hudRef = useRef<HTMLElement | null>(null);

  // anime.js: dock slides up once on mount
  useEffect(() => {
    const root = hudRef.current;
    if (!root || isReducedMotion()) return;

    anime({
      targets: root,
      translateY: [80, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 950,
      delay: 350,
    });
  }, []);

  const isTabActive = (item: MobileHudItem) => {
    const target = activeSection.toLowerCase();
    return item.id === target || (item.aliases?.includes(target) ?? false);
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: MobileHudItem
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
    <nav
      ref={hudRef}
      aria-label="Mobile navigation"
      className={`glass-panel fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-x-0 border-b-0 lg:hidden ${className}`}
      style={{ paddingBottom: "calc(6px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pt-2.5 pb-1">
        {MOBILE_HUD_ITEMS.map((item) => {
          const active = isTabActive(item);
          return (
            <a
              key={item.id}
              id={`hud-${item.id}`}
              href={item.anchor}
              onClick={(e) => handleTabClick(e, item)}
              aria-label={item.label}
              aria-current={active ? "true" : undefined}
              className={`group relative flex min-h-[46px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 transition-colors duration-200 active:scale-95 ${
                active ? "text-ink" : "text-ink-faint"
              }`}
            >
              <span
                className={`transition-colors duration-200 ${
                  active ? "text-accent" : "group-hover:text-ink-muted"
                }`}
              >
                {item.iconSvg}
              </span>
              <span
                className={`font-mono text-[8px] tracking-widest ${
                  active ? "text-ink" : "text-ink-faint"
                }`}
              >
                {item.shortLabel}
              </span>
              <span
                className={`absolute -top-px left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-accent transition-opacity duration-300 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileHud;
