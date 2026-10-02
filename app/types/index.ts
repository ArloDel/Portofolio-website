/**
 * Portfolio - Global TypeScript Type Definitions
 */

// ==========================================
// 1. Profile & Skills Types
// ==========================================

export type StatShortCode = 'FE' | 'BE' | 'PS' | 'CX';
export type GaugeColor = 'crimson' | 'cobalt' | 'gold' | 'emerald';

export interface StatGauge {
  id: string;
  name: string;
  shortCode: StatShortCode;
  currentValue: number;
  maxValue: number;
  gaugeColor: GaugeColor;
  description: string;
  level?: number;
  maxLevel?: number;
  category?: string;
}

export interface TraitPerk {
  name: string;
  effect: string;
  icon: string;
}

export interface ProfileData {
  name: string;
  bio: string;
  role: string;
  title?: string;
  level?: number;
  institution: string;
  avatarUrl: string;
  githubUrl: string;
  location?: string;
  stats: StatGauge[];
  traits?: TraitPerk[];
}

// ==========================================
// 2. Projects Types
// ==========================================

export type QuestStatus = 'COMPLETED' | 'IN PROGRESS' | 'IN_PROGRESS';
export type QuestRank = 'FLAGSHIP' | 'CLIENT' | 'EXPERIMENT' | string;

export interface ProjectData {
  id: string;
  name: string;
  rank: QuestRank;
  status: QuestStatus;
  statusLabel?: string;
  subtitle?: string;
  description: string;
  techStack: string[];
  stack?: string[];
  link?: string;
  liveUrl?: string;
  githubUrl: string;
  completedYear?: string;
}

export type ProjectQuest = ProjectData;

// ==========================================
// 3. Skill Graph Types
// ==========================================

export type ArchetypeCategory =
  | 'seeker'
  | 'mage_frontend'
  | 'knight_backend'
  | 'commander_devops'
  | 'Mage'
  | 'Knight'
  | 'Commander'
  | 'Seeker';

export interface ArchetypeNode {
  id: string;
  name: string;
  category: ArchetypeCategory;
  tier: number;
  level?: number;
  maxLevel?: number;
  x: number; // 0 - 800 normalized SVG coordinates
  y: number; // 0 - 500 normalized SVG coordinates
  icon?: string;
  title?: string;
  skills?: string[];
  passiveBonus?: string;
  description: string;
  mastered: boolean;
}

export interface ArchetypeLink {
  source: string;
  target: string;
  sourceId?: string;
  targetId?: string;
  relationship?: 'core' | 'evolution' | 'synergy' | string;
}

export interface ArchetypeGraphData {
  nodes: ArchetypeNode[];
  links: ArchetypeLink[];
}

// ==========================================
// 4. Experience Types
// ==========================================

export type JourneyCategory =
  | "work"
  | "internship"
  | "education"
  | "bootcamp"
  | "organization";

export interface JourneyEntry {
  id: string;
  period: string;
  title: string;
  role: string;
  organization: string;
  location?: string;
  summary: string;
  achievements?: string[];
  technologies?: string[];
  category?: JourneyCategory;
  categoryLabel?: string;
}

export type JourneyChapter = JourneyEntry;

// ==========================================
// 5. Contact Form Types
// ==========================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactFormData {
  submittedAt?: string;
}

// ==========================================
// 6. Navigation Types
// ==========================================

export interface NavigationItem {
  id: string;
  label: string;
  romanNumeral: string;
  iconName?: string;
  href: string;
}
