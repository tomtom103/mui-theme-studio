// Type validators
export const isValidColor = (color: string): boolean => {
  // Basic color validation (hex, rgb, rgba, hsl, named colors)
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
  const hslPattern = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
  
  return (
    hexPattern.test(color) ||
    rgbPattern.test(color) ||
    rgbaPattern.test(color) ||
    hslPattern.test(color)
  );
};

export const isValidNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const isValidString = (value: any): value is string => {
  return typeof value === 'string' && value.length > 0;
};
