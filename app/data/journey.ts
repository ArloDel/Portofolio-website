import { JourneyEntry } from '@/app/types';

export const JOURNEY_DATA: JourneyEntry[] = [
  {
    id: "chapter-academic",
    period: "2021 — Present",
    title: "Academic foundations",
    role: "Undergraduate Student",
    organization: "UPN 'Veteran' Jawa Timur",
    location: "Surabaya, Indonesia",
    summary: "Studying information systems with a focus on software engineering practice, database design and algorithmic problem solving.",
    achievements: [
      "Built a solid grounding in computer science and software engineering fundamentals.",
      "Shipped the Olympiade competition platform used for real academic events.",
      "Maintained strong academic standing while also working on commercial contracts."
    ],
    technologies: ["Database Systems", "Software Engineering", "Algorithms", "PHP", "TypeScript"]
  },
  {
    id: "chapter-freelance",
    period: "2022 — Present",
    title: "Freelance engineering practice",
    role: "Full-Stack Developer",
    organization: "Independent Contractor",
    location: "Remote / Worldwide",
    summary: "Running an independent freelance practice delivering full-stack web applications, custom CMS dashboards and high-conversion client projects.",
    achievements: [
      "Architected and deployed Atelier-Senja with Next.js.",
      "Built inventory and storefront platforms with Laravel and Filament.",
      "Delivered precise, responsive interfaces across commercial and consumer products."
    ],
    technologies: ["Next.js", "Laravel", "Filament", "Tailwind CSS", "MySQL", "Vercel"]
  },
  {
    id: "chapter-opensource",
    period: "2023 — Present",
    title: "Open-source contributions",
    role: "Open-Source Developer",
    organization: "GitHub (@ArloDel)",
    location: "Global",
    summary: "Building public developer tools and small simulators, and contributing useful utilities back to the community.",
    achievements: [
      "Engineered the GundamBuilder configuration simulator.",
      "Developing arlo-clipper for web content clipping and documentation.",
      "Keeping a clean git history, readable code and reproducible builds on every repository."
    ],
    technologies: ["JavaScript", "Node.js", "Git", "GitHub Actions"]
  }
];
