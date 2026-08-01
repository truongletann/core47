import type { CSSProperties } from "react";
import type { BIO_THEMES } from "./schema";

export type BioTheme = (typeof BIO_THEMES)[number];

export interface ThemeConfig {
  label: string;
  background: string; // CSS gradient/background value
  textColor: string;
  mutedTextColor: string;
  cardBg: string; // avatar ring / card backdrop
  accent: string; // solid button bg / outline+soft accent color
  accentText: string; // text color on top of a solid accent button
}

export const BIO_THEME_CONFIG: Record<BioTheme, ThemeConfig> = {
  sunset: {
    label: "Sunset",
    background: "linear-gradient(160deg, #ff7e5f 0%, #feb47b 50%, #ffd88a 100%)",
    textColor: "#3a1f0f",
    mutedTextColor: "rgba(58,31,15,0.7)",
    cardBg: "rgba(255,255,255,0.35)",
    accent: "#c2410c",
    accentText: "#ffffff",
  },
  ocean: {
    label: "Ocean",
    background: "linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    textColor: "#f0fbff",
    mutedTextColor: "rgba(240,251,255,0.7)",
    cardBg: "rgba(255,255,255,0.08)",
    accent: "#22d3ee",
    accentText: "#052027",
  },
  forest: {
    label: "Forest",
    background: "linear-gradient(160deg, #134e4a 0%, #2f6f4e 50%, #86a86b 100%)",
    textColor: "#f2f9ee",
    mutedTextColor: "rgba(242,249,238,0.75)",
    cardBg: "rgba(255,255,255,0.1)",
    accent: "#65a30d",
    accentText: "#ffffff",
  },
  midnight: {
    label: "Midnight",
    background: "linear-gradient(160deg, #0b0f19 0%, #1a1f36 50%, #2c2f57 100%)",
    textColor: "#eef0ff",
    mutedTextColor: "rgba(238,240,255,0.65)",
    cardBg: "rgba(255,255,255,0.06)",
    accent: "#818cf8",
    accentText: "#0b0f19",
  },
  candy: {
    label: "Candy",
    background: "linear-gradient(160deg, #ff9a9e 0%, #fecfef 50%, #fbc2eb 100%)",
    textColor: "#5b1030",
    mutedTextColor: "rgba(91,16,48,0.7)",
    cardBg: "rgba(255,255,255,0.4)",
    accent: "#db2777",
    accentText: "#ffffff",
  },
  mono: {
    label: "Mono",
    background: "linear-gradient(160deg, #fafafa 0%, #e5e5e5 100%)",
    textColor: "#171717",
    mutedTextColor: "rgba(23,23,23,0.65)",
    cardBg: "rgba(0,0,0,0.04)",
    accent: "#171717",
    accentText: "#ffffff",
  },
  // Placeholder entry — "custom" is never read directly, resolveThemeConfig()
  // always computes it from the page's backgroundColor instead.
  custom: {
    label: "Custom",
    background: "#6d28d9",
    textColor: "#f8fafc",
    mutedTextColor: "rgba(248,250,252,0.7)",
    cardBg: "rgba(255,255,255,0.1)",
    accent: "#f8fafc",
    accentText: "#111827",
  },
};

export function isColorDark(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return true;
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

// Resolves the "custom" theme's ThemeConfig against the page's chosen solid
// background color, auto-picking light/dark text+accent for contrast. Every
// other theme just returns its fixed config.
export function resolveThemeConfig(theme: BioTheme, customBackgroundColor?: string | null): ThemeConfig {
  if (theme !== "custom") return BIO_THEME_CONFIG[theme];

  const bg = customBackgroundColor && /^#[0-9a-fA-F]{6}$/.test(customBackgroundColor) ? customBackgroundColor : "#6d28d9";
  const dark = isColorDark(bg);
  return {
    label: "Custom",
    background: bg,
    textColor: dark ? "#f8fafc" : "#111827",
    mutedTextColor: dark ? "rgba(248,250,252,0.7)" : "rgba(17,24,39,0.65)",
    cardBg: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    accent: dark ? "#f8fafc" : "#111827",
    accentText: dark ? "#111827" : "#f8fafc",
  };
}

export function buttonStyleClass(
  buttonStyle: "solid" | "outline" | "soft",
  theme: ThemeConfig,
  overrideColor?: string | null,
): CSSProperties {
  const accent = overrideColor || theme.accent;
  const accentText = overrideColor ? (isColorDark(overrideColor) ? "#ffffff" : "#111827") : theme.accentText;

  if (buttonStyle === "solid") {
    return { background: accent, color: accentText, borderColor: accent };
  }
  if (buttonStyle === "outline") {
    return { background: "transparent", color: overrideColor || theme.textColor, borderColor: overrideColor || theme.textColor };
  }
  return {
    background: overrideColor ? `${overrideColor}33` : theme.cardBg,
    color: overrideColor || theme.textColor,
    borderColor: "transparent",
  };
}
