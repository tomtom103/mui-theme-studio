// Typography token system
export const defaultTypographyTokens = {
  fontFamily: {
    heading: '"Roboto", "Helvetica", "Arial", sans-serif',
    body: '"Roboto", "Helvetica", "Arial", sans-serif',
    mono: '"Roboto Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export type TypographyToken = typeof defaultTypographyTokens;
