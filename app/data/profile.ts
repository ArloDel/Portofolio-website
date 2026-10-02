import { ProfileData } from '@/app/types';

export const PROFILE_DATA: ProfileData = {
  name: "Alif Nur Rahman Hakim",
  role: "Freelance Developer",
  title: "Full-Stack Developer",
  institution: "Universitas Pembangunan Nasional 'Veteran' Jawa Timur",
  bio: "Information Systems student at UPN Jatim and freelance web developer. Focused on producing clean user experiences, resilient architecture, and dependable full-stack applications.",
  avatarUrl: "https://avatars.githubusercontent.com/u/80494993?v=4",
  githubUrl: "https://github.com/ArloDel",
  location: "Surabaya, East Java, Indonesia",
  stats: [
    {
      id: "stat-frontend",
      name: "FRONTEND",
      shortCode: "FE",
      currentValue: 94,
      maxValue: 100,
      gaugeColor: "crimson",
      description: "TypeScript, Next.js, modern CSS and responsive interfaces",
      level: 94,
      maxLevel: 100,
      category: "Frontend"
    },
    {
      id: "stat-system-design",
      name: "SYSTEM DESIGN",
      shortCode: "BE",
      currentValue: 89,
      maxValue: 100,
      gaugeColor: "cobalt",
      description: "PHP, Laravel, Filament, MySQL and relational database schemas",
      level: 89,
      maxLevel: 100,
      category: "Backend"
    },
    {
      id: "stat-problem-solving",
      name: "PROBLEM SOLVING",
      shortCode: "PS",
      currentValue: 96,
      maxValue: 100,
      gaugeColor: "gold",
      description: "Algorithmic thinking, root-cause analysis and fast prototyping",
      level: 96,
      maxLevel: 100,
      category: "Core"
    },
    {
      id: "stat-creativity",
      name: "CREATIVITY",
      shortCode: "CX",
      currentValue: 92,
      maxValue: 100,
      gaugeColor: "emerald",
      description: "Minimal UI design, Figma layouts and refined micro-interactions",
      level: 92,
      maxLevel: 100,
      category: "Design"
    }
  ],
  traits: [
    {
      name: "Clean Code",
      effect: "Prioritizes strict type safety and a tidy, maintainable codebase.",
      icon: "◆"
    },
    {
      name: "Full-Stack Versatility",
      effect: "Comfortable building with both Next.js and Laravel ecosystems.",
      icon: "◆"
    },
    {
      name: "Design Attention",
      effect: "Careful about spacing, typography and detail in every interface.",
      icon: "◆"
    }
  ]
};
