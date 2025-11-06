// lib/theme/defaults.ts
import type { BrandConfig, DesignStyle } from "./types";

export function getDefaultBrand(): BrandConfig {
  return {
    id: "default-brand",
    name: "Default Brand",
    description: "A default Material Design theme",
    designStyle: "minimal", // Default design style
    tokens: {
      palette: {
        primary: {
          main: "#1976d2",
          light: "#42a5f5",
          dark: "#1565c0",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#9c27b0",
          light: "#ba68c8",
          dark: "#7b1fa2",
          contrastText: "#ffffff",
        },
        error: {
          main: "#d32f2f",
          light: "#ef5350",
          dark: "#c62828",
          contrastText: "#ffffff",
        },
        warning: {
          main: "#ed6c02",
          light: "#ff9800",
          dark: "#e65100",
          contrastText: "#ffffff",
        },
        info: {
          main: "#0288d1",
          light: "#03a9f4",
          dark: "#01579b",
          contrastText: "#ffffff",
        },
        success: {
          main: "#2e7d32",
          light: "#4caf50",
          dark: "#1b5e20",
          contrastText: "#ffffff",
        },
        neutral: {
          main: "#64748b",
          light: "#94a3b8",
          dark: "#475569",
          contrastText: "#ffffff",
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontFamilyCode: '"Roboto Mono", monospace',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
          fontSize: "6rem",
          fontWeight: 300,
          lineHeight: 1.167,
          letterSpacing: "-0.01562em",
        },
        h2: {
          fontSize: "3.75rem",
          fontWeight: 300,
          lineHeight: 1.2,
          letterSpacing: "-0.00833em",
        },
        h3: {
          fontSize: "3rem",
          fontWeight: 400,
          lineHeight: 1.167,
          letterSpacing: "0em",
        },
        h4: {
          fontSize: "2.125rem",
          fontWeight: 400,
          lineHeight: 1.235,
          letterSpacing: "0.00735em",
        },
        h5: {
          fontSize: "1.5rem",
          fontWeight: 400,
          lineHeight: 1.334,
          letterSpacing: "0em",
        },
        h6: {
          fontSize: "1.25rem",
          fontWeight: 500,
          lineHeight: 1.6,
          letterSpacing: "0.0075em",
        },
        body1: {
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: "0.00938em",
        },
        body2: {
          fontSize: "0.875rem",
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: "0.01071em",
        },
        button: {
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: 1.75,
          letterSpacing: "0.02857em",
        },
        caption: {
          fontSize: "0.75rem",
          fontWeight: 400,
          lineHeight: 1.66,
          letterSpacing: "0.03333em",
        },
      },
      shape: {
        borderRadius: 4,
      },
      spacing: 8,
      shadows: {
        sm: "0px 2px 4px rgba(0,0,0,0.1)",
        md: "0px 4px 8px rgba(0,0,0,0.12)",
        lg: "0px 8px 16px rgba(0,0,0,0.14)",
        xl: "0px 16px 32px rgba(0,0,0,0.16)",
      },
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0.0",
    },
  };
}

/**
 * Create a new brand with default tokens and custom name/design style
 */
export function createNewBrand(
  name: string,
  designStyle: DesignStyle = "minimal"
): BrandConfig {
  const defaultBrand = getDefaultBrand();
  return {
    ...defaultBrand,
    id: `brand-${Date.now()}`,
    name,
    description: "",
    designStyle,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0.0",
    },
  };
}
