// Responsive plugin
import { ThemePlugin } from './types';

export interface ResponsiveOptions {
  breakpoints?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  fluidTypography?: boolean;
}

export const responsivePlugin: ThemePlugin = {
  name: 'responsive',
  version: '1.0.0',
  priority: 15,
  apply: (theme, options: ResponsiveOptions = {}) => {
    const { breakpoints, fluidTypography = false } = options;

    let result = { ...theme };

    if (breakpoints) {
      result.breakpoints = {
        ...theme.breakpoints,
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
          ...theme.breakpoints?.values,
          ...breakpoints,
        },
      };
    }

    if (fluidTypography) {
      // Implement fluid typography
      result.typography = {
        ...theme.typography,
        fontSize: 16,
        htmlFontSize: 16,
        h1: {
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        },
        h2: {
          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
        },
        h3: {
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        },
        body1: {
          fontSize: 'clamp(0.875rem, 1vw, 1rem)',
        },
      };
    }

    return result;
  },
};
