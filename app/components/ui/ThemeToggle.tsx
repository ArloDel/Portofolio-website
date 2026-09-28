"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: icons render only after mount
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass-chip group fixed right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:border-accent/40 hover:text-ink"
    >
      <span className="sr-only">Toggle color theme</span>
      {mounted ? (
        isDark ? (
          <Moon
            className="h-[18px] w-[18px] transition-transform duration-500 group-hover:-rotate-12"
            strokeWidth={1.5}
          />
        ) : (
          <Sun
            className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-90"
            strokeWidth={1.5}
          />
        )
      ) : (
        <span className="block h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
