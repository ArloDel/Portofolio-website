import { ProjectData } from '@/app/types';

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: "atelier-senja",
    name: "Atelier-Senja",
    rank: "FLAGSHIP",
    status: "COMPLETED",
    subtitle: "Bespoke artisan portfolio site",
    description: "A digital atelier web application built with Next.js and TypeScript, featuring refined micro-interactions, responsive typography and a measured visual system.",
    techStack: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    stack: ["TypeScript", "Next.js"],
    link: "https://atelier-senja.vercel.app",
    liveUrl: "https://atelier-senja.vercel.app",
    githubUrl: "https://github.com/ArloDel",
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
    stack: ["TypeScript", "Next.js"],
    link: "https://olympiade-app-kappa.vercel.app",
    liveUrl: "https://olympiade-app-kappa.vercel.app",
    githubUrl: "https://github.com/ArloDel",
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
