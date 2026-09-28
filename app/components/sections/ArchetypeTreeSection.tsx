"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { Zap, Star } from "lucide-react";
import { ARCHETYPES_DATA } from "@/app/data/archetypes";
import { ArchetypeNode, ArchetypeLink, ArchetypeCategory } from "@/app/types";
import { useReveal, isReducedMotion } from "@/app/lib/motion";
import SectionHeading from "@/app/components/ui/SectionHeading";
import GlassCard from "@/app/components/ui/GlassCard";

export interface ArchetypeTreeSectionProps {
  nodes?: ArchetypeNode[];
  links?: ArchetypeLink[];
  onSelectSkill?: (skillName: string | null) => void;
}

type CategoryFilter = "ALL" | "MAGE" | "KNIGHT" | "COMMANDER";

function normalizeCategory(
  category: ArchetypeCategory | string
): "Mage" | "Knight" | "Commander" | "Seeker" {
  const cat = (category || "").toLowerCase();
  if (cat.includes("mage") || cat.includes("front")) return "Mage";
  if (cat.includes("knight") || cat.includes("back")) return "Knight";
  if (cat.includes("commander") || cat.includes("devops")) return "Commander";
  return "Seeker";
}

const CATEGORY_LABEL: Record<string, string> = {
  all: "All",
  mage: "Frontend",
  knight: "Backend",
  commander: "DevOps",
  seeker: "Core",
};

export default function ArchetypeTreeSection({
  nodes = ARCHETYPES_DATA.nodes,
  links = ARCHETYPES_DATA.links,
  onSelectSkill,
}: ArchetypeTreeSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const svgRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const initialNode = nodes.find((n) => n.id === "seeker") || nodes[0] || null;
  const [selectedNode, setSelectedNode] = useState<ArchetypeNode | null>(initialNode);
  const [hoveredNode, setHoveredNode] = useState<ArchetypeNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("ALL");
  const [inViewport, setInViewport] = useState(false);

  const inspectedNode = hoveredNode || selectedNode || nodes[0];

  useReveal(rootRef, "[data-reveal]", { translateY: 24 });

  // Watch the SVG container so the constellation draws itself once on entry
  useEffect(() => {
    const container = svgRef.current;
    if (!container) return;

    if (isReducedMotion()) {
      setInViewport(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInViewport(true);
      },
      { threshold: 0.2 }
    );
    io.observe(container);
    return () => io.disconnect();
  }, []);

  // anime.js: draw lines + pop nodes & icons in staggered
  useEffect(() => {
    const container = svgRef.current;
    if (!container || !inViewport || isReducedMotion()) return;

    const lines = Array.from(container.querySelectorAll<SVGLineElement>(".tree-line"));
    const nodes = Array.from(container.querySelectorAll<SVGGElement>(".tree-node"));
    const icons = Array.from(container.querySelectorAll<HTMLElement>(".node-fa"));

    anime.set(lines, { strokeDashoffset: anime.setDashoffset });
    anime({
      targets: lines,
      strokeDashoffset: 0,
      easing: "easeInOutSine",
      duration: 1500,
      delay: anime.stagger(90),
    });

    anime.set(nodes, { opacity: 0, scale: 0.55 });
    anime({
      targets: nodes,
      scale: [0.55, 1],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 700,
      delay: anime.stagger(60, { start: 200 }),
    });

    if (icons.length > 0) {
      anime.set(icons, { opacity: 0, scale: 0.4 });
      anime({
        targets: icons,
        scale: [0.4, 1],
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 700,
        delay: anime.stagger(60, { start: 380 }),
      });
    }
  }, [inViewport]);

  // anime.js: soft transition of the inspection card on node change
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || isReducedMotion()) return;

    anime.set(panel, { opacity: 0, translateY: 12 });
    anime({
      targets: panel,
      translateY: [12, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 480,
    });
  }, [inspectedNode?.id]);

  // anime.js: mastery bar sweeps on node change
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || isReducedMotion()) return;
    const pct = Math.min(
      100,
      ((inspectedNode?.level ?? 0) / (inspectedNode?.maxLevel ?? 10)) * 100
    );
    anime({
      targets: bar,
      width: ["25%", `${pct}%`],
      easing: "easeOutExpo",
      duration: 1200,
    });
  }, [inspectedNode]);

  const handleNodeClick = (node: ArchetypeNode) => {
    setSelectedNode(node);
    onSelectSkill?.(node.name);
  };

  const handleNodeHover = (node: ArchetypeNode | null) => {
    setHoveredNode(node);
    if (node) onSelectSkill?.(node.name);
  };

  const isLinkConnected = (link: ArchetypeLink) => {
    if (!inspectedNode) return false;
    const sourceId = link.source || link.sourceId;
    const targetId = link.target || link.targetId;
    return sourceId === inspectedNode.id || targetId === inspectedNode.id;
  };

  const isNodeVisibleInFilter = (node: ArchetypeNode) => {
    if (activeFilter === "ALL") return true;
    return normalizeCategory(node.category).toUpperCase() === activeFilter;
  };

  const getNodePos = (node: ArchetypeNode) => ({
    x: node.x ?? 400,
    y: node.y ?? 250,
  });

  const inspectedCategory = inspectedNode
    ? normalizeCategory(inspectedNode.category)
    : "Seeker";
  const inspectedLevel = inspectedNode?.level ?? 0;
  const inspectedMaxLevel = inspectedNode?.maxLevel ?? 10;
  const inspectedSkills = inspectedNode?.skills || ["Core proficiency"];
  const inspectedPassive = inspectedNode?.passiveBonus || "—";
  const inspectedDesc =
    inspectedNode?.description || "Select any constellation node.";

  return (
    <section
      ref={rootRef}
      id="skills"
      aria-label="Skills"
      className="relative w-full px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          index="03"
          kicker="SKILLS"
          title="Skills, mapped honestly."
          description="An interactive graph of my technical stack — hover or tap any node to see proficiency and related skills."
        />

        {/* Filter chips */}
        <div data-reveal className="mb-10 flex flex-wrap items-center gap-2.5">
          {(["ALL", "MAGE", "KNIGHT", "COMMANDER"] as CategoryFilter[]).map(
            (cat) => {
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                    active
                      ? "bg-invert text-invert-ink shadow-glowSoft"
                      : "glass-chip text-ink-faint hover:text-ink hover:border-fill/20"
                  }`}
                >
                  {CATEGORY_LABEL[cat.toLowerCase()]}
                </button>
              );
            }
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Constellation canvas */}
          <GlassCard className="relative overflow-hidden p-5 sm:p-6 lg:col-span-7" data-reveal>
            <div
              className="mb-4 flex items-center justify-between border-b border-fill/[0.07] pb-3"
              aria-hidden="true"
            >
              <span className="font-mono text-[10px] tracking-caption text-ink-faint">
                SKILL GRAPH
              </span>
              <span className="font-mono text-[10px] tracking-caption text-ink-faint italic">
                HOVER / TAP FOR DETAILS
              </span>
            </div>

            <div ref={svgRef} className="relative w-full" style={{ aspectRatio: "8 / 5" }}>
              <svg
                viewBox="0 0 800 500"
                className="h-full w-full select-none"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Interactive skill graph"
              >
                {/* Faint radial guide rings */}
                <g aria-hidden="true">
                  <circle
                    cx="400"
                    cy="250"
                    r="220"
                    fill="none"
                    style={{ stroke: "rgb(var(--fill) / 0.10)" }}
                    strokeWidth="0.6"
                    strokeDasharray="2 6"
                  />
                  <circle
                    cx="400"
                    cy="250"
                    r="140"
                    fill="none"
                    style={{ stroke: "rgb(var(--fill) / 0.10)" }}
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="250"
                    x2="800"
                    y2="250"
                    style={{ stroke: "rgb(var(--fill) / 0.10)" }}
                    strokeWidth="0.5"
                  />
                </g>

                {/* Links */}
                <g className="links-layer">
                  {links.map((link, idx) => {
                    const sourceId = (link.source || link.sourceId) as string;
                    const targetId = (link.target || link.targetId) as string;
                    const sourceNode = nodes.find((n) => n.id === sourceId);
                    const targetNode = nodes.find((n) => n.id === targetId);
                    if (!sourceNode || !targetNode) return null;

                    const sPos = getNodePos(sourceNode);
                    const tPos = getNodePos(targetNode);
                    const isConnected = isLinkConnected(link);
                    const sourceVisible = isNodeVisibleInFilter(sourceNode);
                    const targetVisible = isNodeVisibleInFilter(targetNode);
                    const isDimmed =
                      activeFilter !== "ALL" && (!sourceVisible || !targetVisible);

                    return (
                      <line
                        key={`link-${idx}`}
                        className="tree-line"
                        x1={sPos.x}
                        y1={sPos.y}
                        x2={tPos.x}
                        y2={tPos.y}
                        strokeWidth={isConnected ? 1.4 : 1}
                        strokeOpacity={isDimmed ? 0.25 : isConnected ? 0.8 : 1}
                        style={{
                          stroke: isConnected
                            ? "rgb(var(--accent))"
                            : "rgb(var(--fill) / 0.10)",
                        }}
                      />
                    );
                  })}
                </g>

                {/* Nodes */}
                <g className="nodes-layer">
                  {nodes.map((node) => {
                    const pos = getNodePos(node);
                    const isSelected = selectedNode?.id === node.id;
                    const isHovered = hoveredNode?.id === node.id;
                    const isInspected = isSelected || isHovered;
                    const isVisibleInFilter = isNodeVisibleInFilter(node);
                    const category = normalizeCategory(node.category);

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${pos.x} ${pos.y})`}
                        onMouseEnter={() => handleNodeHover(node)}
                        onMouseLeave={() => handleNodeHover(null)}
                        onFocus={() => handleNodeHover(node)}
                        onBlur={() => handleNodeHover(null)}
                        onClick={() => handleNodeClick(node)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${node.name} — ${category}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleNodeClick(node);
                          }
                        }}
                        className="cursor-pointer focus:outline-none"
                        style={{ opacity: isVisibleInFilter ? 1 : 0.2, transition: "opacity 0.3s ease" }}
                      >
                        {/* inner group scales via anime.js; outer keeps the translate */}
                        <g
                          className="tree-node"
                          style={{
                            transformBox: "fill-box",
                            transformOrigin: "center",
                          }}
                        >
                          {/* hit area */}
                          <circle r="40" fill="transparent" className="focus:ring-2 focus:ring-accent" />
                          {isInspected && (
                            <circle
                              r="28"
                              fill="none"
                              strokeWidth="0.8"
                              strokeDasharray="3 4"
                              style={{ stroke: "rgb(var(--accent))" }}
                            />
                          )}
                          {/* node disk: --invert => white in dark mode, ink in light mode */}
                          <circle
                            r={isInspected ? 19 : 16}
                            strokeWidth={isInspected ? 1.6 : 1}
                            style={{
                              fill: "rgb(var(--invert))",
                              stroke: isInspected
                                ? "rgb(var(--accent))"
                                : "rgb(var(--fill) / 0.18)",
                              transition: "all 0.25s ease",
                            }}
                          />
                          <circle
                            r="19"
                            style={{
                              fill: isInspected
                                ? "rgb(var(--accent) / 0.12)"
                                : "transparent",
                              transition: "fill 0.25s ease",
                            }}
                          />
                          <text
                            x="0"
                            y="36"
                            textAnchor="middle"
                            fontSize="10"
                            className="pointer-events-none select-none font-mono"
                            style={{
                              fill: isInspected
                                ? "rgb(var(--accent))"
                                : "rgb(var(--ink) / 0.55)",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {node.name.toUpperCase()}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Font Awesome skill icons — HTML overlay mapped 1:1 onto the
                  SVG viewBox (container keeps the same 8:5 aspect ratio) */}
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNode?.id === node.id;
                  const isInspected = isSelected || isHovered;
                  const isVisibleInFilter = isNodeVisibleInFilter(node);
                  return (
                    <span
                      key={node.id}
                      className="absolute z-10"
                      style={{
                        left: `${(node.x ?? 400) / 8}%`,
                        top: `${(node.y ?? 250) / 5}%`,
                        transform: "translate(-50%, -50%)",
                        opacity: isVisibleInFilter ? 1 : 0.2,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <span
                        className="node-fa flex h-6 w-6 items-center justify-center"
                        style={{
                          color: isInspected
                            ? "rgb(var(--accent))"
                            : "rgb(var(--ink) / 0.8)",
                        }}
                      >
                        <i
                          className={`${node.icon} text-sm`}
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          {/* Inspection card */}
          <GlassCard className="p-6 sm:p-7 lg:col-span-5" hover data-reveal data-reveal-delay="120">
            <div ref={panelRef}>
              <div className="flex items-center justify-between">
                <span className="glass-chip rounded-md px-2.5 py-1 font-mono text-[9px] tracking-widest text-accent">
                  {CATEGORY_LABEL[inspectedCategory.toLowerCase()]}
                </span>
                <span className="font-mono text-[10px] tracking-caption text-ink-faint">
                  NODE {(inspectedNode?.tier ?? 1) > 2 ? "3" : `${inspectedNode?.tier ?? 1}`}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-fill/[0.08] bg-fill/[0.04]"
                  style={{ color: "rgb(var(--accent))" }}
                >
                  <i className={`${inspectedNode?.icon ?? "fa-solid fa-circle"} text-base`} aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-hi">
                  {inspectedNode?.name ?? "—"}
                </h3>
              </div>
              <p className="mt-1 font-mono text-[10px] tracking-caption text-ink-faint uppercase">
                {CATEGORY_LABEL[inspectedCategory.toLowerCase()]} track
              </p>

              <div className="hairline my-5" aria-hidden="true" />

              {/* Proficiency bar */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-widest">
                  <span className="text-ink-faint">PROFICIENCY</span>
                  <span className="text-ink-muted tabular-nums">
                    {inspectedLevel}/{inspectedMaxLevel}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-fill/[0.07]">
                  <div
                    ref={barRef}
                    className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                    style={{
                      width: `${Math.min(100, (inspectedLevel / inspectedMaxLevel) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-sm leading-relaxed text-ink-muted">{inspectedDesc}</p>

              {/* Key strength */}
              <div className="glass-soft mt-5 flex items-center gap-2.5 rounded-xl px-3.5 py-3">
                <Zap className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.5} />
                <span className="text-xs text-ink-muted">{inspectedPassive}</span>
              </div>

              {/* Related skills */}
              <div className="mt-5 mb-6">
                <div className="mb-2.5 font-mono text-[10px] tracking-caption text-ink-faint">
                  RELATED SKILLS
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="glass-chip rounded-lg px-2.5 py-1 font-mono text-[10px] text-ink-muted"
                      data-selected-skill={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-fill/[0.07] pt-4">
                <div className="flex items-center gap-2">
                  <Star
                    className={`h-3.5 w-3.5 ${inspectedNode?.mastered ? "text-success" : "text-ink-faint"}`}
                    fill={inspectedNode?.mastered ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                  <span className="text-xs text-ink-muted">
                    {inspectedNode?.mastered ? "Proficient" : "Learning"}
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-caption text-ink-faint">
                  {inspectedNode?.mastered ? "100%" : "GROWING"}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
