/**
 * Metaphor: ReFantazio Test Framework
 * Ultra-fast, zero-dependency, standalone test harness for E2E specification verification.
 */

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: Error;
  durationMs: number;
}

export interface SuiteSummary {
  name: string;
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestResult[];
}

export interface GlobalTestReport {
  suites: SuiteSummary[];
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  durationMs: number;
}

class TestContext {
  private currentSuite = "Default Suite";
  private suites: Map<string, TestResult[]> = new Map();
  private startTime = 0;

  setSuite(name: string) {
    this.currentSuite = name;
    if (!this.suites.has(name)) {
      this.suites.set(name, []);
    }
  }

  recordResult(result: TestResult) {
    const list = this.suites.get(this.currentSuite) || [];
    list.push(result);
    this.suites.set(this.currentSuite, list);
  }

  getSummary(): GlobalTestReport {
    const suitesSummary: SuiteSummary[] = [];
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

export const globalContext = new TestContext();

export function describe(name: string, fn: () => void | Promise<void>) {
  globalContext.setSuite(name);
  const result = fn();
  if (result && typeof (result as Promise<void>).then === "function") {
    // Note: for async describe suites
    return (result as Promise<void>).catch((err) => {
      console.error(`Error executing suite "${name}":`, err);
    });
  }
}

export async function it(name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  try {
    const res = fn();
    if (res && typeof (res as Promise<void>).then === "function") {
      await res;
    }
    const duration = performance.now() - start;
    globalContext.recordResult({
      suite: "current",
      name,
      passed: true,
      durationMs: duration,
    });
  } catch (error: any) {
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

export const test = it;

export function expect<T>(actual: T) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected: any) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`Expected deep equality:\nExpected: ${b}\nReceived: ${a}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== "number" || actual < expected) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (typeof actual !== "number" || actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== "number" || actual > expected) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    },
    toContain(item: any) {
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
    toMatch(regex: RegExp) {
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
    toHaveLength(len: number) {
      if (!actual || typeof (actual as any).length !== "number" || (actual as any).length !== len) {
        const actualLen = actual && (actual as any).length;
        throw new Error(`Expected length ${len}, received ${actualLen}`);
      }
    },
    toHaveProperty(prop: string, value?: any) {
      if (actual === null || typeof actual !== "object" || !(prop in (actual as any))) {
        throw new Error(`Expected object to have property "${prop}"`);
      }
      if (arguments.length > 1 && (actual as any)[prop] !== value) {
        throw new Error(`Expected property "${prop}" to equal ${JSON.stringify(value)}, received ${JSON.stringify((actual as any)[prop])}`);
      }
    },
    toThrow(expectedMessage?: string | RegExp) {
      if (typeof actual !== "function") {
        throw new Error(`Expected a function to test for throwing, received ${typeof actual}`);
      }
      let didThrow = false;
      let thrownError: any = null;
      try {
        (actual as any)();
      } catch (err) {
        didThrow = true;
        thrownError = err;
      }
      if (!didThrow) {
        throw new Error(`Expected function to throw, but it did not throw`);
      }
      if (expectedMessage) {
        const msg = thrownError instanceof Error ? thrownError.message : String(thrownError);
        if (typeof expectedMessage === "string" && !msg.includes(expectedMessage)) {
          throw new Error(`Expected error message to contain "${expectedMessage}", got "${msg}"`);
        }
        if (expectedMessage instanceof RegExp && !expectedMessage.test(msg)) {
          throw new Error(`Expected error message to match ${expectedMessage}, got "${msg}"`);
        }
      }
    },
    get not() {
      return {
        toBe(expected: any) {
          if (actual === expected) {
            throw new Error(`Expected not ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
          }
        },
        toEqual(expected: any) {
          if (JSON.stringify(actual) === JSON.stringify(expected)) {
            throw new Error(`Expected not deep equality with ${JSON.stringify(expected)}`);
          }
        },
        toContain(item: any) {
          if (typeof actual === "string" && actual.includes(String(item))) {
            throw new Error(`Expected string "${actual}" NOT to contain "${item}"`);
          }
          if (Array.isArray(actual) && actual.includes(item)) {
            throw new Error(`Expected array NOT to contain ${JSON.stringify(item)}`);
          }
        },
        toBeNull() {
          if (actual === null) {
            throw new Error(`Expected non-null value, received null`);
          }
        },
        toBeTruthy() {
          if (actual) {
            throw new Error(`Expected falsy value, received truthy ${JSON.stringify(actual)}`);
          }
        },
      };
    },
  };
}

/**
 * Format and print test execution summary
 */
export function formatReport(report: GlobalTestReport): string {
  const lines: string[] = [];
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
