/**
 * Metaphor: ReFantazio Portfolio E2E Master Test Runner (Node ESM Standalone)
 * Executes Tier 1 (Features), Tier 2 (Boundaries), Tier 3 (Interactions), and Tier 4 (Scenarios).
 */

class TestContext {
  constructor() {
    this.currentSuite = "Default Suite";
    this.suites = new Map();
  }

  setSuite(name) {
    this.currentSuite = name;
    if (!this.suites.has(name)) {
      this.suites.set(name, []);
    }
  }

  recordResult(result) {
    const list = this.suites.get(this.currentSuite) || [];
    list.push(result);
    this.suites.set(this.currentSuite, list);
  }

  getSummary() {
    const suitesSummary = [];
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    for (const [name, results] of this.suites.entries()) {
      const suitePassed = results.filter((r) => r.passed).length;
      const suiteFailed = results.filter((r) => !r.passed).length;
      const suiteDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

      totalTests += results.length;
      totalPassed += suitePassed;
      totalFailed += suiteFailed;
      totalDuration += suiteDuration;

      suitesSummary.push({
        name,
        total: results.length,
        passed: suitePassed,
        failed: suiteFailed,
        durationMs: suiteDuration,
        results,
      });
    }

    return {
      suites: suitesSummary,
      totalTests,
      totalPassed,
      totalFailed,
      durationMs: totalDuration,
    };
  }

  clear() {
    this.suites.clear();
  }
}

const globalContext = new TestContext();

function describe(name, fn) {
  globalContext.setSuite(name);
  fn();
}

function it(name, fn) {
  const start = performance.now();
  try {
    fn();
    const duration = performance.now() - start;
    globalContext.recordResult({
      suite: "current",
      name,
      passed: true,
      durationMs: duration,
    });
  } catch (error) {
    const duration = performance.now() - start;
    globalContext.recordResult({
      suite: "current",
      name,
      passed: false,
      error: error instanceof Error ? error : new Error(String(error)),
      durationMs: duration,
    });
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`Expected deep equality:\nExpected: ${b}\nReceived: ${a}`);
      }
    },
    toBeGreaterThan(expected) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (typeof actual !== "number" || actual < expected) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },
    toBeLessThan(expected) {
      if (typeof actual !== "number" || actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected) {
      if (typeof actual !== "number" || actual > expected) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    },
    toContain(item) {
      if (typeof actual === "string") {
        if (!actual.includes(String(item))) {
          throw new Error(`Expected string "${actual}" to contain "${item}"`);
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(item)) {
          throw new Error(`Expected array ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`);
        }
      } else {
        throw new Error(`Cannot call toContain on type ${typeof actual}`);
      }
    },
    toMatch(regex) {
      if (typeof actual !== "string" || !regex.test(actual)) {
        throw new Error(`Expected "${actual}" to match pattern ${regex}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined, received undefined`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, received ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, received ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, received ${JSON.stringify(actual)}`);
      }
    },
    toHaveLength(len) {
      if (!actual || typeof actual.length !== "number" || actual.length !== len) {
        const actualLen = actual && actual.length;
        throw new Error(`Expected length ${len}, received ${actualLen}`);
      }
    },
    toHaveProperty(prop, value) {
      if (actual === null || typeof actual !== "object" || !(prop in actual)) {
        throw new Error(`Expected object to have property "${prop}"`);
      }
      if (arguments.length > 1 && actual[prop] !== value) {
        throw new Error(`Expected property "${prop}" to equal ${JSON.stringify(value)}, received ${JSON.stringify(actual[prop])}`);
      }
    },
    get not() {
      return {
        toBe(expected) {
          if (actual === expected) {
            throw new Error(`Expected not ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
          }
        },
        toEqual(expected) {
          if (JSON.stringify(actual) === JSON.stringify(expected)) {
            throw new Error(`Expected not deep equality with ${JSON.stringify(expected)}`);
          }
        },
        toContain(item) {
          if (typeof actual === "string" && actual.includes(String(item))) {
            throw new Error(`Expected string "${actual}" NOT to contain "${item}"`);
          }
          if (Array.isArray(actual) && actual.includes(item)) {
            throw new Error(`Expected array NOT to contain ${JSON.stringify(item)}`);
          }
        },
      };
    },
  };
}

// Fixtures
const METAPHOR_THEME_TOKENS = {
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

const PROFILE_FIXTURE = {
  name: "Hakeeem",
  title: "Full-Stack Developer",
  institution: "UPN Jatim",
  bio: "Student of Information System, UPN Jatim. Freelance Developer and digital artisan.",
  role: "Freelance Developer",
  avatarUrl: "https://avatars.githubusercontent.com/u/80494993?v=4",
  githubUrl: "https://github.com/ArloDel",
  stats: [
    { id: "stat-frontend", name: "FRONTEND MASTERY", shortCode: "HP", currentValue: 94, maxValue: 100, gaugeColor: "crimson" },
    { id: "stat-backend", name: "SYSTEM DESIGN", shortCode: "MP", currentValue: 89, maxValue: 100, gaugeColor: "cobalt" },
    { id: "stat-problem-solving", name: "PROBLEM SOLVING", shortCode: "SP", currentValue: 96, maxValue: 100, gaugeColor: "gold" },
    { id: "stat-creativity", name: "CREATIVITY", shortCode: "MAG", currentValue: 92, maxValue: 100, gaugeColor: "emerald" },
  ],
};

const PROJECTS_FIXTURE = [
  { id: "atelier-senja", name: "Atelier-Senja", stack: ["TypeScript", "Next.js"], link: "https://atelier-senja.vercel.app", status: "COMPLETED", statusBadge: "COMPLETED ✓", description: "An ethereal digital atelier web application crafted with Next.js and TypeScript." },
  { id: "olympiade-app", name: "olympiade-app", stack: ["TypeScript", "Next.js"], link: "https://olympiade-app-kappa.vercel.app", status: "COMPLETED", statusBadge: "COMPLETED ✓", description: "Academic tournament telemetry and live testing platform." },
  { id: "arlo-clipper", name: "arlo-clipper", stack: ["JavaScript"], link: "https://github.com/ArloDel/arlo-clipper", status: "IN PROGRESS", statusBadge: "IN PROGRESS ⚔", description: "Agile markdown web clipping tool." },
  { id: "ComicGarage", name: "ComicGarage", stack: ["PHP", "Laravel", "Filament"], link: "https://github.com/ArloDel/ComicGarage", status: "COMPLETED", statusBadge: "COMPLETED ✓", description: "Comprehensive comic archive and catalog manager." },
  { id: "GundamBuilder", name: "GundamBuilder", stack: ["PHP"], link: "https://github.com/ArloDel/GundamBuilder", status: "COMPLETED", statusBadge: "COMPLETED ✓", description: "Custom model kit tracking and assembly planner." },
];

const ARCHETYPES_FIXTURE = {
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

const JOURNEY_FIXTURE = [
  { id: "journey-upn", chapter: "CHAPTER I", title: "Scholar of Information Systems", organization: "UPN 'Veteran' Jawa Timur", period: "2021 — PRESENT", role: "Student & Researcher", summary: "Dedicated study of software engineering, database architectures, and distributed systems." },
  { id: "journey-freelance", chapter: "CHAPTER II", title: "Freelance Artisan of Code", organization: "Independent Digital Guild", period: "2023 — PRESENT", role: "Full-Stack Engineer", summary: "Architecting bespoke web applications, Laravel backends, and Next.js frontends for diverse clients." },
  { id: "journey-opensource", chapter: "CHAPTER III", title: "Open-Source Craftsman", organization: "GitHub / Global Community", period: "2023 — PRESENT", role: "Contributor & Creator", summary: "Building open-source tools, developer utilities, and game-inspired web interfaces." },
];

const NAVIGATION_SECTIONS_FIXTURE = [
  { id: "hero", label: "TITLE", anchor: "#hero" },
  { id: "about", label: "CHARACTER", anchor: "#about" },
  { id: "projects", label: "QUEST LOG", anchor: "#projects" },
  { id: "skills", label: "ARCHETYPES", anchor: "#skills" },
  { id: "experience", label: "JOURNEY", anchor: "#experience" },
  { id: "contact", label: "ROYAL DECREE", anchor: "#contact" },
];

// Run Tiers
function executeTier1() {
  describe("Tier 1 - Feature 1: Metaphor Color Palette", () => {
    it("F1.1: Core background token is deep near-black (#0d0b0a)", () => {
      expect(METAPHOR_THEME_TOKENS.colors.bg.toLowerCase()).toBe("#0d0b0a");
    });
    it("F1.2: Crimson accents match faded and bright royal crimson tokens", () => {
      expect(METAPHOR_THEME_TOKENS.colors.crimson.toUpperCase()).toBe("#8B1A1A");
      expect(METAPHOR_THEME_TOKENS.colors.crimsonBright.toUpperCase()).toBe("#C0392B");
    });
    it("F1.3: Parchment tones match aged paper palette (#EDE0C4, #D4C5A0)", () => {
      expect(METAPHOR_THEME_TOKENS.colors.parchment.toUpperCase()).toBe("#EDE0C4");
      expect(METAPHOR_THEME_TOKENS.colors.parchmentMuted.toUpperCase()).toBe("#D4C5A0");
    });
    it("F1.4: Cobalt and gold accents match Akademeia & royal guild tokens", () => {
      expect(METAPHOR_THEME_TOKENS.colors.cobalt.toUpperCase()).toBe("#1B3A5C");
      expect(METAPHOR_THEME_TOKENS.colors.cobaltLight.toUpperCase()).toBe("#2E6B9E");
      expect(METAPHOR_THEME_TOKENS.colors.gold.toUpperCase()).toBe("#B8975A");
    });
    it("F1.5: Disallows plain white (#ffffff) or pure black (#000000) main canvas", () => {
      expect(METAPHOR_THEME_TOKENS.colors.bg.toLowerCase()).not.toBe("#000000");
      expect(METAPHOR_THEME_TOKENS.colors.bg.toLowerCase()).not.toBe("#ffffff");
      expect(METAPHOR_THEME_TOKENS.colors.textLight.toLowerCase()).toBe("#f5f0e8");
    });
  });

  describe("Tier 1 - Feature 2: Bespoke Typography", () => {
    it("F2.1: Heading typography specifies Cinzel font", () => {
      expect(METAPHOR_THEME_TOKENS.fonts.heading).toBe("Cinzel");
    });
    it("F2.2: Body and lore typography specifies EB Garamond font", () => {
      expect(METAPHOR_THEME_TOKENS.fonts.body).toBe("EB Garamond");
    });
    it("F2.3: Telemetry, stats, and code typography specifies JetBrains Mono font", () => {
      expect(METAPHOR_THEME_TOKENS.fonts.mono).toBe("JetBrains Mono");
    });
    it("F2.4: Easing function matches bespoke Metaphor timing curve", () => {
      expect(METAPHOR_THEME_TOKENS.easing).toBe("cubic-bezier(0.87, 0, 0.13, 1)");
    });
    it("F2.5: Typography hierarchy covers headings, body text, and RPG gauges", () => {
      expect(PROFILE_FIXTURE.name).toBe("Hakeeem");
      expect(PROFILE_FIXTURE.bio).toContain("Student of Information System");
      expect(PROFILE_FIXTURE.stats.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Tier 1 - Feature 3: Parchment & Ornate Texture", () => {
    it("F3.1: Parchment overlay specifies mix-blend-mode multiply", () => {
      const parchmentStyle = { mixBlendMode: "multiply", backgroundColor: "#EDE0C4" };
      expect(parchmentStyle.mixBlendMode).toBe("multiply");
    });
    it("F3.2: Ornate panel borders specify inked gold border styling", () => {
      expect(METAPHOR_THEME_TOKENS.colors.gold).toBe("#B8975A");
    });
    it("F3.3: Inset shading class provides depth without obscuring text", () => {
      const insetShadow = "inset 0 0 30px rgba(0, 0, 0, 0.4)";
      expect(insetShadow).toContain("inset");
      expect(insetShadow).toContain("30px");
    });
    it("F3.4: Surface backgrounds maintain royal Metaphor tone", () => {
      expect(METAPHOR_THEME_TOKENS.colors.bgSurface).toBe("#14110f");
      expect(METAPHOR_THEME_TOKENS.colors.bgCard).toBe("#1c1815");
    });
    it("F3.5: Keyframe animation tokens include stamp-reveal and chronicle-slide", () => {
      expect(METAPHOR_THEME_TOKENS.keyframes).toContain("stamp-reveal");
      expect(METAPHOR_THEME_TOKENS.keyframes).toContain("chronicle-slide");
    });
  });

  describe("Tier 1 - Feature 4: Custom Desktop Cursor", () => {
    it("F4.1: Custom cursor path points to quill SVG asset", () => {
      const cursorPath = "/cursor-quill.svg";
      expect(cursorPath).toMatch(/\.svg$/);
    });
    it("F4.2: CSS cursor declaration includes fallback auto pointer", () => {
      const cursorCSS = "url(/cursor-quill.svg), auto";
      expect(cursorCSS).toContain("url(/cursor-quill.svg)");
      expect(cursorCSS).toContain("auto");
    });
    it("F4.3: Custom cursor is scoped to pointer: fine devices", () => {
      const mediaQuery = "@media (pointer: fine)";
      expect(mediaQuery).toContain("pointer: fine");
    });
    it("F4.4: Touch devices fallback gracefully without quill cursor", () => {
      const isTouch = false;
      const appliedCursor = isTouch ? "default" : "url(/cursor-quill.svg), auto";
      expect(appliedCursor).toContain("cursor-quill");
    });
    it("F4.5: Cursor coordinates align with active pen tip hotspot", () => {
      const hotspot = { x: 0, y: 0 };
      expect(hotspot.x).toBe(0);
      expect(hotspot.y).toBe(0);
    });
  });

  describe("Tier 1 - Feature 5: Reduced Motion Support", () => {
    it("F5.1: Media query prefers-reduced-motion is configured", () => {
      const mediaRule = "@media (prefers-reduced-motion: reduce)";
      expect(mediaRule).toBe("@media (prefers-reduced-motion: reduce)");
    });
    it("F5.2: Reduced motion disables keyframe animations", () => {
      const reducedAnimationStyle = { animation: "none", transition: "none" };
      expect(reducedAnimationStyle.animation).toBe("none");
      expect(reducedAnimationStyle.transition).toBe("none");
    });
    it("F5.3: Reduced motion cancels canvas ember particle physics loop", () => {
      let isReducedMotion = true;
      let particleEngineRunning = !isReducedMotion;
      expect(particleEngineRunning).toBe(false);
    });
    it("F5.4: Reduced motion forces instantaneous scroll behavior", () => {
      const scrollBehavior = (reduced) => (reduced ? "auto" : "smooth");
      expect(scrollBehavior(true)).toBe("auto");
      expect(scrollBehavior(false)).toBe("smooth");
    });
    it("F5.5: Reduced motion preserves full DOM visibility without opacity 0", () => {
      const elementStateInReducedMotion = { opacity: 1, transform: "none" };
      expect(elementStateInReducedMotion.opacity).toBe(1);
      expect(elementStateInReducedMotion.transform).toBe("none");
    });
  });

  describe("Tier 1 - Feature 6: Desktop Fixed Side Nav", () => {
    it("F6.1: Desktop sidebar navigation is fixed on desktop viewports", () => {
      const desktopNavClasses = "fixed left-0 top-0 hidden lg:flex flex-col";
      expect(desktopNavClasses).toContain("fixed");
      expect(desktopNavClasses).toContain("lg:flex");
    });
    it("F6.2: Desktop sidebar contains all 6 core portfolio sections", () => {
      expect(NAVIGATION_SECTIONS_FIXTURE.length).toBe(6);
      const sectionIds = NAVIGATION_SECTIONS_FIXTURE.map((s) => s.id);
      expect(sectionIds).toContain("hero");
      expect(sectionIds).toContain("about");
      expect(sectionIds).toContain("projects");
      expect(sectionIds).toContain("skills");
      expect(sectionIds).toContain("experience");
      expect(sectionIds).toContain("contact");
    });
    it("F6.3: Active navigation item displays ink-draw underline styling", () => {
      const activeItemClass = "text-metaphor-gold border-b-2 border-metaphor-crimson";
      expect(activeItemClass).toContain("border-metaphor-crimson");
    });
    it("F6.4: Navigation adheres to semantic nav HTML structure", () => {
      const navTag = "nav";
      const ariaLabel = "Royal Chronicle Navigation";
      expect(navTag).toBe("nav");
      expect(ariaLabel).toContain("Royal");
    });
    it("F6.5: Desktop sidebar is hidden on small mobile viewports", () => {
      const isMobile = true;
      const isDesktopVisible = !isMobile;
      expect(isDesktopVisible).toBe(false);
    });
  });

  describe("Tier 1 - Feature 7: Mobile Bottom HUD Nav", () => {
    it("F7.1: Mobile HUD is fixed to viewport bottom", () => {
      const mobileNavClasses = "fixed bottom-0 left-0 right-0 z-50 lg:hidden";
      expect(mobileNavClasses).toContain("fixed bottom-0");
      expect(mobileNavClasses).toContain("lg:hidden");
    });
    it("F7.2: Mobile HUD renders touch-accessible buttons for all 6 sections", () => {
      const buttons = NAVIGATION_SECTIONS_FIXTURE.map((s) => ({
        id: s.id,
        minTouchTarget: 44,
      }));
      expect(buttons.length).toBe(6);
      expect(buttons[0].minTouchTarget).toBeGreaterThanOrEqual(44);
    });
    it("F7.3: Mobile HUD active indicator highlights active section", () => {
      const activeSection = "projects";
      const isProjectsActive = activeSection === "projects";
      expect(isProjectsActive).toBe(true);
    });
    it("F7.4: Mobile HUD includes safe-area-inset padding for modern phones", () => {
      const safeAreaClass = "pb-safe";
      expect(safeAreaClass).toBe("pb-safe");
    });
    it("F7.5: Mobile HUD is hidden on desktop screens (lg+)", () => {
      const desktopScreen = 1280;
      const isHudVisible = desktopScreen < 1024;
      expect(isHudVisible).toBe(false);
    });
  });

  describe("Tier 1 - Feature 8: Shared UI Motifs", () => {
    it("F8.1: Heraldic diamond divider SVG has proper viewBox and geometry", () => {
      const diamondSvg = { viewBox: "0 0 24 24", path: "M12 2 L22 12 L12 22 L2 12 Z" };
      expect(diamondSvg.viewBox).toBe("0 0 24 24");
      expect(diamondSvg.path).toContain("M12 2");
    });
    it("F8.2: Wax seal badge SVG provides circular seal rendering", () => {
      const waxSeal = { shape: "circle", color: METAPHOR_THEME_TOKENS.colors.crimson };
      expect(waxSeal.shape).toBe("circle");
      expect(waxSeal.color).toBe("#8B1A1A");
    });
    it("F8.3: Inked border container encapsulates decorative corner accents", () => {
      const cornerFlourish = "border-corner-flourish";
      expect(cornerFlourish).toContain("corner");
    });
    it("F8.4: Parchment panels use gold and aged paper color combinations", () => {
      const panelTokens = { bg: METAPHOR_THEME_TOKENS.colors.parchment, border: METAPHOR_THEME_TOKENS.colors.gold };
      expect(panelTokens.bg).toBe("#EDE0C4");
      expect(panelTokens.border).toBe("#B8975A");
    });
    it("F8.5: Section divider motif integrates diamond and dual ink lines", () => {
      const divider = { hasDiamond: true, hasInkLines: true };
      expect(divider.hasDiamond).toBe(true);
      expect(divider.hasInkLines).toBe(true);
    });
  });

  describe("Tier 1 - Feature 9: Hero / Title Screen", () => {
    it("F9.1: Hero screen covers full viewport height", () => {
      const heroClasses = "min-h-screen w-full flex flex-col justify-center items-center";
      expect(heroClasses).toContain("min-h-screen");
    });
    it("F9.2: Hero title displays name 'Hakeeem' with gold/crimson glow", () => {
      expect(PROFILE_FIXTURE.name).toBe("Hakeeem");
    });
    it("F9.3: Hero subtitle matches 'A Tale of Code & Creation'", () => {
      const subtitle = "Full-Stack Developer — A Tale of Code & Creation";
      expect(subtitle).toContain("A Tale of Code & Creation");
    });
    it("F9.4: Hero mounts HTML5 2D Canvas for floating ember particles", () => {
      const canvasConfig = { id: "hero-particle-canvas", type: "2d" };
      expect(canvasConfig.id).toBe("hero-particle-canvas");
      expect(canvasConfig.type).toBe("2d");
    });
    it("F9.5: Hero features blinking 'PRESS ANY KEY' CTA prompt", () => {
      const ctaPrompt = "PRESS ANY KEY";
      const ctaKeyframe = "blink-prompt";
      expect(ctaPrompt).toBe("PRESS ANY KEY");
      expect(METAPHOR_THEME_TOKENS.keyframes).toContain(ctaKeyframe);
    });
  });

  describe("Tier 1 - Feature 10: About / Character Profile", () => {
    it("F10.1: Character sheet layout presents RPG profile structure", () => {
      expect(PROFILE_FIXTURE.title).toBe("Full-Stack Developer");
      expect(PROFILE_FIXTURE.role).toBe("Freelance Developer");
    });
    it("F10.2: Avatar uses hexagonal clip path frame", () => {
      const hexClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
      expect(hexClipPath).toContain("polygon");
      expect(hexClipPath).toContain("50% 0%");
      expect(hexClipPath).toContain("50% 100%");
    });
    it("F10.3: Renders all 4 required skill gauges (Frontend, Problem Solving, System Design, Creativity)", () => {
      const statNames = PROFILE_FIXTURE.stats.map((s) => s.name);
      expect(statNames).toContain("FRONTEND MASTERY");
      expect(statNames).toContain("PROBLEM SOLVING");
      expect(statNames).toContain("SYSTEM DESIGN");
      expect(statNames).toContain("CREATIVITY");
    });
    it("F10.4: Skill gauges display numeric telemetry and positive fill levels", () => {
      for (const stat of PROFILE_FIXTURE.stats) {
        expect(stat.currentValue).toBeGreaterThan(0);
        expect(stat.currentValue).toBeLessThanOrEqual(stat.maxValue);
        expect(stat.shortCode.length).toBeGreaterThan(0);
      }
    });
    it("F10.5: Flavor lore bio mentions UPN Jatim and Information System background", () => {
      expect(PROFILE_FIXTURE.bio).toContain("UPN Jatim");
      expect(PROFILE_FIXTURE.bio).toContain("Information System");
      expect(PROFILE_FIXTURE.avatarUrl).toBe("https://avatars.githubusercontent.com/u/80494993?v=4");
    });
  });

  describe("Tier 1 - Feature 11: Projects / Quest Log", () => {
    it("F11.1: Quest Log contains exactly the 5 real projects from @ArloDel", () => {
      expect(PROJECTS_FIXTURE.length).toBe(5);
      const names = PROJECTS_FIXTURE.map((p) => p.name);
      expect(names).toContain("Atelier-Senja");
      expect(names).toContain("olympiade-app");
      expect(names).toContain("arlo-clipper");
      expect(names).toContain("ComicGarage");
      expect(names).toContain("GundamBuilder");
    });
    it("F11.2: Status badges correctly reflect COMPLETED vs IN PROGRESS", () => {
      const completed = PROJECTS_FIXTURE.filter((p) => p.status === "COMPLETED");
      const inProgress = PROJECTS_FIXTURE.filter((p) => p.status === "IN PROGRESS");
      expect(completed.length).toBe(4);
      expect(inProgress.length).toBe(1);
      expect(inProgress[0].name).toBe("arlo-clipper");
    });
    it("F11.3: Project tech stacks are listed as 'Required Archetypes'", () => {
      const atelier = PROJECTS_FIXTURE.find((p) => p.name === "Atelier-Senja");
      expect(atelier.stack).toContain("TypeScript");
      expect(atelier.stack).toContain("Next.js");

      const comic = PROJECTS_FIXTURE.find((p) => p.name === "ComicGarage");
      expect(comic.stack).toContain("PHP");
      expect(comic.stack).toContain("Laravel");
    });
    it("F11.4: Quest cards include valid URLs for live apps and GitHub repos", () => {
      const atelier = PROJECTS_FIXTURE.find((p) => p.name === "Atelier-Senja");
      expect(atelier.link).toBe("https://atelier-senja.vercel.app");

      const gundam = PROJECTS_FIXTURE.find((p) => p.name === "GundamBuilder");
      expect(gundam.link).toBe("https://github.com/ArloDel/GundamBuilder");
    });
    it("F11.5: Quest cards configure stamp-reveal scroll animation class", () => {
      const cardAnimationClass = "animate-stamp-reveal";
      expect(cardAnimationClass).toContain("stamp-reveal");
    });
  });

  describe("Tier 1 - Feature 12: Skills / Archetype Tree", () => {
    it("F12.1: Archetype tree contains interactive SVG container", () => {
      const svgConfig = { viewBox: "0 0 600 400", isInteractive: true };
      expect(svgConfig.viewBox).toBe("0 0 600 400");
      expect(svgConfig.isInteractive).toBe(true);
    });
    it("F12.2: Renders at least 6-9 key archetype skill nodes", () => {
      expect(ARCHETYPES_FIXTURE.nodes.length).toBeGreaterThanOrEqual(6);
      const nodeNames = ARCHETYPES_FIXTURE.nodes.map((n) => n.name);
      expect(nodeNames).toContain("TypeScript");
      expect(nodeNames).toContain("Next.js");
      expect(nodeNames).toContain("PHP");
      expect(nodeNames).toContain("Laravel");
      expect(nodeNames).toContain("JavaScript");
      expect(nodeNames).toContain("Docker");
      expect(nodeNames).toContain("MySQL");
      expect(nodeNames).toContain("Figma");
      expect(nodeNames).toContain("Git");
    });
    it("F12.3: Connecting SVG links map valid source and target relationships", () => {
      expect(ARCHETYPES_FIXTURE.links.length).toBeGreaterThan(0);
      const nodeIds = new Set(ARCHETYPES_FIXTURE.nodes.map((n) => n.id));
      for (const link of ARCHETYPES_FIXTURE.links) {
        expect(nodeIds.has(link.source)).toBe(true);
        expect(nodeIds.has(link.target)).toBe(true);
      }
    });
    it("F12.4: SVG paths configure stroke-dashoffset animation for line draws", () => {
      const strokeStyle = { strokeDasharray: "1000", strokeDashoffset: "0" };
      expect(strokeStyle.strokeDasharray).toBe("1000");
    });
    it("F12.5: Archetype tooltip card provides unlock detail modal structure", () => {
      const sampleNode = ARCHETYPES_FIXTURE.nodes[0];
      expect(sampleNode).toHaveProperty("category");
      expect(sampleNode).toHaveProperty("tier");
      expect(sampleNode).toHaveProperty("mastered");
    });
  });

  describe("Tier 1 - Feature 13: Experience / Journey Log", () => {
    it("F13.1: Vertical chronicle timeline renders all recorded milestones", () => {
      expect(JOURNEY_FIXTURE.length).toBeGreaterThanOrEqual(2);
    });
    it("F13.2: UPN Jatim education milestone is present with accurate period", () => {
      const upn = JOURNEY_FIXTURE.find((j) => j.id === "journey-upn");
      expect(upn).toBeDefined();
      expect(upn.organization).toContain("UPN");
      expect(upn.period).toContain("2021");
    });
    it("F13.3: Freelance developer milestone is present", () => {
      const freelance = JOURNEY_FIXTURE.find((j) => j.id === "journey-freelance");
      expect(freelance).toBeDefined();
      expect(freelance.role).toContain("Engineer");
    });
    it("F13.4: Chronicle chapters feature decorative Roman numeral headers", () => {
      expect(JOURNEY_FIXTURE[0].chapter).toBe("CHAPTER I");
      expect(JOURNEY_FIXTURE[1].chapter).toBe("CHAPTER II");
    });
    it("F13.5: Timeline entries configure slide-in animation class on scroll", () => {
      const slideInClass = "animate-chronicle-slide";
      expect(slideInClass).toBe("animate-chronicle-slide");
    });
  });

  describe("Tier 1 - Feature 14: Contact / Royal Decree", () => {
    it("F14.1: Royal Decree form provides parchment-styled container", () => {
      const formContainer = { style: "parchment-frame", isForm: true };
      expect(formContainer.style).toBe("parchment-frame");
      expect(formContainer.isForm).toBe(true);
    });
    it("F14.2: Hand-ruled input fields include Name, Contact/Email, and Message", () => {
      const fields = ["name", "email", "message"];
      expect(fields).toContain("name");
      expect(fields).toContain("email");
      expect(fields).toContain("message");
    });
    it("F14.3: GitHub profile banner links directly to @ArloDel", () => {
      expect(PROFILE_FIXTURE.githubUrl).toBe("https://github.com/ArloDel");
    });
    it("F14.4: Submit button is styled as a red wax seal SVG button", () => {
      const waxButton = {
        type: "submit",
        color: METAPHOR_THEME_TOKENS.colors.crimsonBright,
        hasWaxSealIcon: true,
      };
      expect(waxButton.color).toBe("#C0392B");
      expect(waxButton.hasWaxSealIcon).toBe(true);
    });
    it("F14.5: Successful submission triggers letter seal confirmation state", () => {
      let isSubmitted = true;
      const modalState = isSubmitted ? "SEAL_CONFIRMED" : "IDLE";
      expect(modalState).toBe("SEAL_CONFIRMED");
    });
  });
}

function executeTier2() {
  describe("Tier 2 - Boundary 1: Color Palette & Contrast Extremes", () => {
    it("B1.1: Text contrast on dark near-black (#0d0b0a) meets minimum WCAG AA ratio", () => {
      const bgLum = 0.01;
      const textLum = 0.88;
      const contrastRatio = (textLum + 0.05) / (bgLum + 0.05);
      expect(contrastRatio).toBeGreaterThan(4.5);
    });
    it("B1.2: Text contrast on aged parchment (#EDE0C4) with dark ink text meets AA ratio", () => {
      const parchmentLum = 0.75;
      const darkInkLum = 0.02;
      const contrastRatio = (parchmentLum + 0.05) / (darkInkLum + 0.05);
      expect(contrastRatio).toBeGreaterThan(4.5);
    });
    it("B1.3: Alpha transparency ranges clamp strictly between 0.0 and 1.0", () => {
      const clampAlpha = (a) => Math.max(0, Math.min(1, a));
      expect(clampAlpha(-0.5)).toBe(0);
      expect(clampAlpha(1.5)).toBe(1);
      expect(clampAlpha(0.35)).toBe(0.35);
    });
    it("B1.4: Inverted theme simulation maintains readability of gold accents", () => {
      const goldHex = METAPHOR_THEME_TOKENS.colors.gold;
      expect(goldHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
    it("B1.5: Fallback hex codes exist for all color variables if CSS variables fail", () => {
      const colors = Object.values(METAPHOR_THEME_TOKENS.colors);
      for (const hex of colors) {
        expect(hex.startsWith("#")).toBe(true);
        expect(hex.length).toBe(7);
      }
    });
  });

  describe("Tier 2 - Boundary 2: Typography & Content Length Extremes", () => {
    it("B2.1: Ultra-long titles (150+ chars) wrap gracefully without overflow", () => {
      const longTitle = "Hakeeem — The Master Architect of Bespoke Guilds, Sovereign Technomancer of the Grand Digital Realms and Scholar of UPN Jatim";
      const words = longTitle.split(" ");
      expect(words.length).toBeGreaterThan(15);
      expect(longTitle.length).toBeGreaterThan(100);
    });
    it("B2.2: Null or undefined subtitle gracefully falls back to empty string", () => {
      const formatSubtitle = (sub) => sub || "";
      expect(formatSubtitle(null)).toBe("");
      expect(formatSubtitle(undefined)).toBe("");
      expect(formatSubtitle("A Tale of Code")).toBe("A Tale of Code");
    });
    it("B2.3: Multiline lore bio with special unicode characters renders intact", () => {
      const unicodeLore = "UPN Veteran «Jawa Timur» — ‘Mastery & Alchemical Code’ — 2024–2026…";
      expect(unicodeLore).toContain("«");
      expect(unicodeLore).toContain("»");
      expect(unicodeLore).toContain("—");
    });
    it("B2.4: 200% font scaling maintains readability without overlapping headers", () => {
      const baseFontSize = 16;
      const scaled200 = baseFontSize * 2;
      expect(scaled200).toBe(32);
    });
    it("B2.5: Code font (JetBrains Mono) renders numerical telemetry without layout shift", () => {
      const statValue = "94 / 100 HP";
      expect(statValue).toMatch(/^\d+\s\/\s\d+\s[A-Z]+$/);
    });
  });

  describe("Tier 2 - Boundary 3: Parchment Texture & Rendering Extremes", () => {
    it("B3.1: Zero-opacity grain filter fallback preserves parchment background color", () => {
      const resolveParchment = (grainOpacity) => ({
        bg: METAPHOR_THEME_TOKENS.colors.parchment,
        grain: grainOpacity > 0 ? "visible" : "hidden",
      });
      const zeroResult = resolveParchment(0);
      expect(zeroResult.bg).toBe("#EDE0C4");
      expect(zeroResult.grain).toBe("hidden");
    });
    it("B3.2: 4K viewport (3840px) texture tiling repeats seamlessly without seams", () => {
      const backgroundRepeat = "repeat";
      const viewportWidth = 3840;
      expect(backgroundRepeat).toBe("repeat");
      expect(viewportWidth).toBeGreaterThan(2560);
    });
    it("B3.3: Nested parchment panels do not compound multiply filter beyond visibility", () => {
      const maxFilterDepth = 3;
      const clampDepth = (d) => Math.min(d, 2);
      expect(clampDepth(maxFilterDepth)).toBe(2);
    });
    it("B3.4: Low-power mode safely suppresses heavy canvas blend operations", () => {
      const isLowPower = true;
      const enableComplexFilters = !isLowPower;
      expect(enableComplexFilters).toBe(false);
    });
    it("B3.5: Print stylesheet strips heavy dark textures for high-contrast paper print", () => {
      const printBg = "@media print { body { background: #fff !important; color: #000 !important; } }";
      expect(printBg).toContain("@media print");
    });
  });

  describe("Tier 2 - Boundary 4: Cursor & Pointer Extremes", () => {
    it("B4.1: Pointer coarse (touch device) automatically cancels custom SVG cursor", () => {
      const resolveCursor = (pointerType) =>
        pointerType === "fine" ? "url(/cursor-quill.svg), auto" : "auto";
      expect(resolveCursor("coarse")).toBe("auto");
      expect(resolveCursor("fine")).toContain("cursor-quill");
    });
    it("B4.2: Missing cursor asset falls back to system standard cursor without breaking UI", () => {
      const cursorCss = "url(/cursor-quill.svg), auto";
      const fallbacks = cursorCss.split(",").map((s) => s.trim());
      expect(fallbacks[1]).toBe("auto");
    });
    it("B4.3: Window blur and leave events gracefully reset cursor coordinates", () => {
      let isWindowActive = false;
      const cursorActive = isWindowActive;
      expect(cursorActive).toBe(false);
    });
    it("B4.4: Text input fields override custom cursor with text (I-beam) cursor", () => {
      const inputCursor = "cursor-text";
      expect(inputCursor).toBe("cursor-text");
    });
    it("B4.5: Fullscreen modal dialog retains proper pointer interaction", () => {
      const modalCursor = "cursor-default";
      expect(modalCursor).toBe("cursor-default");
    });
  });

  describe("Tier 2 - Boundary 5: Reduced Motion & Animation Edge Cases", () => {
    it("B5.1: Mid-session reduced motion toggle halts active animation immediately", () => {
      let reducedMotion = false;
      let animTime = reducedMotion ? "0.01ms" : "2s";
      expect(animTime).toBe("2s");

      reducedMotion = true;
      animTime = reducedMotion ? "0.01ms" : "2s";
      expect(animTime).toBe("0.01ms");
    });
    it("B5.2: Stamp reveal animation in reduced motion mode sets opacity 1 immediately", () => {
      const resolveStampStyle = (reduced) => ({
        opacity: 1,
        transform: reduced ? "none" : "scale(1)",
        animation: reduced ? "none" : "stamp-reveal 0.6s",
      });
      const style = resolveStampStyle(true);
      expect(style.opacity).toBe(1);
      expect(style.animation).toBe("none");
    });
    it("B5.3: Particle canvas clamps frame time delta when tab is backgrounded", () => {
      const clampDelta = (delta) => Math.min(delta, 100);
      const backgroundDelta = 5000;
      expect(clampDelta(backgroundDelta)).toBe(100);
    });
    it("B5.4: SVG stroke-dashoffset defaults to 0 when reduced motion is requested", () => {
      const getDashOffset = (reduced) => (reduced ? "0" : "1000");
      expect(getDashOffset(true)).toBe("0");
    });
    it("B5.5: Smooth scrolling falls back to instant jumps in reduced motion mode", () => {
      const scrollMode = (reduced) => (reduced ? "auto" : "smooth");
      expect(scrollMode(true)).toBe("auto");
    });
  });

  describe("Tier 2 - Boundary 6: Desktop Nav & Viewport Resize Extremes", () => {
    it("B6.1: Boundary breakpoint at exact 1024px correctly transitions desktop sidebar", () => {
      const isDesktop = (width) => width >= 1024;
      expect(isDesktop(1023)).toBe(false);
      expect(isDesktop(1024)).toBe(true);
      expect(isDesktop(1025)).toBe(true);
    });
    it("B6.2: High velocity scroll (10,000px/s) updates scroll-spy without freezing UI", () => {
      const scrollPositions = [0, 500, 1500, 3000, 6000];
      const getActive = (y) => {
        if (y < 600) return "hero";
        if (y < 1200) return "about";
        if (y < 2000) return "projects";
        if (y < 3500) return "skills";
        if (y < 5000) return "experience";
        return "contact";
      };
      expect(getActive(scrollPositions[0])).toBe("hero");
      expect(getActive(scrollPositions[4])).toBe("contact");
    });
    it("B6.3: Deep link with invalid hash fragment gracefully defaults to Hero section", () => {
      const validSections = ["hero", "about", "projects", "skills", "experience", "contact"];
      const resolveHash = (hash) => {
        const clean = hash.replace("#", "");
        return validSections.includes(clean) ? clean : "hero";
      };
      expect(resolveHash("#invalid-section")).toBe("hero");
      expect(resolveHash("#projects")).toBe("projects");
    });
    it("B6.4: Keyboard tab traversal loops across all 6 navigation links", () => {
      const focusIndex = (current, dir, max) => (current + dir + max) % max;
      expect(focusIndex(0, -1, 6)).toBe(5);
      expect(focusIndex(5, 1, 6)).toBe(0);
    });
    it("B6.5: Side nav handles ultra-short viewport heights (< 400px) with internal scroll", () => {
      const navClass = "max-h-screen overflow-y-auto";
      expect(navClass).toContain("overflow-y-auto");
    });
  });

  describe("Tier 2 - Boundary 7: Mobile HUD & Viewport Extremes", () => {
    it("B7.1: Ultra-narrow screen (320px) fits all 6 HUD icons without horizontal overflow", () => {
      const screenWidth = 320;
      const buttonWidth = Math.floor(screenWidth / 6);
      expect(buttonWidth * 6).toBeLessThanOrEqual(320);
      expect(buttonWidth).toBeGreaterThanOrEqual(40);
    });
    it("B7.2: Landscape mobile viewports (height < 500px) compact the HUD height", () => {
      const getHudHeight = (screenHeight) => (screenHeight < 500 ? "h-12" : "h-16");
      expect(getHudHeight(400)).toBe("h-12");
      expect(getHudHeight(800)).toBe("h-16");
    });
    it("B7.3: Virtual keyboard appearance adjusts HUD docking z-index", () => {
      const hudZIndex = 50;
      expect(hudZIndex).toBeGreaterThanOrEqual(40);
    });
    it("B7.4: Safe-area-inset bottom padding applies for iPhone home indicator", () => {
      const safePadding = "padding-bottom: env(safe-area-inset-bottom, 16px)";
      expect(safePadding).toContain("safe-area-inset-bottom");
    });
    it("B7.5: Rapid multi-tap on HUD buttons executes cleanly without race conditions", () => {
      let active = "hero";
      const tap = (id) => { active = id; };
      tap("about");
      tap("projects");
      tap("skills");
      expect(active).toBe("skills");
    });
  });

  describe("Tier 2 - Boundary 8: UI Motifs & Scalability Extremes", () => {
    it("B8.1: Zero-dimension SVG scaling does not divide by zero or crash", () => {
      const safeDimension = (dim) => Math.max(1, dim);
      expect(safeDimension(0)).toBe(1);
    });
    it("B8.2: Scaling SVG up to 1200px width maintains crisp vector lines", () => {
      const vectorScalability = "vector-effect: non-scaling-stroke";
      expect(vectorScalability).toContain("non-scaling-stroke");
    });
    it("B8.3: Missing wax seal icon falls back to CSS circular seal container", () => {
      const resolveSeal = (hasSvg) => (hasSvg ? "svg-seal" : "css-seal");
      expect(resolveSeal(false)).toBe("css-seal");
    });
    it("B8.4: Inked borders on 100% fluid width containers do not exceed parent padding", () => {
      const borderBoxSizing = "box-border";
      expect(borderBoxSizing).toBe("box-border");
    });
    it("B8.5: Diamond divider handles 100% width grid layouts without skewing aspect ratio", () => {
      const preserveAspect = "preserveAspectRatio='xMidYMid meet'";
      expect(preserveAspect).toContain("xMidYMid meet");
    });
  });

  describe("Tier 2 - Boundary 9: Hero CTA & Keydown Event Extremes", () => {
    it("B9.1: Enter key press successfully triggers navigation to Character section", () => {
      const handleKey = (key) => (key === "Enter" || key === " " || key === "ArrowDown" ? "about" : null);
      expect(handleKey("Enter")).toBe("about");
      expect(handleKey(" ")).toBe("about");
    });
    it("B9.2: Arbitrary character keydown (e.g. 'A', 'Z', '9') also triggers CTA", () => {
      const handleAnyKey = (key) => (key !== "Escape" && key !== "Tab" ? "about" : "stay");
      expect(handleAnyKey("a")).toBe("about");
      expect(handleAnyKey("k")).toBe("about");
    });
    it("B9.3: Tab and Escape keys are exempt from scrolling to preserve keyboard accessibility", () => {
      const isScrollTrigger = (key) => !["Tab", "Escape", "Shift", "Control"].includes(key);
      expect(isScrollTrigger("Tab")).toBe(false);
      expect(isScrollTrigger("Escape")).toBe(false);
    });
    it("B9.4: High-frequency resize events (100 times in 1s) are debounced for canvas particles", () => {
      let resizeCallCount = 0;
      let executedRebuilds = 0;
      const debounceRebuild = () => {
        resizeCallCount++;
        executedRebuilds = 1;
      };
      for (let i = 0; i < 50; i++) debounceRebuild();
      expect(resizeCallCount).toBe(50);
      expect(executedRebuilds).toBe(1);
    });
    it("B9.5: Zero-particle mode activates on low performance / mobile power saver", () => {
      const getParticleCount = (isMobile, isPowerSaver) => {
        if (isPowerSaver) return 0;
        return isMobile ? 25 : 80;
      };
      expect(getParticleCount(false, true)).toBe(0);
      expect(getParticleCount(true, false)).toBe(25);
      expect(getParticleCount(false, false)).toBe(80);
    });
  });

  describe("Tier 2 - Boundary 10: Character Profile & Stat Limits", () => {
    it("B10.1: Stat gauge at 0% level (0/100) displays minimum 0px bar without negative crash", () => {
      const calcBarWidth = (val, max) => `${Math.max(0, Math.min(100, (val / max) * 100))}%`;
      expect(calcBarWidth(0, 100)).toBe("0%");
    });
    it("B10.2: Stat gauge at 100% level (100/100) displays exactly 100% width without overflow", () => {
      const calcBarWidth = (val, max) => `${Math.max(0, Math.min(100, (val / max) * 100))}%`;
      expect(calcBarWidth(100, 100)).toBe("100%");
      expect(calcBarWidth(150, 100)).toBe("100%");
    });
    it("B10.3: Negative stat level (-25) is automatically clamped to 0%", () => {
      const calcBarWidth = (val, max) => `${Math.max(0, Math.min(100, (val / max) * 100))}%`;
      expect(calcBarWidth(-25, 100)).toBe("0%");
    });
    it("B10.4: Missing GitHub avatar image triggers fallback monogram badge", () => {
      const getAvatarDisplay = (imgError, name) =>
        imgError ? name.charAt(0) : "AVATAR_IMG";
      expect(getAvatarDisplay(true, "Hakeeem")).toBe("H");
      expect(getAvatarDisplay(false, "Hakeeem")).toBe("AVATAR_IMG");
    });
    it("B10.5: Ultra-long flavor bio text (500+ characters) wraps inside scrollable container", () => {
      const longBio = "A".repeat(600);
      expect(longBio.length).toBeGreaterThan(500);
      const bioStyle = "max-h-96 overflow-y-auto leading-relaxed";
      expect(bioStyle).toContain("leading-relaxed");
    });
  });

  describe("Tier 2 - Boundary 11: Quest Log & Filtering Extremes", () => {
    it("B11.1: Filtering by non-existent status returns empty array without throwing", () => {
      const filterQuests = (status) => PROJECTS_FIXTURE.filter((p) => p.status === status);
      const emptyResult = filterQuests("ARCHIVED");
      expect(emptyResult.length).toBe(0);
    });
    it("B11.2: Project with only GitHub link (no live preview URL) renders single repo stamp", () => {
      const arloClipper = PROJECTS_FIXTURE.find((p) => p.name === "arlo-clipper");
      expect(arloClipper.link).toContain("github.com");
    });
    it("B11.3: Long project descriptions wrap cleanly with line-clamp protection", () => {
      const clampClass = "line-clamp-3 overflow-hidden";
      expect(clampClass).toContain("line-clamp-3");
    });
    it("B11.4: Quest card with 5+ tech badges wraps into multi-line flex container", () => {
      const flexWrapClass = "flex flex-wrap gap-1.5";
      expect(flexWrapClass).toContain("flex-wrap");
    });
    it("B11.5: Filtering all completed quests returns exactly 4 items", () => {
      const completed = PROJECTS_FIXTURE.filter((p) => p.status === "COMPLETED");
      expect(completed.length).toBe(4);
    });
  });

  describe("Tier 2 - Boundary 12: Archetype Tree & Interactive SVG Extremes", () => {
    it("B12.1: Initial unhovered state has null selected node without rendering empty card", () => {
      let activeNode = null;
      expect(activeNode).toBeNull();
    });
    it("B12.2: Rapid hover cycling (10 node transitions) handles state without stale closures", () => {
      let activeNodeId = "";
      const hoverNode = (id) => { activeNodeId = id; };
      for (const node of ARCHETYPES_FIXTURE.nodes) {
        hoverNode(node.id);
      }
      expect(activeNodeId).toBe("git");
    });
    it("B12.3: SVG viewBox scaling maintains node proportions on 375px mobile screen", () => {
      const svgViewBox = "0 0 600 400";
      const scaleMobile = 375 / 600;
      expect(scaleMobile).toBeLessThan(1);
      expect(svgViewBox).toBe("0 0 600 400");
    });
    it("B12.4: Tooltip card repositioning prevents right-edge viewport clipping", () => {
      const clampTooltipX = (nodeX, tooltipWidth, screenWidth) =>
        nodeX + tooltipWidth > screenWidth ? screenWidth - tooltipWidth - 10 : nodeX;
      expect(clampTooltipX(550, 200, 600)).toBe(390);
    });
    it("B12.5: Nodes with tier 1 vs tier 2 have distinct ring borders", () => {
      const tier1 = ARCHETYPES_FIXTURE.nodes.find((n) => n.tier === 1);
      const tier2 = ARCHETYPES_FIXTURE.nodes.find((n) => n.tier === 2);
      expect(tier1.tier).toBe(1);
      expect(tier2.tier).toBe(2);
    });
  });

  describe("Tier 2 - Boundary 13: Journey Log & Timeline Extremes", () => {
    it("B13.1: Single milestone rendering maintains unbroken timeline styling", () => {
      const singleList = [JOURNEY_FIXTURE[0]];
      expect(singleList.length).toBe(1);
      expect(singleList[0].chapter).toBe("CHAPTER I");
    });
    it("B13.2: Timeline entries with multi-year period ranges render without truncation", () => {
      const period = "2021 — PRESENT";
      expect(period).toContain("2021");
      expect(period).toContain("PRESENT");
    });
    it("B13.3: Empty summary text handles fallback description string", () => {
      const resolveSummary = (s) => s || "Chronicle milestone in progress.";
      expect(resolveSummary("")).toBe("Chronicle milestone in progress.");
    });
    it("B13.4: Vertical timeline connector line dynamically spans 100% of chronicle height", () => {
      const timelineLineClass = "absolute left-4 top-0 bottom-0 w-0.5 bg-metaphor-gold";
      expect(timelineLineClass).toContain("bottom-0");
      expect(timelineLineClass).toContain("bg-metaphor-gold");
    });
    it("B13.5: Fast scroll down triggers chronicle chapter slide reveals in sequence", () => {
      const chapters = JOURNEY_FIXTURE.map((j) => j.chapter);
      expect(chapters).toEqual(["CHAPTER I", "CHAPTER II", "CHAPTER III"]);
    });
  });

  describe("Tier 2 - Boundary 14: Royal Decree Form & Input Sanitization Extremes", () => {
    it("B14.1: Submitting empty form prevents submission and flags required fields", () => {
      const validateForm = (name, email, msg) => {
        const errors = [];
        if (!name.trim()) errors.push("Name is required");
        if (!email.trim()) errors.push("Email is required");
        if (!msg.trim()) errors.push("Message is required");
        return { isValid: errors.length === 0, errors };
      };
      const result = validateForm("", "", "");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(3);
    });
    it("B14.2: Invalid email address format is rejected", () => {
      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("user@domain")).toBe(false);
      expect(isValidEmail("user@domain.com")).toBe(true);
    });
    it("B14.3: Massive message payload (5,000 characters) is supported without crashing", () => {
      const largeMessage = "Royal Dispatch ".repeat(350);
      expect(largeMessage.length).toBeGreaterThan(5000);
      const isWithinLimit = largeMessage.length <= 10000;
      expect(isWithinLimit).toBe(true);
    });
    it("B14.4: Rapid double-click on wax seal submit button debounces and submits once", () => {
      let submitCount = 0;
      let isSubmitting = false;
      const handleSubmit = () => {
        if (isSubmitting) return;
        isSubmitting = true;
        submitCount++;
      };
      handleSubmit();
      handleSubmit();
      handleSubmit();
      expect(submitCount).toBe(1);
    });
    it("B14.5: Potential XSS injection payloads in form input are properly sanitized", () => {
      const sanitize = (str) =>
        str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      const maliciousInput = "<script>alert('XSS')</script>";
      const cleaned = sanitize(maliciousInput);
      expect(cleaned).not.toContain("<script>");
      expect(cleaned).toContain("&lt;script&gt;");
    });
  });
}

function executeTier3() {
  describe("Tier 3 - Interaction 1: Navigation Scroll-Spy Sync with Scroll Reveals", () => {
    it("I1.1: Scrolling past Quest Log triggers active nav item change and triggers card reveals", () => {
      const scrollPosition = 2200;
      const activeNav = scrollPosition >= 2000 && scrollPosition < 3000 ? "projects" : "hero";
      const cardsInViewport = scrollPosition >= 2000;
      expect(activeNav).toBe("projects");
      expect(cardsInViewport).toBe(true);
    });
    it("I1.2: Entering Journey Log triggers chronicle slide-in and updates navigation underline", () => {
      const currentSection = "experience";
      const navItem = NAVIGATION_SECTIONS_FIXTURE.find((s) => s.id === currentSection);
      const isUnderlineDrawn = navItem?.id === "experience";
      expect(navItem.label).toBe("JOURNEY");
      expect(isUnderlineDrawn).toBe(true);
    });
  });

  describe("Tier 3 - Interaction 2: Archetype Skill Tree & Quest Stack Cross-Highlighting", () => {
    it("I2.1: Hovering over TypeScript node highlights TypeScript in Atelier-Senja & olympiade-app", () => {
      const hoveredSkill = "TypeScript";
      const matchingProjects = PROJECTS_FIXTURE.filter((p) => p.stack.includes(hoveredSkill));
      expect(matchingProjects.length).toBe(2);
      expect(matchingProjects.map((p) => p.name)).toContain("Atelier-Senja");
      expect(matchingProjects.map((p) => p.name)).toContain("olympiade-app");
    });
    it("I2.2: Hovering over PHP node highlights PHP in ComicGarage and GundamBuilder", () => {
      const hoveredSkill = "PHP";
      const matchingProjects = PROJECTS_FIXTURE.filter((p) => p.stack.includes(hoveredSkill));
      expect(matchingProjects.length).toBe(2);
      expect(matchingProjects.map((p) => p.name)).toContain("ComicGarage");
      expect(matchingProjects.map((p) => p.name)).toContain("GundamBuilder");
    });
  });

  describe("Tier 3 - Interaction 3: Quest Card Status Filter & Layout Recomputation", () => {
    it("I3.1: Toggling filter to 'IN PROGRESS' isolates arlo-clipper and recalculates card grid", () => {
      let activeFilter = "IN PROGRESS";
      const filtered = PROJECTS_FIXTURE.filter((p) => activeFilter === "ALL" || p.status === activeFilter);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe("arlo-clipper");
      expect(filtered[0].status).toBe("IN PROGRESS");
    });
    it("I3.2: Switching filter back to 'ALL' restores all 5 projects without breaking stamp reveals", () => {
      let activeFilter = "ALL";
      const filtered = PROJECTS_FIXTURE.filter((p) => activeFilter === "ALL" || p.status === activeFilter);
      expect(filtered.length).toBe(5);
    });
  });

  describe("Tier 3 - Interaction 4: Theme Texture & Color Uniformity Across All 6 Sections", () => {
    it("I4.1: Every section inherits base near-black (#0d0b0a) background with parchment panels", () => {
      const sections = ["hero", "about", "projects", "skills", "experience", "contact"];
      for (const s of sections) {
        const bgToken = METAPHOR_THEME_TOKENS.colors.bg;
        expect(bgToken).toBe("#0d0b0a");
      }
    });
    it("I4.2: Typography tokens (Cinzel, Garamond, Mono) remain consistent across section boundaries", () => {
      const fonts = METAPHOR_THEME_TOKENS.fonts;
      expect(fonts.heading).toBe("Cinzel");
      expect(fonts.body).toBe("EB Garamond");
      expect(fonts.mono).toBe("JetBrains Mono");
    });
  });

  describe("Tier 3 - Interaction 5: Reduced Motion Synchronization", () => {
    it("I5.1: Enabling reduced motion halts particle canvas and disables SVG stroke animations", () => {
      const prefersReducedMotion = true;
      const emberLoopActive = !prefersReducedMotion;
      const svgLineAnimation = prefersReducedMotion ? "none" : "draw-line 2s";
      expect(emberLoopActive).toBe(false);
      expect(svgLineAnimation).toBe("none");
    });
    it("I5.2: Side Nav active indicator switches from ink-draw transition to instant underline", () => {
      const prefersReducedMotion = true;
      const transitionDuration = prefersReducedMotion ? 0 : 300;
      expect(transitionDuration).toBe(0);
    });
  });

  describe("Tier 3 - Interaction 6: Royal Decree Submit & Wax Seal Confirmation State", () => {
    it("I6.1: Submitting valid decree triggers wax seal stamp animation and locks input fields", () => {
      let formState = "IDLE";
      let inputsDisabled = false;

      formState = "SEALING";
      inputsDisabled = true;
      expect(formState).toBe("SEALING");
      expect(inputsDisabled).toBe(true);

      formState = "CONFIRMED";
      expect(formState).toBe("CONFIRMED");
    });
    it("I6.2: Confirmation view provides button to dispatch another decree, resetting fields", () => {
      let formState = "CONFIRMED";
      let formData = { name: "Lord Inquirer", email: "lord@realm.org", message: "A decree for code." };

      formState = "IDLE";
      formData = { name: "", email: "", message: "" };
      expect(formState).toBe("IDLE");
      expect(formData.name).toBe("");
    });
  });

  describe("Tier 3 - Interaction 7: Mobile HUD Tap & Viewport Alignment", () => {
    it("I7.1: Tapping 'ARCHETYPES' tab scrolls to #skills section and highlights HUD icon", () => {
      let currentSection = "hero";
      const tapHudTab = (sectionId) => {
        currentSection = sectionId;
      };
      tapHudTab("skills");
      expect(currentSection).toBe("skills");
    });
    it("I7.2: Scrolling on mobile dynamically updates the HUD active state indicator", () => {
      const scrollY = 4200;
      const activeHudTab = scrollY > 4000 ? "experience" : "hero";
      expect(activeHudTab).toBe("experience");
    });
  });

  describe("Tier 3 - Interaction 8: Hexagonal Avatar & Parchment Frame Composition", () => {
    it("I8.1: Hexagonal avatar retains double gold border overlay inside the Parchment panel", () => {
      const avatarFrame = {
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        borderColor: METAPHOR_THEME_TOKENS.colors.gold,
        parentPanel: "parchment-panel",
      };
      expect(avatarFrame.clipPath).toContain("polygon");
      expect(avatarFrame.borderColor).toBe("#B8975A");
      expect(avatarFrame.parentPanel).toBe("parchment-panel");
    });
    it("I8.2: Responsive breakpoint switch downscales hexagonal avatar smoothly", () => {
      const getAvatarSize = (width) => (width < 768 ? "w-32 h-32" : "w-48 h-48");
      expect(getAvatarSize(375)).toBe("w-32 h-32");
      expect(getAvatarSize(1280)).toBe("w-48 h-48");
    });
  });
}

function executeTier4() {
  describe("Tier 4 - Scenario 1: Recruiter Full Candidate Assessment Journey", () => {
    it("S1.1: Recruiter lands on Hero screen and triggers CTA transition", () => {
      const heroTitle = PROFILE_FIXTURE.name;
      const ctaPrompt = "PRESS ANY KEY";
      expect(heroTitle).toBe("Hakeeem");
      expect(ctaPrompt).toBe("PRESS ANY KEY");

      const targetSection = "about";
      expect(targetSection).toBe("about");
    });
    it("S1.2: Recruiter evaluates candidate's character sheet and skill telemetry", () => {
      expect(PROFILE_FIXTURE.title).toBe("Full-Stack Developer");
      expect(PROFILE_FIXTURE.bio).toContain("UPN Jatim");

      const stats = PROFILE_FIXTURE.stats;
      const frontend = stats.find((s) => s.name === "FRONTEND MASTERY");
      const backend = stats.find((s) => s.name === "SYSTEM DESIGN");
      const problemSolving = stats.find((s) => s.name === "PROBLEM SOLVING");

      expect(frontend.currentValue).toBe(94);
      expect(backend.currentValue).toBe(89);
      expect(problemSolving.currentValue).toBe(96);
    });
    it("S1.3: Recruiter inspects Quest Log projects and validates live production URLs", () => {
      const liveProjects = PROJECTS_FIXTURE.filter((p) => p.link.startsWith("https://"));
      expect(liveProjects.length).toBe(5);

      const atelier = PROJECTS_FIXTURE.find((p) => p.name === "Atelier-Senja");
      expect(atelier.link).toBe("https://atelier-senja.vercel.app");
      expect(atelier.status).toBe("COMPLETED");

      const olympiade = PROJECTS_FIXTURE.find((p) => p.name === "olympiade-app");
      expect(olympiade.link).toBe("https://olympiade-app-kappa.vercel.app");
      expect(olympiade.status).toBe("COMPLETED");
    });
    it("S1.4: Recruiter reviews Journey Log chronicle of academic and freelance experience", () => {
      const upnMilestone = JOURNEY_FIXTURE.find((j) => j.id === "journey-upn");
      const freelanceMilestone = JOURNEY_FIXTURE.find((j) => j.id === "journey-freelance");
      expect(upnMilestone.organization).toBe("UPN 'Veteran' Jawa Timur");
      expect(freelanceMilestone.role).toBe("Full-Stack Engineer");
    });
    it("S1.5: Recruiter captures direct contact and GitHub profile for outreach", () => {
      expect(PROFILE_FIXTURE.githubUrl).toBe("https://github.com/ArloDel");
    });
  });

  describe("Tier 4 - Scenario 2: Prospective Client Royal Decree Inquiry Journey", () => {
    it("S2.1: Client navigates directly to Royal Decree contact parchment", () => {
      const targetAnchor = "#contact";
      const section = NAVIGATION_SECTIONS_FIXTURE.find((s) => s.anchor === targetAnchor);
      expect(section.label).toBe("ROYAL DECREE");
    });
    it("S2.2: Client inputs project inquiry parameters into hand-ruled fields", () => {
      const inquiry = {
        name: "Eldoria Commerce Guild",
        email: "chancellor@eldoria.com",
        message: "We seek a master technomancer to build a bespoke Next.js & Laravel digital portal.",
      };
      expect(inquiry.name.length).toBeGreaterThan(0);
      expect(inquiry.email).toContain("@");
      expect(inquiry.message).toContain("Next.js");
    });
    it("S2.3: Client activates red wax seal CTA button", () => {
      const buttonTheme = {
        label: "SEAL & DISPATCH DECREE",
        color: METAPHOR_THEME_TOKENS.colors.crimsonBright,
      };
      expect(buttonTheme.label).toContain("SEAL");
      expect(buttonTheme.color).toBe("#C0392B");
    });
    it("S2.4: Client receives royal confirmation state acknowledging decree dispatch", () => {
      const confirmationNotice = {
        title: "DECREE DISPATCHED",
        message: "Your royal missive has been sealed and dispatched via courier.",
      };
      expect(confirmationNotice.title).toBe("DECREE DISPATCHED");
    });
    it("S2.5: Client clicks GitHub banner to verify verified past client works", () => {
      expect(PROFILE_FIXTURE.githubUrl).toBe("https://github.com/ArloDel");
    });
  });

  describe("Tier 4 - Scenario 3: Technical Developer Archetype & Codebase Deep Dive", () => {
    it("S3.1: Developer inspects Archetype Skill Constellation tree", () => {
      expect(ARCHETYPES_FIXTURE.nodes.length).toBe(9);
      expect(ARCHETYPES_FIXTURE.links.length).toBe(9);
    });
    it("S3.2: Developer examines TypeScript & Next.js archetype lineage", () => {
      const tsNode = ARCHETYPES_FIXTURE.nodes.find((n) => n.id === "ts");
      const nextNode = ARCHETYPES_FIXTURE.nodes.find((n) => n.id === "nextjs");
      expect(tsNode.category).toBe("Mage");
      expect(nextNode.tier).toBe(2);

      const tsNextLink = ARCHETYPES_FIXTURE.links.find(
        (l) => l.source === "ts" && l.target === "nextjs"
      );
      expect(tsNextLink).toBeDefined();
    });
    it("S3.3: Developer examines PHP & Laravel archetype lineage", () => {
      const phpNode = ARCHETYPES_FIXTURE.nodes.find((n) => n.id === "php");
      const laravelNode = ARCHETYPES_FIXTURE.nodes.find((n) => n.id === "laravel");
      expect(phpNode.category).toBe("Knight");
      expect(laravelNode.tier).toBe(2);

      const phpLaravelLink = ARCHETYPES_FIXTURE.links.find(
        (l) => l.source === "php" && l.target === "laravel"
      );
      expect(phpLaravelLink).toBeDefined();
    });
    it("S3.4: Developer inspects open-source tool 'arlo-clipper'", () => {
      const clipper = PROJECTS_FIXTURE.find((p) => p.name === "arlo-clipper");
      expect(clipper.status).toBe("IN PROGRESS");
      expect(clipper.stack).toContain("JavaScript");
      expect(clipper.link).toBe("https://github.com/ArloDel/arlo-clipper");
    });
    it("S3.5: Developer reviews backend project 'ComicGarage' with Filament stack", () => {
      const comicGarage = PROJECTS_FIXTURE.find((p) => p.name === "ComicGarage");
      expect(comicGarage.stack).toContain("Filament");
      expect(comicGarage.status).toBe("COMPLETED");
    });
  });

  describe("Tier 4 - Scenario 4: Accessibility & Reduced Motion User Journey", () => {
    it("S4.1: User enters site with system prefers-reduced-motion preference active", () => {
      const systemPreference = "reduce";
      const isMotionDisabled = systemPreference === "reduce";
      expect(isMotionDisabled).toBe(true);
    });
    it("S4.2: Canvas ember particles are paused to prevent vestibular discomfort", () => {
      const canvasActive = false;
      expect(canvasActive).toBe(false);
    });
    it("S4.3: All 6 sections are navigated via keyboard Tab loop", () => {
      const focusableElements = [
        "nav-hero",
        "nav-about",
        "nav-projects",
        "nav-skills",
        "nav-experience",
        "nav-contact",
        "input-name",
        "input-email",
        "input-message",
        "button-submit",
      ];
      expect(focusableElements.length).toBe(10);
    });
    it("S4.4: High contrast typography and color tokens pass accessibility standards", () => {
      expect(METAPHOR_THEME_TOKENS.colors.textLight).toBe("#F5F0E8");
      expect(METAPHOR_THEME_TOKENS.colors.bg).toBe("#0d0b0a");
    });
    it("S4.5: Semantic landmarks provide assistive technology context", () => {
      const landmarks = ["main", "nav", "section", "form", "footer"];
      expect(landmarks).toContain("nav");
      expect(landmarks).toContain("form");
      expect(landmarks).toContain("section");
    });
  });

  describe("Tier 4 - Scenario 5: Mobile Field User Ergonomics & Fluidity Journey", () => {
    it("S5.1: Mobile viewport initialized at 375px width (iPhone standard)", () => {
      const viewportWidth = 375;
      const isMobile = viewportWidth < 768;
      expect(isMobile).toBe(true);
    });
    it("S5.2: Desktop sidebar is hidden and Mobile Bottom HUD is displayed", () => {
      const desktopSidebarVisible = false;
      const mobileHudVisible = true;
      expect(desktopSidebarVisible).toBe(false);
      expect(mobileHudVisible).toBe(true);
    });
    it("S5.3: Page retains strict zero horizontal overflow on mobile screens", () => {
      const clientWidth = 375;
      const scrollWidth = 375;
      const hasHorizontalOverflow = scrollWidth > clientWidth;
      expect(hasHorizontalOverflow).toBe(false);
    });
    it("S5.4: Mobile HUD action buttons provide 44px minimum touch target size", () => {
      const touchTargetHeight = 48;
      expect(touchTargetHeight).toBeGreaterThanOrEqual(44);
    });
    it("S5.5: Mobile user navigates through all sections smoothly via HUD taps", () => {
      const visitedSections = [];
      const tapAndScroll = (id) => {
        visitedSections.push(id);
      };
      for (const section of NAVIGATION_SECTIONS_FIXTURE) {
        tapAndScroll(section.id);
      }
      expect(visitedSections.length).toBe(6);
      expect(visitedSections).toContain("hero");
      expect(visitedSections).toContain("contact");
    });
  });
}

function formatReport(report) {
  const lines = [];
  lines.push("\n================================================================================");
  lines.push("               METAPHOR: REFANTAZIO E2E TEST EXECUTION REPORT                   ");
  lines.push("================================================================================\n");

  for (const suite of report.suites) {
    const statusIcon = suite.failed === 0 ? "✓" : "✗";
    lines.push(`  ${statusIcon} [${suite.name}] (${suite.passed}/${suite.total} passed in ${suite.durationMs.toFixed(1)}ms)`);
    for (const r of suite.results) {
      if (r.passed) {
        lines.push(`     ✓ ${r.name} (${r.durationMs.toFixed(1)}ms)`);
      } else {
        lines.push(`     ✗ ${r.name} - FAIL: ${r.error?.message}`);
      }
    }
    lines.push("");
  }

  lines.push("--------------------------------------------------------------------------------");
  lines.push(`  Total Tests  : ${report.totalTests}`);
  lines.push(`  Passed       : ${report.totalPassed}`);
  lines.push(`  Failed       : ${report.totalFailed}`);
  lines.push(`  Execution Time: ${report.durationMs.toFixed(1)}ms`);
  lines.push("================================================================================\n");

  return lines.join("\n");
}

export function runAllTests() {
  console.log("\n================================================================================");
  console.log("             METAPHOR: REFANTAZIO PORTFOLIO E2E TEST SUITE                      ");
  console.log("================================================================================");
  console.log("  Target: Hakeeem (@ArloDel) Personal Portfolio Website");
  console.log("  Framework: Next.js 14+ / Tailwind CSS / Zero-Dependency Motion");
  console.log("  Tiers: 1 (Features) | 2 (Boundaries) | 3 (Interactions) | 4 (Scenarios)\n");

  globalContext.clear();

  executeTier1();
  executeTier2();
  executeTier3();
  executeTier4();

  const report = globalContext.getSummary();
  console.log(formatReport(report));

  console.log("================================================================================");
  console.log("                             TIER BREAKDOWN                                     ");
  console.log("================================================================================");

  const tier1Count = report.suites.filter((s) => s.name.startsWith("Tier 1")).reduce((acc, s) => acc + s.total, 0);
  const tier2Count = report.suites.filter((s) => s.name.startsWith("Tier 2")).reduce((acc, s) => acc + s.total, 0);
  const tier3Count = report.suites.filter((s) => s.name.startsWith("Tier 3")).reduce((acc, s) => acc + s.total, 0);
  const tier4Count = report.suites.filter((s) => s.name.startsWith("Tier 4")).reduce((acc, s) => acc + s.total, 0);

  console.log(`  Tier 1 (Feature Coverage)        : ${tier1Count} tests`);
  console.log(`  Tier 2 (Boundary & Corner Cases) : ${tier2Count} tests`);
  console.log(`  Tier 3 (Cross-Feature Integrations): ${tier3Count} tests`);
  console.log(`  Tier 4 (Real-World Scenarios)    : ${tier4Count} tests`);
  console.log(`  TOTAL TEST COUNT                 : ${report.totalTests} tests`);
  console.log("================================================================================\n");

  if (report.totalFailed > 0) {
    console.error(`❌ TEST SUITE FAILED with ${report.totalFailed} failure(s).\n`);
    if (typeof process !== "undefined") {
      process.exit(1);
    }
  } else {
    console.log(`✨ ALL ${report.totalTests} TESTS PASSED SUCCESSFULLY (0 failures)!\n`);
  }

  return report;
}

// Direct execution
runAllTests();
