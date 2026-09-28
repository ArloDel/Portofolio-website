/**
 * Metaphor: ReFantazio Portfolio E2E Master Test Runner
 * Executes Tier 1 (Features), Tier 2 (Boundaries), Tier 3 (Interactions), and Tier 4 (Scenarios).
 */

import { globalContext, formatReport } from "./helpers/test_framework";
import { runTier1Tests } from "./e2e/tier1_features.test";
import { runTier2Tests } from "./e2e/tier2_boundaries.test";
import { runTier3Tests } from "./e2e/tier3_interactions.test";
import { runTier4Tests } from "./e2e/tier4_scenarios.test";

export async function runAllTests() {
  console.log("\n================================================================================");
  console.log("             METAPHOR: REFANTAZIO PORTFOLIO E2E TEST SUITE                      ");
  console.log("================================================================================");
  console.log("  Target: Hakeeem (@ArloDel) Personal Portfolio Website");
  console.log("  Framework: Next.js 14+ / Tailwind CSS / Zero-Dependency Motion");
  console.log("  Tiers: 1 (Features) | 2 (Boundaries) | 3 (Interactions) | 4 (Scenarios)\n");

  globalContext.clear();

  // Tier 1: Feature Coverage (>=70 tests)
  runTier1Tests();

  // Tier 2: Boundary & Corner Cases (>=70 tests)
  runTier2Tests();

  // Tier 3: Cross-Feature Combinations (>=8 tests)
  runTier3Tests();

  // Tier 4: Real-World Workload Scenarios (>=5 scenarios)
  runTier4Tests();

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

// Self-run on invocation
if (typeof process !== "undefined" && process.argv && process.argv[1]?.includes("test_runner")) {
  runAllTests();
}
