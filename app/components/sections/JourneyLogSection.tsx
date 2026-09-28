"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { JOURNEY_DATA } from "@/app/data/journey";
import { JourneyEntry } from "@/app/types";
import { useReveal, isReducedMotion } from "@/app/lib/motion";
import SectionHeading from "@/app/components/ui/SectionHeading";
import GlassCard from "@/app/components/ui/GlassCard";
import { ArrowUpRight } from "lucide-react";

interface JourneyLogSectionProps {
  entries?: JourneyEntry[];
}

export default function JourneyLogSection({
  entries = JOURNEY_DATA,
}: JourneyLogSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  useReveal(rootRef, "[data-reveal]", { translateY: 26 });

  // anime.js: timeline spine draws downward when the section enters
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || isReducedMotion()) return;

    anime.set(rail, { scaleY: 0 });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        anime({
          targets: rail,
          scaleY: [0, 1],
          easing: "easeInOutExpo",
          duration: 2200,
        });
        io.disconnect();
      },
      { threshold: 0.05 }
    );
    io.observe(rail);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="experience"
      aria-label="Experience"
      className="relative w-full px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeading
          index="04"
          kicker="JOURNEY"
          title="Where I've been."
          description="Academic foundations, freelance practice and open-source work — step by step."
        />

        <div className="relative">
          {/* Timeline spine */}
          <div
            className="absolute left-[7px] top-2 bottom-8 w-px bg-fill/[0.1] md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          >
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-gradient-to-b from-accent/70 via-fill/[0.12] to-fill/[0.04]"
            />
          </div>

          <div className="flex flex-col gap-10 sm:gap-14">
            {entries.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  data-reveal
                  data-reveal-delay={index * 100}
                  className={`relative flex flex-col pl-10 md:flex-row md:pl-0 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Node */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-2 md:left-1/2 md:-translate-x-1/2"
                  >
                    <span className="block h-[15px] w-[15px] rounded-full border border-accent/40 bg-canvas">
                      <span className="m-[3px] block h-[7px] w-[7px] rounded-full bg-accent/80" />
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className={`w-full md:w-[calc(50%-2.5rem)] ${
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <GlassCard hover className="group p-6 sm:p-7">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="glass-chip rounded-md px-2 py-0.5 font-mono text-[9px] tracking-widest text-accent">
                          {item.period}
                        </span>
                        <span className="font-mono text-[9px] tracking-caption text-ink-faint">
                          {item.role.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink-hi transition-colors group-hover:text-accent">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
                        <span className="font-medium text-ink">{item.role}</span>
                        <span className="text-ink-faint">—</span>
                        <span className="text-accent">{item.organization}</span>
                        {item.location && (
                          <>
                            <span className="text-ink-faint">—</span>
                            <span className="text-xs font-mono text-ink-faint">
                              {item.location}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                        {item.summary}
                      </p>

                      {item.achievements && item.achievements.length > 0 && (
                        <ul className="mt-5 space-y-2">
                          {item.achievements.map((achievement, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-muted sm:text-sm"
                            >
                              <span
                                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent"
                                aria-hidden="true"
                              />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.technologies && item.technologies.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-fill/[0.07] pt-4">
                          {item.technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="glass-chip rounded-md px-2 py-0.5 font-mono text-[10px] text-ink-faint"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  </div>

                  {/* Empty twin column keeps alternating layout honest */}
                  <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>

          {/* End note */}
          <div data-reveal className="mt-16 text-center">
            <p className="font-mono text-[10px] tracking-caption text-ink-faint">
              EXPERIENCE LOG — OPEN TO OPPORTUNITIES
            </p>
            <a
              href="https://github.com/ArloDel"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-accent"
            >
              Follow the repository
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
