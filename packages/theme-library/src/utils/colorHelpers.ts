// Color manipulation helpers
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const adjustBrightness = (color: string, amount: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const adjust = (value: number) => Math.max(0, Math.min(255, value + amount));
  
  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
};

export const adjustOpacity = (color: string, opacity: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, opacity))})`;
};

export const getLuminance = (color: string): number => {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const meetsContrastRequirements = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};
