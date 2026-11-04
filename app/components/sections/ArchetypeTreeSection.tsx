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

const SKILL_ICON_PATHS: Record<string, { vb: string; d: string }> = {
  "fa-solid fa-code": {
    vb: "0 0 576 512",
    d: "M360.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm64.6 136.1c-12.5 12.5-12.5 32.8 0 45.3l73.4 73.4-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0zm-274.7 0c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 150.6 182.6c12.5-12.5 12.5-32.8 0-45.3z",
  },
  "fa-solid fa-shield-halved": {
    vb: "0 0 512 512",
    d: "M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z",
  },
  "fa-brands fa-react": {
    vb: "0 0 512 512",
    d: "M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1 .9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2 .6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9-53.4 18.5-91.7 47.7-91.7 77.9 0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zM136.9 187.2c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.5-67.2 10.4-1.3-5.1-2.4-10.3-3.5-15.5-9.4-48.4-3.2-84.9 12.6-94zM115.7 320.6c-4.2-1.2-8.3-2.5-12.4-3.9-21.3-6.7-45.5-17.3-63-31.2-10.1-7-16.9-17.8-18.8-29.9 0-18.3 31.6-41.7 77.2-57.6 5.7-2 11.5-3.8 17.3-5.5 6.8 21.7 15 43 24.5 63.6-9.6 20.9-17.9 42.5-24.8 64.5zm116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3-11.1 5.3-23.9 5.8-35.3 1.3-15.9-9.2-22.5-44.5-13.5-92 1.1-5.6 2.3-11.2 3.7-16.7 22.4 4.8 45 8.1 67.9 9.8 13.2 18.7 27.7 36.6 43.2 53.4-3.2 3.1-6.4 6.1-9.6 8.9zm24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3 9.6 .4 19.5 .6 29.5 .6 10.3 0 20.4-.2 30.4-.7-9.2 12.7-19.1 24.8-29.6 36.4zm130.7 30c-.9 12.2-6.9 23.6-16.5 31.3-15.9 9.2-49.8-2.8-86.4-34.2-4.2-3.6-8.4-7.5-12.7-11.5 15.3-16.9 29.4-34.8 42.2-53.6 22.9-1.9 45.7-5.4 68.2-10.5 1 4.1 1.9 8.2 2.7 12.2 4.9 21.6 5.7 44.1 2.5 66.3zm18.2-107.5c-2.8 .9-5.6 1.8-8.5 2.6-7-21.8-15.6-43.1-25.5-63.8 9.6-20.4 17.7-41.4 24.5-62.9 5.2 1.5 10.2 3.1 15 4.7 46.6 16 79.3 39.8 79.3 58 0 19.6-34.9 44.9-84.8 61.4zM256 301.8a45.8 45.8 0 1 0 0-91.6 45.8 45.8 0 1 0 0 91.6z",
  },
  "fa-brands fa-js": {
    vb: "0 0 448 512",
    d: "M0 32l0 448 448 0 0-448-448 0zM243.8 381.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5L152 385.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5l0-143.1 42.1 0 0 143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43L301 382.1c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z",
  },
  "fa-brands fa-figma": {
    vb: "0 0 384 512",
    d: "M14 95.8C14 42.9 56.9 0 109.8 0L274.2 0c52.9 0 95.8 42.9 95.8 95.8 0 33.5-17.2 63-43.2 80.1 26 17.1 43.2 46.6 43.2 80.1 0 52.9-42.9 95.8-95.8 95.8l-2.1 0c-24.8 0-47.4-9.4-64.4-24.9l0 88.3c0 53.6-44 96.8-97.4 96.8-52.8 0-96.3-42.8-96.3-95.8 0-33.5 17.2-63 43.2-80.1-26-17.1-43.2-46.6-43.2-80.1s17.2-63 43.2-80.1C31.2 158.8 14 129.3 14 95.8zm162.3 95.8l-66.5 0c-35.6 0-64.4 28.8-64.4 64.4 0 35.4 28.6 64.2 64 64.4l66.9 0 0-128.8zM207.7 256c0 35.6 28.8 64.4 64.4 64.4l2.1 0c35.6 0 64.4-28.8 64.4-64.4s-28.8-64.4-64.4-64.4l-2.1 0c-35.6 0-64.4 28.8-64.4 64.4zm-97.9 95.8l-.4 0c-35.4 .2-64 29-64 64.4s29.2 64.4 64.9 64.4c36.3 0 66-29.4 66-65.5l0-63.4-66.5 0zm0-320.4c-35.6 0-64.4 28.8-64.4 64.4s28.8 64.4 64.4 64.4l66.5 0 0-128.8-66.5 0zm97.9 128.8l66.5 0c35.6 0 64.4-28.8 64.4-64.4s-28.8-64.4-64.4-64.4l-66.5 0 0 128.8z",
  },
  "fa-brands fa-php": {
    vb: "0 0 640 512",
    d: "M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5C148.6 407.5 16.8 335.3 16.8 256S148.7 104.5 320 104.5zm0-16.8C143.3 87.7 0 163 0 256S143.3 424.3 320 424.3 640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3l36.7 0 8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7l-70.7 0-32.7 168.7zM283.1 136.7l36.5 0-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1l-37 0c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6-36.5 0 32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3l36.8 0 8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7l-70.7 0-32.8 168.7z",
  },
  "fa-brands fa-laravel": {
    vb: "0 0 512 512",
    d: "M504.6 115.8c-.1-.2-.2-.5-.3-.7-.1-.4-.3-.8-.5-1.2-.2-.2-.3-.5-.5-.7-.2-.3-.5-.6-.7-.9-.2-.2-.5-.4-.8-.6-.3-.2-.6-.5-.9-.7L404.6 55.5c-1.2-.7-2.6-1.1-4-1.1s-2.8 .4-4 1.1L300.3 111c-.3 .2-.6 .4-.9 .7-.3 .2-.5 .4-.8 .6-.3 .3-.5 .6-.7 .9-.2 .2-.4 .4-.5 .7-.2 .4-.4 .8-.5 1.2-.1 .2-.2 .4-.3 .7-.2 .7-.3 1.4-.3 2.1l0 105.2-80.2 46.2 0-205.9c0-.7-.1-1.4-.3-2.1-.1-.2-.2-.4-.3-.7-.1-.4-.3-.8-.5-1.2-.1-.3-.4-.5-.5-.7-.2-.3-.5-.6-.7-.9-.2-.2-.5-.4-.8-.6-.3-.2-.6-.5-.9-.7L115.8 1.1c-1.2-.7-2.6-1.1-4-1.1s-2.8 .4-4 1.1L11.5 56.5c-.3 .2-.6 .4-.9 .7-.3 .2-.5 .4-.8 .6-.3 .3-.5 .6-.7 .9-.2 .3-.4 .5-.6 .7-.2 .4-.4 .8-.5 1.2-.1 .2-.2 .4-.3 .7-.2 .7-.3 1.4-.3 2.1l0 329.7c0 1.4 .4 2.8 1.1 4s1.7 2.2 2.9 2.9L204 510.9c.4 .2 .9 .4 1.3 .5 .2 .1 .4 .2 .6 .3 1.3 .4 2.8 .4 4.1 0 .2-.1 .4-.2 .6-.2 .5-.2 1-.3 1.4-.6L404.6 400.1c1.2-.7 2.2-1.7 2.9-2.9s1.1-2.6 1.1-4l0-105.3 92.2-53.1c1.2-.7 2.2-1.7 2.9-3s1.1-2.6 1.1-4l0-109.8c0-.7-.1-1.4-.2-2.1zM111.8 17.3l80.2 46.1-80.2 46.2-80.2-46.2 80.2-46.2zm88.2 60l0 201.3c-33.2 19.1-59.9 34.5-80.2 46.2l0-201.3C153 104.4 179.7 89 200 77.3zm0 412.8L23.5 388.5 23.5 77.3c20.3 11.7 47.1 27.1 80.2 46.2l0 215.2c0 .3 .1 .6 .1 .9 0 .4 .1 .8 .2 1.2 .1 .3 .2 .6 .4 .9 .1 .3 .3 .7 .4 1 .2 .3 .4 .5 .6 .8 .2 .3 .4 .6 .7 .8 .2 .2 .5 .4 .8 .6 .3 .2 .6 .5 .9 .7l92.2 52.2 .1 92.4zm8-106.2L128 338.6c54.7-31.5 113.5-65.3 176.3-101.5l80.1 46.1C355 300 296.2 333.5 208 383.9zm184.5 4.6l-176.5 101.6 0-92.3C317.4 340 376.2 306.4 392.5 297l0 91.4zm0-119.1c-20.3-11.6-47.1-27-80.2-46.1l0-91.4c20.3 11.7 47.1 27.1 80.2 46.2l0 91.3zm8-105.3l-80.2-46.2 80.2-46.2 80.2 46.1-80.2 46.2zm8 105.3l0-91.3c33.2-19.1 60-34.5 80.3-46.2l0 91.4-80.3 46.2z",
  },
  "fa-solid fa-database": {
    vb: "0 0 448 512",
    d: "M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z",
  },
  "fa-brands fa-docker": {
    vb: "0 0 640 512",
    d: "M349.9 236.3l-66.1 0 0-59.4 66.1 0 0 59.4zm0-204.3l-66.1 0 0 60.7 66.1 0 0-60.7zm78.2 144.8l-66.1 0 0 59.4 66.1 0 0-59.4zM271.8 104.7l-66.1 0 0 60.1 66.1 0 0-60.1zm78.1 0l-66.1 0 0 60.1 66.1 0 0-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7l-434.7 0c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4 .4 67.6 .1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zM115.6 176.8l-66 0 0 59.4 66.1 0 0-59.4-.1 0zm78.1 0l-66.1 0 0 59.4 66.1 0 0-59.4zm78.1 0l-66.1 0 0 59.4 66.1 0 0-59.4zm-78.1-72.1l-66.1 0 0 60.1 66.1 0 0-60.1z",
  },
  "fa-brands fa-git-alt": {
    vb: "0 0 448 512",
    d: "M439.6 236.1L244 40.5C238.6 35 231.2 32 223.6 32s-15 3-20.4 8.4l-40.7 40.6 51.5 51.5c27.1-9.1 52.7 16.8 43.4 43.7l49.7 49.7c34.2-11.8 61.2 31 35.5 56.7-26.5 26.5-70.2-2.9-56-37.3l-46.3-46.3 0 121.9c25.3 12.5 22.3 41.8 9.1 55-6.4 6.4-15.2 10.1-24.3 10.1s-17.8-3.6-24.3-10.1c-17.6-17.6-11.1-46.9 11.2-56l0-123c-20.8-8.5-24.6-30.7-18.6-45L142.6 101 8.5 235.1C3 240.6 0 247.9 0 255.5s3 15 8.5 20.4L204.1 471.6c5.4 5.4 12.7 8.4 20.4 8.4s15-3 20.4-8.4L439.6 276.9c5.4-5.4 8.4-12.8 8.4-20.4s-3-15-8.4-20.4z",
  },
  "fa-solid fa-circle": {
    vb: "0 0 512 512",
    d: "M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z",
  },
};

function SkillIcon({ name, className }: { name?: string; className?: string }) {
  const glyph = SKILL_ICON_PATHS[name ?? ""] ?? SKILL_ICON_PATHS["fa-solid fa-circle"];
  return (
    <svg
      viewBox={glyph.vb}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={glyph.d} />
    </svg>
  );
}

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
                        <SkillIcon name={node.icon} className="h-3.5 w-3.5" />
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
                  <SkillIcon name={inspectedNode?.icon} className="h-4 w-4" />
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
