// Accessibility plugin
import { ThemePlugin } from './types';

export interface AccessibilityOptions {
  focusVisible?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  minTargetSize?: number; // in pixels
}

export const accessibilityPlugin: ThemePlugin = {
  name: 'accessibility',
  version: '1.0.0',
  priority: 5,
  apply: (theme, options: AccessibilityOptions = {}) => {
    const {
      focusVisible = true,
      reducedMotion = false,
      minTargetSize = 44,
    } = options;

    const components: any = { ...theme.components };

    // Focus visible
    if (focusVisible) {
      const focusStyle = {
        '&:focus-visible': {
          outline: '3px solid',
          outlineColor: (theme.palette?.primary as any)?.main || '#1976d2',
          outlineOffset: '2px',
        },
      };

      Object.keys(components || {}).forEach((key) => {
        if (!components[key]) components[key] = {};
        if (!components[key].styleOverrides) components[key].styleOverrides = {};
        components[key].styleOverrides.root = {
          ...components[key].styleOverrides?.root,
          ...focusStyle,
        };
      });
    }

    // Minimum target size
    const interactiveComponents = [
      'MuiButton',
      'MuiIconButton',
      'MuiCheckbox',
      'MuiRadio',
      'MuiSwitch',
    ];

    interactiveComponents.forEach((comp) => {
      if (!components[comp]) components[comp] = {};
      if (!components[comp].styleOverrides) components[comp].styleOverrides = {};
      components[comp].styleOverrides.root = {
        ...components[comp].styleOverrides?.root,
        minWidth: minTargetSize,
        minHeight: minTargetSize,
      };
    });

    // Reduced motion
    if (reducedMotion) {
      const mediaQuery = '@media (prefers-reduced-motion: reduce)';
      Object.keys(components || {}).forEach((key) => {
        if (!components[key]) components[key] = {};
        if (!components[key].styleOverrides) components[key].styleOverrides = {};
        components[key].styleOverrides.root = {
          ...components[key].styleOverrides?.root,
          [mediaQuery]: {
            animation: 'none !important',
            transition: 'none !important',
          },
        };
      });
    }

    return { ...theme, components };
  },
};
