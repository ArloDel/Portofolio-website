"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { ArrowUpRight, Github, Check } from "lucide-react";
import { PROJECTS_DATA } from "@/app/data/projects";
import { ProjectData } from "@/app/types";
import { useReveal, isReducedMotion } from "@/app/lib/motion";
import SectionHeading from "@/app/components/ui/SectionHeading";
import GlassCard from "@/app/components/ui/GlassCard";

export interface QuestLogSectionProps {
  projects?: ProjectData[];
  highlightedSkill?: string | null;
}

type FilterStatus = "ALL" | "COMPLETED" | "IN PROGRESS";

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "ALL", label: "All work" },
  { key: "COMPLETED", label: "Shipped" },
  { key: "IN PROGRESS", label: "In progress" },
];

export default function QuestLogSection({
  projects = PROJECTS_DATA,
  highlightedSkill = null,
}: QuestLogSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
  const [firstPaint, setFirstPaint] = useState(true);

  useReveal(rootRef, "[data-reveal]", { translateY: 26 });

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "ALL") return true;
    const normalizedStatus = project.status.replace("_", " ");
    return normalizedStatus === activeFilter;
  });

  // anime.js: re-stagger the grid whenever the filter changes
  useEffect(() => {
    if (firstPaint) {
      setFirstPaint(false);
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-project-card]"));
    if (isReducedMotion()) return;

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
  }, [activeFilter]);

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
          description="Production deployments, open-source tools and full-scale platforms — each one delivered end to end."
        />

        {/* Filter chips */}
        <div data-reveal className="mb-10 flex flex-wrap items-center gap-2.5">
          {FILTERS.map(({ key, label }) => {
            const count =
              key === "ALL"
                ? projects.length
                : projects.filter(
                    (p) => p.status.replace("_", " ") === key
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

        {/* Cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => {
            const isCompleted =
              project.status === "COMPLETED" ||
              (project.status as string) === "COMPLETED";
            const techStack = project.stack || project.techStack || [];
            const liveUrl =
              project.liveUrl ||
              (project.link?.startsWith("https://") &&
              !project.link.includes("github.com")
                ? project.link
                : undefined);
            const githubUrl =
              project.githubUrl ||
              (project.link?.includes("github.com")
                ? project.link
                : "https://github.com/ArloDel");
            const rank =
              project.rank ||
              (project.id === "atelier-senja"
                ? "FLAGSHIP"
                : project.id === "olympiade-app" || project.id === "comicgarage"
                ? "CLIENT"
                : "EXPERIMENT");

            return (
              <GlassCard
                key={project.id}
                as="article"
                hover
                data-project-card
                className="group flex flex-col p-6"
              >
                {/* Top meta row */}
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className={`glass-chip rounded-md px-2 py-0.5 font-mono text-[9px] tracking-widest ${
                      isCompleted ? "text-ink-muted" : "text-accent"
                    }`}
                  >
                    {rank}
                  </span>

                  <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-ink-faint">
                    {isCompleted ? (
                      <>
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success/15">
                          <Check className="h-2.5 w-2.5 text-success" strokeWidth={2.5} />
                        </span>
                        SHIPPED
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                        BUILDING
                      </>
                    )}
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
            MORE EXPERIMENTS LIVE IN THE REPOSITORY — @ARLODEL
          </p>
        </div>
      </div>
    </section>
  );
}
