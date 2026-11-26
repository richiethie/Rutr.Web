/** Helpers for org brandPrimaryColor → CSS accent tokens. */

const DEFAULT_BRAND = "#0369a1";

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parseHex(color: string): { r: number; g: number; b: number } | null {
  const raw = color.trim();
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(raw);
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function relativeLuminance(r: number, g: number, b: number) {
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

export function normalizeBrandColor(color: string | null | undefined): string {
  if (!color) return DEFAULT_BRAND;
  return parseHex(color) ? color.trim() : DEFAULT_BRAND;
}

/** Soft fill + ring + readable foreground on brand solid. */
export function brandTokenSet(color: string | null | undefined): Record<string, string> {
  const hex = normalizeBrandColor(color);
  const rgb = parseHex(hex) ?? { r: 3, g: 105, b: 161 };
  const soft = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.14)`;
  const ring = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`;
  const fg = relativeLuminance(rgb.r, rgb.g, rgb.b) > 0.55 ? "#18181b" : "#fafafa";
  // Slightly darken for hover if needed
  const deep = `rgb(${clamp(rgb.r * 0.85)}, ${clamp(rgb.g * 0.85)}, ${clamp(rgb.b * 0.85)})`;
  return {
    "--brand": hex,
    "--brand-foreground": fg,
    "--brand-soft": soft,
    "--brand-ring": ring,
    "--signal": hex,
    "--signal-soft": soft,
    "--signal-glow": ring,
    "--console-accent": hex,
    "--console-accent-hover": deep,
    "--console-accent-soft": soft,
    "--console-accent-ring": ring,
    "--sidebar-primary": hex,
    "--sidebar-primary-foreground": fg,
    "--ring": hex,
  };
}

/**
 * What org brandPrimaryColor drives in the staff console (Phase 1).
 * Document for Richie / settings copy.
 */
export const BRAND_COLOR_DRIVES = [
  "Sidebar logo mark + “New job” primary button (--sidebar-primary)",
  "Brand accents: badges, key links, console accent (--brand / --signal)",
  "Input focus rings (--ring / --brand-ring)",
  "Active nav emphasis when using brand-soft highlights",
] as const;
