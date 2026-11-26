"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = THEME_STORAGE_KEY;

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (value: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolve(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

function applyDomTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("light");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  useEffect(() => {
    let stored: ThemePreference = "light";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "light" || raw === "dark" || raw === "system") stored = raw;
    } catch {
      /* ignore */
    }
    const next = resolve(stored);
    setPreferenceState(stored);
    setResolved(next);
    applyDomTheme(next);
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = getSystemTheme();
      setResolved(next);
      applyDomTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    const next = resolve(value);
    setResolved(next);
    applyDomTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

const OPTIONS: {
  value: ThemePreference;
  label: string;
  hint: string;
  icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", hint: "Bright zinc surfaces", icon: Sun },
  { value: "dark", label: "Dark", hint: "Dashboard charcoal", icon: Moon },
  { value: "system", label: "System", hint: "Match OS setting", icon: Monitor },
];

/** Settings control — light / dark / system. */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = preference === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPreference(opt.value)}
            className={
              active
                ? "flex flex-col items-start gap-2 rounded-lg border border-brand/40 bg-brand-soft p-3 text-left shadow-sm ring-1 ring-brand/20 transition-colors"
                : "flex flex-col items-start gap-2 rounded-lg border border-border bg-content p-3 text-left transition-colors hover:bg-muted dark:bg-muted"
            }
          >
            <span
              className={
                active
                  ? "flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground"
                  : "flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[13px] font-medium text-foreground">{opt.label}</span>
              <span className="mt-0.5 block text-[11px] text-muted-foreground">{opt.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
