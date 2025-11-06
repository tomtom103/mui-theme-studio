// lib/utils/contrast-checker.ts

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const [rL, gL, bL] = [r, g, b].map((channel) => {
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  // Calculate luminance
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/**
 * Check contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function checkContrast(foreground: string, background: string): number {
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1)
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  return checkContrast(foreground, background) >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard (7:1)
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  return checkContrast(foreground, background) >= 7;
}
