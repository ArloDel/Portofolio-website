/**
 * Authoritative Test Fixtures & Specification Standards
 * Sourced directly from ORIGINAL_REQUEST.md and PROJECT.md
 */

export interface MetaphorPalette {
  bg: string;
  bgSurface: string;
  bgCard: string;
  crimson: string;
  crimsonBright: string;
  parchment: string;
  parchmentMuted: string;
  cobalt: string;
  cobaltLight: string;
  gold: string;
  goldBright: string;
  textLight: string;
  textMuted: string;
  textDark: string;
}

export const METAPHOR_THEME_TOKENS: {
  colors: MetaphorPalette;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  easing: string;
  keyframes: string[];
} = {
  colors: {
    bg: "#0d0b0a",
    bgSurface: "#14110f",
    bgCard: "#1c1815",
    crimson: "#8B1A1A",
    crimsonBright: "#C0392B",
    parchment: "#EDE0C4",
    parchmentMuted: "#D4C5A0",
    cobalt: "#1B3A5C",
    cobaltLight: "#2E6B9E",
    gold: "#B8975A",
    goldBright: "#E5C158",
    textLight: "#F5F0E8",
    textMuted: "#C2B6A3",
    textDark: "#1A1614",
  },
  fonts: {
    heading: "Cinzel",
    body: "EB Garamond",
    mono: "JetBrains Mono",
  },
  easing: "cubic-bezier(0.87, 0, 0.13, 1)",
  keyframes: [
    "pulse-ember",
    "blink-prompt",
    "draw-line",
    "stamp-reveal",
    "chronicle-slide",
  ],
};

export interface ProfileFixture {
  name: string;
  title: string;
  institution: string;
  bio: string;
  role: string;
  avatarUrl: string;
  githubUrl: string;
  stats: Array<{
    id: string;
    name: string;
    shortCode: string;
    currentValue: number;
    maxValue: number;
    gaugeColor: string;
  }>;
}

export const PROFILE_FIXTURE: ProfileFixture = {
  name: "Hakeeem",
  title: "Full-Stack Developer",
  institution: "UPN Jatim",
  bio: "Student of Information System, UPN Jatim. Freelance Developer and digital artisan.",
  role: "Freelance Developer",
  avatarUrl: "https://avatars.githubusercontent.com/u/80494993?v=4",
  githubUrl: "https://github.com/ArloDel",
  stats: [
    {
      id: "stat-frontend",
      name: "FRONTEND MASTERY",
      shortCode: "HP",
      currentValue: 94,
      maxValue: 100,
      gaugeColor: "crimson",
    },
    {
      id: "stat-backend",
      name: "SYSTEM DESIGN",
      shortCode: "MP",
      currentValue: 89,
      maxValue: 100,
      gaugeColor: "cobalt",
    },
    {
      id: "stat-problem-solving",
      name: "PROBLEM SOLVING",
      shortCode: "SP",
      currentValue: 96,
      maxValue: 100,
      gaugeColor: "gold",
    },
    {
      id: "stat-creativity",
      name: "CREATIVITY",
      shortCode: "MAG",
      currentValue: 92,
      maxValue: 100,
      gaugeColor: "emerald",
    },
  ],
};

export interface ProjectQuestFixture {
  id: string;
  name: string;
  stack: string[];
  link: string;
  status: "COMPLETED" | "IN PROGRESS";
  statusBadge: string;
  description: string;
}

export const PROJECTS_FIXTURE: ProjectQuestFixture[] = [
  {
    id: "atelier-senja",
    name: "Atelier-Senja",
    stack: ["TypeScript", "Next.js"],
    link: "https://atelier-senja.vercel.app",
    status: "COMPLETED",
    statusBadge: "COMPLETED ✓",
    description: "An ethereal digital atelier web application crafted with Next.js and TypeScript.",
  },
  {
    id: "olympiade-app",
    name: "olympiade-app",
    stack: ["TypeScript", "Next.js"],
    link: "https://olympiade-app-kappa.vercel.app",
    status: "COMPLETED",
    statusBadge: "COMPLETED ✓",
    description: "Academic tournament telemetry and live testing platform.",
  },
  {
    id: "arlo-clipper",
    name: "arlo-clipper",
    stack: ["JavaScript"],
    link: "https://github.com/ArloDel/arlo-clipper",
    status: "IN PROGRESS",
    statusBadge: "IN PROGRESS ⚔",
    description: "Agile markdown web clipping tool.",
  },
  {
    id: "ComicGarage",
    name: "ComicGarage",
    stack: ["PHP", "Laravel", "Filament"],
    link: "https://github.com/ArloDel/ComicGarage",
    status: "COMPLETED",
    statusBadge: "COMPLETED ✓",
    description: "Comprehensive comic archive and catalog manager.",
  },
  {
    id: "GundamBuilder",
    name: "GundamBuilder",
    stack: ["PHP"],
    link: "https://github.com/ArloDel/GundamBuilder",
    status: "COMPLETED",
    statusBadge: "COMPLETED ✓",
    description: "Custom model kit tracking and assembly planner.",
  },
];

export interface ArchetypeNodeFixture {
  id: string;
  name: string;
  category: "Mage" | "Knight" | "Commander" | "Seeker";
  tier: number;
  x: number;
  y: number;
  mastered: boolean;
}

export interface ArchetypeLinkFixture {
  source: string;
  target: string;
}

export const ARCHETYPES_FIXTURE: {
  nodes: ArchetypeNodeFixture[];
  links: ArchetypeLinkFixture[];
} = {
  nodes: [
    { id: "ts", name: "TypeScript", category: "Mage", tier: 1, x: 200, y: 150, mastered: true },
    { id: "nextjs", name: "Next.js", category: "Mage", tier: 2, x: 350, y: 120, mastered: true },
    { id: "php", name: "PHP", category: "Knight", tier: 1, x: 200, y: 280, mastered: true },
    { id: "laravel", name: "Laravel", category: "Knight", tier: 2, x: 350, y: 260, mastered: true },
    { id: "js", name: "JavaScript", category: "Seeker", tier: 1, x: 100, y: 200, mastered: true },
    { id: "docker", name: "Docker", category: "Commander", tier: 2, x: 500, y: 200, mastered: false },
    { id: "mysql", name: "MySQL", category: "Knight", tier: 2, x: 350, y: 340, mastered: true },
    { id: "figma", name: "Figma", category: "Mage", tier: 1, x: 100, y: 100, mastered: true },
    { id: "git", name: "Git", category: "Commander", tier: 1, x: 350, y: 40, mastered: true },
  ],
  links: [
    { source: "js", target: "ts" },
    { source: "ts", target: "nextjs" },
    { source: "php", target: "laravel" },
    { source: "php", target: "mysql" },
    { source: "nextjs", target: "docker" },
    { source: "laravel", target: "docker" },
    { source: "figma", target: "ts" },
    { source: "git", target: "nextjs" },
    { source: "git", target: "laravel" },
  ],
};

export interface JourneyEntryFixture {
  id: string;
  chapter: string;
  title: string;
  organization: string;
  period: string;
  role: string;
  summary: string;
}

export const JOURNEY_FIXTURE: JourneyEntryFixture[] = [
  {
    id: "journey-upn",
    chapter: "CHAPTER I",
    title: "Scholar of Information Systems",
    organization: "UPN 'Veteran' Jawa Timur",
    period: "2021 — PRESENT",
    role: "Student & Researcher",
    summary: "Dedicated study of software engineering, database architectures, and distributed systems.",
  },
  {
    id: "journey-freelance",
    chapter: "CHAPTER II",
    title: "Freelance Artisan of Code",
    organization: "Independent Digital Guild",
    period: "2023 — PRESENT",
    role: "Full-Stack Engineer",
    summary: "Architecting bespoke web applications, Laravel backends, and Next.js frontends for diverse clients.",
  },
  {
    id: "journey-opensource",
    chapter: "CHAPTER III",
    title: "Open-Source Craftsman",
    organization: "GitHub / Global Community",
    period: "2023 — PRESENT",
    role: "Contributor & Creator",
    summary: "Building open-source tools, developer utilities, and game-inspired web interfaces.",
  },
];

export const NAVIGATION_SECTIONS_FIXTURE = [
  { id: "hero", label: "TITLE", anchor: "#hero" },
  { id: "about", label: "CHARACTER", anchor: "#about" },
  { id: "projects", label: "QUEST LOG", anchor: "#projects" },
  { id: "skills", label: "ARCHETYPES", anchor: "#skills" },
  { id: "experience", label: "JOURNEY", anchor: "#experience" },
  { id: "contact", label: "ROYAL DECREE", anchor: "#contact" },
];
