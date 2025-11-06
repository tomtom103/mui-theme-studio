// lib/theme/style-colors.ts
import type { DesignStyle, BrandTokens } from "./types";

/**
 * Get recommended color palettes for each design style
 */
export function getStyleColorPalette(designStyle: DesignStyle): Partial<BrandTokens['palette']> {
  switch (designStyle) {
    case 'cyberpunk':
      return {
        primary: {
          main: "#00ffff",
          light: "#6dffff",
          dark: "#00b2b3",
          contrastText: "#000000",
        },
        secondary: {
          main: "#ff00ff",
          light: "#ff5cff",
          dark: "#c400c4",
          contrastText: "#000000",
        },
        error: {
          main: "#ff0055",
          light: "#ff5c85",
          dark: "#c4003f",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#ffaa00",
          light: "#ffcd4d",
          dark: "#c47f00",
          contrastText: "#000000",
        },
        info: {
          main: "#00d4ff",
          light: "#5ce3ff",
          dark: "#009fc4",
          contrastText: "#000000",
        },
        success: {
          main: "#00ff88",
          light: "#5cffb3",
          dark: "#00c462",
          contrastText: "#000000",
        },
      };

    case 'retro':
      return {
        primary: {
          main: "#d4a574",
          light: "#e6c9a8",
          dark: "#a07d4e",
          contrastText: "#1a1a1a",
        },
        secondary: {
          main: "#8b6f47",
          light: "#b39975",
          dark: "#5d4a2f",
          contrastText: "#ffffff",
        },
        error: {
          main: "#c44536",
          light: "#d97567",
          dark: "#8e3025",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#d4a237",
          light: "#e6c36b",
          dark: "#a07827",
          contrastText: "#1a1a1a",
        },
        info: {
          main: "#6b9fa8",
          light: "#9dc4cc",
          dark: "#4a7178",
          contrastText: "#ffffff",
        },
        success: {
          main: "#7a9f6f",
          light: "#a7c49f",
          dark: "#557149",
          contrastText: "#ffffff",
        },
      };

    case 'gradient-mesh':
      return {
        primary: {
          main: "#6366f1",
          light: "#a5b4fc",
          dark: "#4338ca",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#ec4899",
          light: "#f9a8d4",
          dark: "#be185d",
          contrastText: "#ffffff",
        },
        error: {
          main: "#ef4444",
          light: "#fca5a5",
          dark: "#b91c1c",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#f59e0b",
          light: "#fcd34d",
          dark: "#b45309",
          contrastText: "#000000",
        },
        info: {
          main: "#3b82f6",
          light: "#93c5fd",
          dark: "#1e40af",
          contrastText: "#ffffff",
        },
        success: {
          main: "#10b981",
          light: "#6ee7b7",
          dark: "#047857",
          contrastText: "#ffffff",
        },
      };

    case 'material-design-3':
      return {
        primary: {
          main: "#6750a4",
          light: "#d0bcff",
          dark: "#381e72",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#625b71",
          light: "#e8def8",
          dark: "#332d41",
          contrastText: "#ffffff",
        },
        error: {
          main: "#b3261e",
          light: "#f2b8b5",
          dark: "#8c1d18",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#7d5260",
          light: "#ffd8e4",
          dark: "#5d3f4a",
          contrastText: "#ffffff",
        },
        info: {
          main: "#006a6a",
          light: "#a7d8d8",
          dark: "#00504f",
          contrastText: "#ffffff",
        },
        success: {
          main: "#386a20",
          light: "#c4ead0",
          dark: "#28501a",
          contrastText: "#ffffff",
        },
      };

    case 'glassmorphism':
      return {
        primary: {
          main: "#3b82f6",
          light: "#60a5fa",
          dark: "#2563eb",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#8b5cf6",
          light: "#a78bfa",
          dark: "#7c3aed",
          contrastText: "#ffffff",
        },
        error: {
          main: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
          contrastText: "#000000",
        },
        info: {
          main: "#06b6d4",
          light: "#22d3ee",
          dark: "#0891b2",
          contrastText: "#ffffff",
        },
        success: {
          main: "#10b981",
          light: "#34d399",
          dark: "#059669",
          contrastText: "#ffffff",
        },
      };

    case 'neumorphism':
      return {
        primary: {
          main: "#5c7cfa",
          light: "#91a7ff",
          dark: "#4263eb",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#748ffc",
          light: "#91a7ff",
          dark: "#5c7cfa",
          contrastText: "#ffffff",
        },
        error: {
          main: "#fa5252",
          light: "#ff8787",
          dark: "#e03131",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#fd7e14",
          light: "#ffa94d",
          dark: "#e8590c",
          contrastText: "#ffffff",
        },
        info: {
          main: "#339af0",
          light: "#74c0fc",
          dark: "#1c7ed6",
          contrastText: "#ffffff",
        },
        success: {
          main: "#51cf66",
          light: "#8ce99a",
          dark: "#37b24d",
          contrastText: "#ffffff",
        },
      };

    case 'brutalism':
      return {
        primary: {
          main: "#000000",
          light: "#333333",
          dark: "#000000",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#ff0000",
          light: "#ff4444",
          dark: "#cc0000",
          contrastText: "#ffffff",
        },
        error: {
          main: "#ff0000",
          light: "#ff4444",
          dark: "#cc0000",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#ffff00",
          light: "#ffff66",
          dark: "#cccc00",
          contrastText: "#000000",
        },
        info: {
          main: "#0000ff",
          light: "#4444ff",
          dark: "#0000cc",
          contrastText: "#ffffff",
        },
        success: {
          main: "#00ff00",
          light: "#44ff44",
          dark: "#00cc00",
          contrastText: "#000000",
        },
      };

    case 'flat-design':
    case 'minimal':
    default:
      // Return neutral colors for minimal/flat - keep existing colors
      return {};
  }
}

/**
 * Check if a design style has recommended colors
 */
export function hasStyleColors(designStyle?: DesignStyle): boolean {
  if (!designStyle) return false;
  return !['minimal', 'flat-design'].includes(designStyle);
}
