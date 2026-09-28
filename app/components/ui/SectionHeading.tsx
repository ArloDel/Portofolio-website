"use client";

import React, { useRef, useEffect } from "react";
import anime from "animejs";
import { useReveal, isReducedMotion } from "@/app/lib/motion";

export interface SectionHeadingProps {
  index: string;
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  kicker,
  title,
  description,
  align = "left",
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const isCenter = align === "center";

  // anime.js entrance: title chars rise with a stagger
  useEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    if (!root || !title || isReducedMotion()) return;

    const chars = title.querySelectorAll("[data-char]");
    if (chars.length === 0) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        anime.set(chars, { opacity: 0, translateY: "0.9em" });
        anime({
          targets: chars,
          translateY: ["0.9em", "0em"],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 900,
          delay: anime.stagger(18),
        });
        io.disconnect();
      },
      { threshold: 0.4 }
    );

    io.observe(title);
    return () => io.disconnect();
  }, [title]);

  useReveal(rootRef, "[data-line]", { translateY: 12 });

  return (
    <div
      ref={rootRef}
      className={`mb-12 sm:mb-16 ${isCenter ? "text-center" : ""}`}
    >
      {/* Index rail */}
      <div
        data-line
        className={`mb-4 flex items-center gap-3 ${
          isCenter ? "justify-center" : ""
        }`}
      >
        <span className="hairline w-10" aria-hidden="true" />
        <span className="font-mono text-[11px] font-medium tracking-caption text-accent">
          {index}
          {kicker ? ` — ${kicker}` : ""}
        </span>
        <span
          className={`hairline flex-1 max-w-[120px] ${isCenter ? "max-w-none" : ""}`}
          aria-hidden="true"
        />
      </div>

      {/* Title with char-staggered anime.js reveal */}
      <h2
        ref={titleRef}
        aria-label={title}
        className={`font-display text-4xl sm:text-5xl font-semibold tracking-tightest ${
          isCenter ? "mx-auto" : ""
        }`}
      >
        {title.split("").map((char, i) => (
          <span
            key={i}
            data-char
            aria-hidden="true"
            className="inline-block whitespace-pre text-ink"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>

      {description && (
        <p
          data-line
          data-reveal-delay="120"
          className={`mt-4 max-w-2xl text-base sm:text-lg text-ink-muted leading-relaxed ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
