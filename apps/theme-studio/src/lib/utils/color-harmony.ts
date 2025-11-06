// lib/utils/color-harmony.ts

/**
 * Convert hex color to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  const color = hex.replace("#", "");

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(
  hOrObj: number | { h: number; s: number; l: number },
  s?: number,
  l?: number,
): string {
  const h = typeof hOrObj === "object" ? hOrObj.h : hOrObj;
  const sat = typeof hOrObj === "object" ? hOrObj.s : s!;
  const light = typeof hOrObj === "object" ? hOrObj.l : l!;

  const hue = h / 360;
  const saturation = sat / 100;
  const lightness = light / 100;

  let r, g, b;

  if (saturation === 0) {
    r = g = b = lightness;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q =
      lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;

    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Adjust lightness for color variants
 */
export function adjustLightness(hex: string, amount: number): string {
  const hsl = hexToHSL(hex);
  const newL = Math.max(0, Math.min(100, hsl.l + amount));
  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Adjust saturation
 */
export function adjustSaturation(hex: string, amount: number): string {
  const hsl = hexToHSL(hex);
  const newS = Math.max(0, Math.min(100, hsl.s + amount));
  return hslToHex(hsl.h, newS, hsl.l);
}

/**
 * Generate complementary color (opposite on color wheel)
 */
export function getComplementary(hex: string): string {
  const hsl = hexToHSL(hex);
  const newH = (hsl.h + 180) % 360;
  return hslToHex(newH, hsl.s, hsl.l);
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function getAnalogous(hex: string): [string, string] {
  const hsl = hexToHSL(hex);
  const h1 = (hsl.h + 30) % 360;
  const h2 = (hsl.h - 30 + 360) % 360;
  return [hslToHex(h1, hsl.s, hsl.l), hslToHex(h2, hsl.s, hsl.l)];
}

/**
 * Generate triadic colors (120° apart on color wheel)
 */
export function getTriadic(hex: string): [string, string] {
  const hsl = hexToHSL(hex);
  const h1 = (hsl.h + 120) % 360;
  const h2 = (hsl.h + 240) % 360;
  return [hslToHex(h1, hsl.s, hsl.l), hslToHex(h2, hsl.s, hsl.l)];
}

/**
 * Generate tetradic colors (90° apart on color wheel - square)
 */
export function getTetradic(hex: string): [string, string, string] {
  const hsl = hexToHSL(hex);
  const h1 = (hsl.h + 90) % 360;
  const h2 = (hsl.h + 180) % 360;
  const h3 = (hsl.h + 270) % 360;
  return [
    hslToHex(h1, hsl.s, hsl.l),
    hslToHex(h2, hsl.s, hsl.l),
    hslToHex(h3, hsl.s, hsl.l),
  ];
}

/**
 * Generate square colors (same as tetradic - 90° apart)
 */
export function getSquare(hex: string): [string, string, string] {
  return getTetradic(hex);
}

/**
 * Generate compound (rectangular) colors
 * Two pairs of complementary colors
 */
export function getCompound(hex: string): [string, string, string] {
  const hsl = hexToHSL(hex);
  const h1 = (hsl.h + 30) % 360;   // Adjacent color
  const h2 = (hsl.h + 180) % 360;  // Complementary
  const h3 = (hsl.h + 210) % 360;  // Complementary of adjacent
  return [
    hslToHex(h1, hsl.s, hsl.l),
    hslToHex(h2, hsl.s, hsl.l),
    hslToHex(h3, hsl.s, hsl.l),
  ];
}

/**
 * Generate split-complementary colors
 */
export function getSplitComplementary(hex: string): [string, string] {
  const hsl = hexToHSL(hex);
  const h1 = (hsl.h + 150) % 360;
  const h2 = (hsl.h + 210) % 360;
  return [hslToHex(h1, hsl.s, hsl.l), hslToHex(h2, hsl.s, hsl.l)];
}

/**
 * Generate monochromatic palette (same hue, different lightness)
 */
export function getMonochromatic(hex: string, count: number = 5): string[] {
  const hsl = hexToHSL(hex);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const l = 20 + (i * 60) / (count - 1);
    colors.push(hslToHex(hsl.h, hsl.s, l));
  }

  return colors;
}

/**
 * Generate shades (variations in saturation and lightness)
 */
export function getShades(hex: string, count: number = 5): string[] {
  const hsl = hexToHSL(hex);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const s = 20 + (i * 80) / (count - 1); // Saturation 20-100%
    const l = 30 + (i * 40) / (count - 1); // Lightness 30-70%
    colors.push(hslToHex(hsl.h, s, l));
  }

  return colors;
}

/**
 * Generate custom harmony colors based on specified angles
 */
export function getCustom(hex: string, angles: number[]): string[] {
  const hsl = hexToHSL(hex);
  return angles.map(angle => {
    const h = (hsl.h + angle) % 360;
    return hslToHex(h, hsl.s, hsl.l);
  });
}

/**
 * Generate a random vibrant color
 */
export function getRandomVibrantColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 40); // 60-100%
  const l = 45 + Math.floor(Math.random() * 20); // 45-65%
  return hslToHex(h, s, l);
}

/**
 * Ensure good contrast for text
 */
export function getContrastColor(hex: string): string {
  const hsl = hexToHSL(hex);
  // If light color, return dark text. If dark color, return light text
  return hsl.l > 50 ? "#000000" : "#ffffff";
}

export type ColorHarmonyType =
  | "analogous"
  | "monochromatic"
  | "triad"
  | "complementary"
  | "split-complementary"
  | "square"
  | "compound"
  | "shades"
  | "custom";

/**
 * Generate a complete color palette based on a base color and harmony type
 */
export function generatePalette(
  baseColor: string,
  harmonyType: ColorHarmonyType,
) {
  const hsl = hexToHSL(baseColor);

  // Ensure vibrant colors
  const vibrantBase = hslToHex(
    hsl.h,
    Math.max(hsl.s, 60),
    Math.max(Math.min(hsl.l, 55), 45),
  );

  let colors: string[] = [];

  switch (harmonyType) {
    case "analogous":
      colors = [vibrantBase, ...getAnalogous(vibrantBase)];
      break;
    case "monochromatic":
      colors = getMonochromatic(vibrantBase, 7);
      break;
    case "triad":
      colors = [vibrantBase, ...getTriadic(vibrantBase)];
      break;
    case "complementary":
      colors = [vibrantBase, getComplementary(vibrantBase)];
      break;
    case "split-complementary":
      colors = [vibrantBase, ...getSplitComplementary(vibrantBase)];
      break;
    case "square":
      colors = [vibrantBase, ...getSquare(vibrantBase)];
      break;
    case "compound":
      colors = [vibrantBase, ...getCompound(vibrantBase)];
      break;
    case "shades":
      colors = getShades(vibrantBase, 7);
      break;
    case "custom":
      // Default custom angles (can be customized later)
      colors = [vibrantBase, ...getCustom(vibrantBase, [30, 60, 120])];
      break;
  }

  return {
    primary: {
      main: colors[0],
      light: adjustLightness(colors[0], 15),
      dark: adjustLightness(colors[0], -15),
      contrastText: getContrastColor(colors[0]),
    },
    secondary: {
      main: colors[1] || colors[0],
      light: adjustLightness(colors[1] || colors[0], 15),
      dark: adjustLightness(colors[1] || colors[0], -15),
      contrastText: getContrastColor(colors[1] || colors[0]),
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#ffffff",
    },
    warning: {
      main: colors[2] ? adjustLightness(colors[2], 10) : "#ed6c02",
      light: colors[2] ? adjustLightness(colors[2], 25) : "#ff9800",
      dark: colors[2] ? adjustLightness(colors[2], -5) : "#e65100",
      contrastText: "#ffffff",
    },
    info: {
      main: colors[3] || "#0288d1",
      light: colors[3] ? adjustLightness(colors[3], 15) : "#03a9f4",
      dark: colors[3] ? adjustLightness(colors[3], -15) : "#01579b",
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
  };
}
