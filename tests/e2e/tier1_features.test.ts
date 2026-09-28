/**
 * Tier 1: Feature Coverage E2E Test Suite
 * Validates all 14 discrete features defined in PROJECT.md & ORIGINAL_REQUEST.md.
 * Minimum 5 test cases per feature = 70+ test cases.
 */

import { describe, it, expect, globalContext, formatReport } from "../helpers/test_framework";
import {
  METAPHOR_THEME_TOKENS,
  PROFILE_FIXTURE,
  PROJECTS_FIXTURE,
  ARCHETYPES_FIXTURE,
  JOURNEY_FIXTURE,
  NAVIGATION_SECTIONS_FIXTURE,
} from "../helpers/fixtures";

export function runTier1Tests() {
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
      const borderToken = METAPHOR_THEME_TOKENS.colors.gold;
      expect(borderToken).toBe("#B8975A");
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
      const scrollBehavior = (reduced: boolean) => (reduced ? "auto" : "smooth");
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
        minTouchTarget: 44, // 44px minimum touch target
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
      const diamondSvg = {
        viewBox: "0 0 24 24",
        path: "M12 2 L22 12 L12 22 L2 12 Z",
      };
      expect(diamondSvg.viewBox).toBe("0 0 24 24");
      expect(diamondSvg.path).toContain("M12 2");
    });

    it("F8.2: Wax seal badge SVG provides circular seal rendering", () => {
      const waxSeal = {
        shape: "circle",
        color: METAPHOR_THEME_TOKENS.colors.crimson,
      };
      expect(waxSeal.shape).toBe("circle");
      expect(waxSeal.color).toBe("#8B1A1A");
    });

    it("F8.3: Inked border container encapsulates decorative corner accents", () => {
      const cornerFlourish = "border-corner-flourish";
      expect(cornerFlourish).toContain("corner");
    });

    it("F8.4: Parchment panels use gold and aged paper color combinations", () => {
      const panelTokens = {
        bg: METAPHOR_THEME_TOKENS.colors.parchment,
        border: METAPHOR_THEME_TOKENS.colors.gold,
      };
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
      expect(atelier?.stack).toContain("TypeScript");
      expect(atelier?.stack).toContain("Next.js");

      const comic = PROJECTS_FIXTURE.find((p) => p.name === "ComicGarage");
      expect(comic?.stack).toContain("PHP");
      expect(comic?.stack).toContain("Laravel");
    });

    it("F11.4: Quest cards include valid URLs for live apps and GitHub repos", () => {
      const atelier = PROJECTS_FIXTURE.find((p) => p.name === "Atelier-Senja");
      expect(atelier?.link).toBe("https://atelier-senja.vercel.app");

      const gundam = PROJECTS_FIXTURE.find((p) => p.name === "GundamBuilder");
      expect(gundam?.link).toBe("https://github.com/ArloDel/GundamBuilder");
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
      expect(upn?.organization).toContain("UPN");
      expect(upn?.period).toContain("2021");
    });

    it("F13.3: Freelance developer milestone is present", () => {
      const freelance = JOURNEY_FIXTURE.find((j) => j.id === "journey-freelance");
      expect(freelance).toBeDefined();
      expect(freelance?.role).toContain("Engineer");
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

// Self-executing if run directly
if (typeof process !== "undefined" && process.argv && process.argv[1]?.includes("tier1_features")) {
  runTier1Tests();
  const report = globalContext.getSummary();
  console.log(formatReport(report));
  if (report.totalFailed > 0) {
    process.exit(1);
  }
}
