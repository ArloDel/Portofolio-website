import { ProjectData } from '@/app/types';

export const GITHUB_USERNAME = "ArloDel";

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: "atelier-senja",
    name: "Atelier-Senja",
    rank: "FLAGSHIP",
    status: "COMPLETED",
    subtitle: "Bespoke artisan portfolio site",
    description: "A digital atelier web application built with Next.js and TypeScript, featuring refined micro-interactions, responsive typography and a measured visual system.",
    techStack: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    stack: ["TypeScript", "Next.js", "Tailwind CSS"],
    link: "https://atelier-senja.vercel.app",
    liveUrl: "https://atelier-senja.vercel.app",
    githubUrl: "https://github.com/ArloDel/Atelier-Senja",
    completedYear: "2024"
  },
  {
    id: "olympiade-app",
    name: "olympiade-app",
    rank: "CLIENT",
    status: "COMPLETED",
    subtitle: "Academic competition platform",
    description: "A competitive academic platform delivering exam sessions, live scoring and results tracking for school-level tournament events.",
    techStack: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
    stack: ["TypeScript", "Next.js", "Tailwind CSS"],
    link: "https://olympiade-app-kappa.vercel.app",
    liveUrl: "https://olympiade-app-kappa.vercel.app",
    githubUrl: "https://github.com/ArloDel/olympiade-app",
    completedYear: "2024"
  },
  {
    id: "arlo-clipper",
    name: "arlo-clipper",
    rank: "EXPERIMENT",
    status: "IN PROGRESS",
    subtitle: "Web clipping & archiving CLI",
    description: "A JavaScript CLI utility for parsing, clipping and archiving web content directly into structured markdown notes.",
    techStack: ["JavaScript", "Node.js", "CLI", "Cheerio"],
    stack: ["JavaScript"],
    link: "https://github.com/ArloDel/arlo-clipper",
    liveUrl: undefined,
    githubUrl: "https://github.com/ArloDel/arlo-clipper",
    completedYear: "Active"
  },
  {
    id: "comicgarage",
    name: "ComicGarage",
    rank: "CLIENT",
    status: "COMPLETED",
    subtitle: "Comic inventory & store platform",
    description: "An inventory and storefront platform for comic collections, engineered with PHP, Laravel and a Filament admin panel for catalog management.",
    techStack: ["PHP", "Laravel", "Filament", "MySQL", "Tailwind CSS"],
    stack: ["PHP", "Laravel", "Filament"],
    link: "https://github.com/ArloDel/ComicGarage",
    liveUrl: undefined,
    githubUrl: "https://github.com/ArloDel/ComicGarage",
    completedYear: "2023"
  },
  {
    id: "gundambuilder",
    name: "GundamBuilder",
    rank: "EXPERIMENT",
    status: "COMPLETED",
    subtitle: "Gunpla configuration simulator",
    description: "An interactive simulator for designing, configuring and cataloging modular Gunpla builds.",
    techStack: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    stack: ["PHP"],
    link: "https://github.com/ArloDel/GundamBuilder",
    liveUrl: undefined,
    githubUrl: "https://github.com/ArloDel/GundamBuilder",
    completedYear: "2023"
  }
];

/** Initial static list containing only projects with an active live website */
export const LIVE_PROJECTS_DATA: ProjectData[] = PROJECTS_DATA.filter((p) =>
  Boolean(p.liveUrl && p.liveUrl.trim())
);

interface GithubRepoResponse {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

const TOPIC_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  "next-js": "Next.js",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tailwindcss: "Tailwind CSS",
  tailwind: "Tailwind CSS",
  reactjs: "React",
  react: "React",
  laravel: "Laravel",
  php: "PHP",
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  prisma: "Prisma",
  supabase: "Supabase",
  Docker: "Docker",
  docker: "Docker",
  filament: "Filament",
  nodejs: "Node.js",
};

function normalizeLiveUrl(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  if (withProtocol.includes("github.com/")) return undefined;
  return withProtocol;
}

function buildStackFromRepo(repo: GithubRepoResponse, fallback?: string[]): string[] {
  const items = new Set<string>();
  if (repo.language) {
    items.add(TOPIC_LABELS[repo.language.toLowerCase()] || repo.language);
  }
  (repo.topics || []).forEach((t) => {
    const clean = t.toLowerCase();
    if (clean === "portfolio" || clean === "client" || clean === "flagship") return;
    items.add(TOPIC_LABELS[clean] || t);
  });
  if (items.size === 0 && fallback && fallback.length > 0) {
    return fallback;
  }
  return Array.from(items).slice(0, 5);
}

/**
 * Fetches public repositories for @ArloDel and returns ONLY projects
 * that have an active live website (`homepage` URL on GitHub or curated `liveUrl`).
 */
export async function fetchLiveGithubProjects(
  username: string = GITHUB_USERNAME
): Promise<ProjectData[]> {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API responded with ${res.status}`);
  }

  const repos: GithubRepoResponse[] = await res.json();
  const curatedByKey = new Map<string, ProjectData>();
  PROJECTS_DATA.forEach((p) => {
    curatedByKey.set(p.id.toLowerCase(), p);
    curatedByKey.set(p.name.toLowerCase(), p);
  });

  const syncedMap = new Map<string, ProjectData>();

  // 1. Seed with curated projects that already have a known liveUrl
  LIVE_PROJECTS_DATA.forEach((p) => {
    syncedMap.set(p.name.toLowerCase(), { ...p });
  });

  // 2. Merge / append all non-fork GitHub repos that have a live website (`homepage`)
  for (const repo of repos) {
    if (repo.fork) continue;

    const key = repo.name.toLowerCase();
    const curated = curatedByKey.get(key);
    const liveUrl = normalizeLiveUrl(repo.homepage) || curated?.liveUrl;

    // Strictly include ONLY repositories with a live website
    if (!liveUrl) continue;

    const stack =
      curated?.stack && curated.stack.length > 0
        ? curated.stack
        : buildStackFromRepo(repo, curated?.techStack);

    const rank =
      curated?.rank ||
      (repo.topics?.includes("flagship")
        ? "FLAGSHIP"
        : repo.topics?.includes("client")
        ? "CLIENT"
        : "LIVEDEPLOYMENT");

    syncedMap.set(key, {
      id: curated?.id || key,
      name: curated?.name || repo.name,
      rank: rank === "LIVEDEPLOYMENT" ? "SHIPPED" : rank,
      status: "COMPLETED",
      subtitle:
        curated?.subtitle ||
        (repo.language ? `${repo.language} web application` : "Live web deployment"),
      description:
        curated?.description ||
        repo.description ||
        `Production web deployment for ${repo.name}.`,
      techStack: curated?.techStack || stack,
      stack,
      link: liveUrl,
      liveUrl,
      githubUrl: repo.html_url || curated?.githubUrl || `https://github.com/${username}/${repo.name}`,
      completedYear:
        curated?.completedYear ||
        (repo.pushed_at ? new Date(repo.pushed_at).getFullYear().toString() : undefined),
    });
  }

  return Array.from(syncedMap.values());
}
