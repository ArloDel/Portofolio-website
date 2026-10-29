"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import Image from "next/image";
import { ArrowUpRight, Github, Check, RefreshCw } from "lucide-react";
import {
  LIVE_PROJECTS_DATA,
  fetchLiveGithubProjects,
} from "@/app/data/projects";
import { ProjectData } from "@/app/types";
import { useReveal, isReducedMotion } from "@/app/lib/motion";
import SectionHeading from "@/app/components/ui/SectionHeading";
import GlassCard from "@/app/components/ui/GlassCard";

export interface QuestLogSectionProps {
  projects?: ProjectData[];
  highlightedSkill?: string | null;
}

type FilterCategory = "ALL" | "FLAGSHIP" | "CLIENT" | "SHIPPED";

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "ALL", label: "All live" },
  { key: "FLAGSHIP", label: "Flagship" },
  { key: "CLIENT", label: "Client" },
];

export default function QuestLogSection({
  projects,
  highlightedSkill = null,
}: QuestLogSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [liveProjects, setLiveProjects] = useState<ProjectData[]>(() =>
    (projects ?? LIVE_PROJECTS_DATA).filter((p) => Boolean(p.liveUrl && p.liveUrl.trim()))
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");
  const [firstPaint, setFirstPaint] = useState(true);

  useReveal(rootRef, "[data-reveal]", { translateY: 26 });

  // Auto-sync live repositories from GitHub (@ArloDel)
  useEffect(() => {
    if (projects) {
      setLiveProjects(projects.filter((p) => Boolean(p.liveUrl && p.liveUrl.trim())));
      return;
    }

    let cancelled = false;
    setIsSyncing(true);

    fetchLiveGithubProjects()
      .then((synced) => {
        if (!cancelled && synced.length > 0) {
          setLiveProjects(synced);
        }
      })
      .catch(() => {
        // Silently keep static LIVE_PROJECTS_DATA fallback on network/rate-limit error
      })
      .finally(() => {
        if (!cancelled) setIsSyncing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projects]);

  const filteredProjects = liveProjects.filter((project) => {
    if (activeFilter === "ALL") return true;
    return (project.rank || "SHIPPED").toUpperCase() === activeFilter;
  });

  // Dynamically include "Shipped / Other" tab if new GitHub repos with non-Flagship/Client rank arrive
  const extraShippedCount = liveProjects.filter(
    (p) => !["FLAGSHIP", "CLIENT"].includes((p.rank || "").toUpperCase())
  ).length;

  const availableFilters: { key: FilterCategory; label: string }[] =
    extraShippedCount > 0
      ? [...FILTERS, { key: "SHIPPED", label: "Open web" }]
      : FILTERS;

  // anime.js: re-stagger the grid whenever the filter or synced repo list changes
  useEffect(() => {
    if (firstPaint) {
      setFirstPaint(false);
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-project-card]"));
    if (isReducedMotion() || cards.length === 0) return;

    cards.forEach((card) => anime.set(card, { opacity: 0, translateY: 18, scale: 0.985 }));
    anime({
      targets: cards,
      translateY: [18, 0],
      scale: [0.985, 1],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 550,
      delay: anime.stagger(60),
    });
  }, [activeFilter, liveProjects.length]);

  return (
    <section
      ref={rootRef}
      id="projects"
      aria-label="Selected projects"
      className="relative w-full px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          index="02"
          kicker="SELECTED WORK"
          title="Shipped with intent."
          description="Live production deployments synced directly from GitHub — only repositories with an active web deployment appear here."
        />

        {/* Filter chips + GitHub auto-sync status */}
        <div
          data-reveal
          className="mb-10 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            {availableFilters.map(({ key, label }) => {
              const count =
                key === "ALL"
                  ? liveProjects.length
                  : liveProjects.filter(
                      (p) => (p.rank || "SHIPPED").toUpperCase() === key
                    ).length;
              const active = activeFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  className={`group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                    active
                      ? "bg-invert text-invert-ink shadow-glowSoft"
                      : "glass-chip text-ink-faint hover:text-ink hover:border-fill/20"
                  }`}
                  aria-pressed={active}
                >
                  {label}
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      active ? "text-invert-ink/60" : "text-ink-faint"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] tracking-caption text-ink-faint">
            <RefreshCw
              className={`h-3 w-3 text-accent ${isSyncing ? "animate-spin" : ""}`}
              strokeWidth={1.5}
            />
            <span>
              {isSyncing ? "SYNCING @ARLODEL..." : "AUTO-SYNCED • LIVE SITES ONLY"}
            </span>
          </div>
        </div>

        {/* Cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => {
            const techStack = project.stack || project.techStack || [];
            const liveUrl = project.liveUrl || project.link;
            const githubUrl =
              project.githubUrl || "https://github.com/ArloDel";
            const rank = project.rank || "SHIPPED";

            return (
              <GlassCard
                key={project.id}
                as="article"
                hover
                data-project-card
                className="group flex flex-col p-6"
              >
                {/* Visual Thumbnail (if available) */}
                {project.image && (
                  <div className="relative mb-5 h-44 w-full overflow-hidden rounded-xl border border-fill/[0.08] bg-fill/[0.02]">
                    <Image
                      src={project.image}
                      alt={`${project.name} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Top meta row */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="glass-chip rounded-md px-2 py-0.5 font-mono text-[9px] tracking-widest text-ink-muted">
                    {rank}
                  </span>

                  <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-ink-faint">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success/15">
                      <Check className="h-2.5 w-2.5 text-success" strokeWidth={2.5} />
                    </span>
                    LIVE
                  </span>
                </div>

                {/* Title block */}
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-hi transition-colors group-hover:text-accent">
                  {project.name}
                </h3>
                {project.subtitle && (
                  <p className="mt-1 font-mono text-[10px] tracking-caption uppercase text-ink-faint">
                    {project.subtitle}
                  </p>
                )}

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted line-clamp-3">
                  {project.description}
                </p>

                {/* Stack chips */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {techStack.map((tech) => {
                    const isHighlighted =
                      highlightedSkill &&
                      tech.toLowerCase().includes(highlightedSkill.toLowerCase());
                    return (
                      <span
                        key={tech}
                        className={`rounded-md px-2 py-0.5 font-mono text-[10px] transition-all duration-200 ${
                          isHighlighted
                            ? "bg-accent/20 text-accent-strong border border-accent/50"
                            : "bg-fill/[0.04] text-ink-faint border border-fill/[0.06]"
                        }`}
                      >
                        {tech}
                      </span>
                    );
                  })}
                </div>

                {/* Links */}
                <div className="mt-6 flex items-center justify-between border-t border-fill/[0.07] pt-4">
                  {liveUrl ? (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-accent transition-transform duration-200 hover:gap-2.5"
                    >
                      Live site
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </a>
                  ) : (
                    <span />
                  )}
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ink-faint transition-colors hover:text-ink"
                      title="View source repository"
                    >
                      <Github className="h-3.5 w-3.5" strokeWidth={1.5} />
                      REPO
                    </a>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Quiet footer note */}
        <div data-reveal className="mt-10 text-center">
          <p className="font-mono text-[10px] tracking-caption text-ink-faint">
            AUTOMATICALLY DISPLAYS @ARLODEL REPOSITORIES WITH AN ACTIVE DEPLOYMENT URL
          </p>
        </div>
      </div>
    </section>
  );
}
