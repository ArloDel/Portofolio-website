"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import Image from "next/image";
import { Github, GraduationCap, MapPin } from "lucide-react";
import { PROFILE_DATA } from "@/app/data/profile";
import { ProfileData } from "@/app/types";
import { useReveal, isReducedMotion } from "@/app/lib/motion";
import SectionHeading from "@/app/components/ui/SectionHeading";
import GlassCard from "@/app/components/ui/GlassCard";

interface ProfileSectionProps {
  profile?: ProfileData;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile = PROFILE_DATA,
}) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const barsRef = useRef<HTMLDivElement | null>(null);
  const [imageError, setImageError] = React.useState(false);

  useReveal(rootRef, "[data-reveal]", { translateY: 24 });

  // anime.js: stat bars sweep in + numbers count up when the gauge panel shows
  useEffect(() => {
    const root = barsRef.current;
    if (!root) return;

    const bars = Array.from(root.querySelectorAll<HTMLElement>("[data-bar-fill]"));
    const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-bar-count]"));
    const targets = PROFILE_DATA.stats.map((s) => (s.currentValue / s.maxValue) * 100);

    if (isReducedMotion()) {
      bars.forEach((bar, i) => {
        bar.style.width = `${targets[i]}%`;
      });
      return;
    }

    anime.set(bars, { width: 0 });
    counters.forEach((counter) => {
      counter.textContent = "0";
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        anime({
          targets: bars,
          width: targets.map((t) => `${t}%`),
          easing: "easeOutExpo",
          duration: 1600,
          delay: anime.stagger(120),
        });

        counters.forEach((counter, i) => {
          const bag = { value: 0 };
          const target = PROFILE_DATA.stats[i].currentValue;
          anime({
            targets: bag,
            value: target,
            round: 1,
            easing: "easeOutExpo",
            duration: 1600,
            delay: 120 * i,
            update: () => {
              counter.textContent = String(bag.value);
            },
          });
        });
        io.disconnect();
      },
      { threshold: 0.3 }
    );

    io.observe(root);
    return () => {
      io.disconnect();
      anime.remove(bars);
    };
  }, [profile.stats]);

  return (
    <section
      ref={rootRef}
      id="about"
      aria-label="About"
      className="relative w-full px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeading
          index="01"
          kicker="ABOUT"
          title="Quiet ambition, sharp code."
          description="Information Systems student and freelance full-stack developer — building precise interfaces and resilient systems for real products."
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Identity card */}
          <GlassCard className="p-7 lg:col-span-5">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div
                data-reveal
                className="relative mb-6 h-28 w-28 overflow-hidden rounded-2xl border border-fill/10 bg-surface"
              >
                {!imageError ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={`${profile.name}'s portrait`}
                    fill
                    sizes="112px"
                    className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-4xl font-bold text-accent">
                    H
                  </div>
                )}
              </div>

              <h3 data-reveal className="font-display text-2xl font-semibold tracking-tight text-ink-hi">
                {profile.name}
              </h3>
              <p data-reveal data-reveal-delay="80" className="mt-1 font-mono text-[10px] tracking-caption text-accent">
                {profile.role.toUpperCase()} — FULL-STACK
              </p>

              <div data-reveal data-reveal-delay="140" className="mt-6 w-full flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3 text-ink-muted">
                  <GraduationCap className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
                  <span>Information Systems, UPN “Veteran” Jatim</span>
                </div>
                <div className="flex items-center gap-3 text-ink-muted">
                  <MapPin className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
                  <span>Surabaya, East Java, Indonesia — UTC+7</span>
                </div>
              </div>

              <div data-reveal data-reveal-delay="200" className="mt-6 w-full">
                <div className="hairline mb-5" aria-hidden="true" />
                <div className="mb-3 font-mono text-[10px] tracking-caption text-ink-faint">
                  CORE STACK
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "PHP", "Laravel", "MySQL", "Docker"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="glass-chip rounded-lg px-2.5 py-1 font-mono text-[11px] text-ink-muted"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                data-reveal-delay="260"
                className="glass-chip group mt-7 flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors hover:border-accent/40"
              >
                <span className="flex items-center gap-2.5 text-sm text-ink-muted transition-colors group-hover:text-ink">
                  <Github className="h-4 w-4" strokeWidth={1.5} />
                  @ArloDel
                </span>
                <span className="font-mono text-[10px] text-ink-faint transition-colors group-hover:text-accent">
                  VIEW ↗
                </span>
              </a>
            </div>
          </GlassCard>

          {/* Telemetry column */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            <GlassCard className="p-7" hover>
              <div data-reveal>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink-hi">
                    Stack proficiency
                  </h3>
                  <span className="font-mono text-[10px] tracking-caption text-ink-faint">
                    SELF-ASSESSED
                  </span>
                </div>
                <div className="hairline mt-5 mb-6" aria-hidden="true" />
              </div>

              {/* Animated gauges (anime.js) */}
              <div ref={barsRef} className="flex flex-col gap-7">
                {profile.stats.map((stat) => (
                  <div key={stat.id} data-reveal>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] tracking-widest text-accent">
                          {stat.shortCode}
                        </span>
                        <span className="font-display text-sm font-medium tracking-wide text-ink">
                          {stat.name}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-ink-muted tabular-nums">
                        <span data-bar-count data-value={stat.currentValue}>
                          {stat.currentValue}
                        </span>
                        <span className="text-ink-faint"> / {stat.maxValue}</span>
                      </div>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-fill/[0.07]">
                      <div
                        data-bar-fill
                        className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent shadow-glowSoft"
                        style={{ width: `${(stat.currentValue / stat.maxValue) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Bio card */}
            <GlassCard className="p-7" hover>
              <div data-reveal className="mb-1 font-mono text-[10px] tracking-caption text-accent">
                PROFILE
              </div>
              <div data-reveal data-reveal-delay="80">
                <h4 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink-hi">
                  From coursework to production.
                </h4>
              </div>
              <p data-reveal data-reveal-delay="140" className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                {profile.bio}
              </p>
              <div data-reveal data-reveal-delay="200" className="mt-6 flex flex-wrap gap-2">
                {(profile.traits ?? []).map((trait) => (
                  <span
                    key={trait.name}
                    title={trait.effect}
                    className="glass-chip rounded-lg px-2.5 py-1 font-mono text-[10px] tracking-wider text-ink-muted"
                  >
                    {trait.name}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
