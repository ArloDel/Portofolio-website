# Test Infrastructure & Specification Verification Framework
**Project:** Metaphor: ReFantazio Themed Personal Portfolio for Hakeeem (@ArloDel)  
**Document Version:** 1.0.0  
**Test Harness Scope:** Opaque-Box, Contract-Driven E2E Test Suite (Tiers 1–4)

---

## 1. Test Philosophy & Core Principles

The test architecture for the Metaphor: ReFantazio portfolio website is built upon the following core tenets:

1. **Opaque-Box & Requirement-Driven**: Tests assert observable outcomes, DOM contracts, accessibility compliance, visual tokens, responsive boundaries, and user workflows directly against `ORIGINAL_REQUEST.md` and `PROJECT.md` specifications. Tests maintain **zero coupling to internal implementation details** (such as private state variables or transient hook internals).
2. **Deterministic & Self-Contained**: Each test initializes its own state, executes deterministically, produces zero side-effects, and cleans up after execution. No test depends on the execution order or side-effects of another.
3. **Multi-Tiered Rigor**: Testing is structured into four distinct verification tiers covering complete feature inventory, edge and boundary stress cases, pairwise cross-feature integrations, and real-world persona journeys.
4. **Resilient & CI-Ready**: The test harness provides standalone CLI execution (`node tests/test_runner.ts`), granular assertion telemetry, human-readable test summaries, and strict exit code semantics.

---

## 2. Feature Inventory Mapping Matrix

Every feature defined in `PROJECT.md` and `ORIGINAL_REQUEST.md` is strictly mapped to test suites across all four tiers:

| Feature ID | Feature Name | Specification Reference | Tier 1 (Coverage) | Tier 2 (Boundaries) | Tier 3 (Interactions) | Tier 4 (Scenarios) |
|---|---|---|---|---|---|---|
| **F1** | Metaphor Color Palette | `ORIGINAL_REQUEST §R1` | `T1.1` (5 tests) | `T2.1` (5 tests) | `T3.4` (Palette sync) | `T4.1`, `T4.4` |
| **F2** | Bespoke Typography | `ORIGINAL_REQUEST §R1` | `T1.2` (5 tests) | `T2.2` (5 tests) | `T3.4` (Font hierarchy) | `T4.1`, `T4.4` |
| **F3** | Parchment & Ornate Texture | `ORIGINAL_REQUEST §R1` | `T1.3` (5 tests) | `T2.3` (5 tests) | `T3.4`, `T3.8` | `T4.1`, `T4.2` |
| **F4** | Custom Desktop Cursor | `ORIGINAL_REQUEST §R4` | `T1.4` (5 tests) | `T2.4` (5 tests) | `T3.1` (Pointer focus) | `T4.3` |
| **F5** | Reduced Motion Support | `ORIGINAL_REQUEST §R4` | `T1.5` (5 tests) | `T2.5` (5 tests) | `T3.5` (Motion bypass) | `T4.4` (A11y run) |
| **F6** | Desktop Fixed Side Nav | `ORIGINAL_REQUEST §R3` | `T1.6` (5 tests) | `T2.6` (5 tests) | `T3.1` (Scroll-spy) | `T4.1`, `T4.3` |
| **F7** | Mobile Bottom HUD Nav | `ORIGINAL_REQUEST §R3` | `T1.7` (5 tests) | `T2.7` (5 tests) | `T3.7` (HUD tap scroll) | `T4.5` (Mobile run) |
| **F8** | Shared UI Motifs | `ORIGINAL_REQUEST §R1` | `T1.8` (5 tests) | `T2.8` (5 tests) | `T3.8` (Hex + motif) | `T4.1`, `T4.2` |
| **F9** | Hero / Title Screen | `ORIGINAL_REQUEST §R2.1` | `T1.9` (5 tests) | `T2.9` (5 tests) | `T3.1`, `T3.5` | `T4.1`, `T4.3` |
| **F10** | About / Character Profile | `ORIGINAL_REQUEST §R2.2` | `T1.10` (5 tests) | `T2.10` (5 tests) | `T3.8` (Avatar frame) | `T4.1` (Recruiter) |
| **F11** | Projects / Quest Log | `ORIGINAL_REQUEST §R2.3` | `T1.11` (5 tests) | `T2.11` (5 tests) | `T3.2`, `T3.3` | `T4.1`, `T4.3` |
| **F12** | Skills / Archetype Tree | `ORIGINAL_REQUEST §R2.4` | `T1.12` (5 tests) | `T2.12` (5 tests) | `T3.2` (Tree + Quest) | `T4.3` (Dev deep dive) |
| **F13** | Experience / Journey Log | `ORIGINAL_REQUEST §R2.5` | `T1.13` (5 tests) | `T2.13` (5 tests) | `T3.1` (Slide reveals) | `T4.1` (Recruiter) |
| **F14** | Contact / Royal Decree | `ORIGINAL_REQUEST §R2.6` | `T1.14` (5 tests) | `T2.14` (5 tests) | `T3.6` (Wax seal modal) | `T4.2` (Client inquiry) |

---

## 3. Four-Tier Test Architecture

```
tests/
├── e2e/
│   ├── tier1_features.test.ts      # Tier 1: Feature Coverage (>=70 tests, >=5 per feature)
│   ├── tier2_boundaries.test.ts    # Tier 2: Boundary & Corner Cases (>=70 tests, >=5 per feature)
│   ├── tier3_interactions.test.ts  # Tier 3: Cross-Feature Combinations & Pairwise Integrations (>=8 tests)
│   └── tier4_scenarios.test.ts     # Tier 4: Real-World Persona & Workload Scenarios (>=5 scenarios)
├── helpers/
│   ├── test_framework.ts           # Ultra-fast standalone test runner, assertions, and DOM mocks
│   └── fixtures.ts                 # Authoritative test fixtures from ORIGINAL_REQUEST & PROJECT.md
└── test_runner.ts                  # Master CLI test suite orchestrator
```

### 3.1 Tier 1: Feature Coverage (`tier1_features.test.ts`)
Validates baseline contract conformance for all 14 discrete features in isolation.
- **Scope**: Every feature F1 through F14 has at least 5 distinct test cases (Total: >=70 tests).
- **Target**: Static data models, component markup structure, theme token bindings, CSS classes, SVG elements, typography rules, accessibility roles, and event handlers.

### 3.2 Tier 2: Boundary & Corner Cases (`tier2_boundaries.test.ts`)
Validates system resilience under non-ideal, extreme, or boundary conditions.
- **Scope**: Every feature F1 through F14 has at least 5 boundary test cases (Total: >=70 tests).
- **Target**: Viewport extremes (320px, 375px, 768px, 1280px, 4K), 0% and 100% stat bounds, missing image/text fallbacks, ultra-long strings, malformed email inputs, rapid interaction spam, and reduced motion toggling.

### 3.3 Tier 3: Cross-Feature Combinations (`tier3_interactions.test.ts`)
Validates pairwise integrations between multiple system components.
- **Scope**: Multi-component interaction flows.
- **Target**: 
  1. Scroll-spy navigation syncing with dynamic section viewports and CSS ink-underlines.
  2. Archetype Tree node hover highlighting matching tech badges in Quest Cards.
  3. Quest Log status filter adjustments and layout recomputation.
  4. Parchment texture and color palette consistency across all 6 sections.
  5. Reduced motion mode disabling particle canvas, keyframe animations, and stamp reveals simultaneously.
  6. Royal Decree submit action triggering wax seal stamp animation and form state locking.
  7. Mobile HUD navigation interaction and section scroll alignment.
  8. Hexagonal avatar clip path and parchment panel composite rendering.

### 3.4 Tier 4: Real-World Workload Scenarios (`tier4_scenarios.test.ts`)
Validates end-to-end user journeys representing real-world personas.
- **Scope**: Complete user flows from entry to exit.
- **Target**:
  1. **Recruiter Persona**: Landing -> Hero CTA -> Inspect Character Sheet -> Review 5 Quest Cards -> Validate Live URLs -> Inspect Journey Chapters.
  2. **Client Royal Decree Persona**: Navigating to Contact -> Filling hand-ruled fields -> Submitting Royal Dispatch -> Receiving Wax Seal Confirmation -> Visiting GitHub.
  3. **Developer Deep-Dive Persona**: Exploring Archetype Constellation -> Hovering/Clicking nodes -> Tracing SVG connector lines -> Inspecting GitHub repositories.
  4. **Accessibility / Reduced-Motion User**: Enabling reduced motion -> Keyboard navigation via Tab/Shift-Tab -> Testing ARIA attributes -> Verifying contrast ratios.
  5. **Mobile Field User**: Testing 375px viewport -> Bottom HUD navigation -> Verifying zero horizontal scroll overflow -> Touch target compliance.

---

## 4. Quality & Coverage Thresholds

| Metric | Target Threshold |
|---|---|
| **Feature Coverage** | 100% of Features (14 / 14) |
| **Tier 1 Test Count** | >= 70 test cases (>=5 per feature) |
| **Tier 2 Test Count** | >= 70 test cases (>=5 per feature) |
| **Tier 3 Test Count** | >= 8 interaction suites |
| **Tier 4 Test Count** | >= 5 persona workload scenarios |
| **Total Automated Tests** | **>= 150+ individual test cases** |
| **Flakiness Rate** | 0.0% (Zero non-deterministic timeouts or external network dependencies) |
| **Execution Time** | < 2,500 ms for entire test suite |

---

## 5. Execution Instructions

### Running the Entire E2E Test Suite
```bash
node tests/test_runner.ts
```

### Running Individual Tiers
```bash
node tests/e2e/tier1_features.test.ts
node tests/e2e/tier2_boundaries.test.ts
node tests/e2e/tier3_interactions.test.ts
node tests/e2e/tier4_scenarios.test.ts
```
