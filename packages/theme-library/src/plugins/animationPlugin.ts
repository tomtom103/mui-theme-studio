// Animation plugin
import { ThemePlugin } from './types';

export interface AnimationOptions {
  duration?: number;
  easing?: string;
  components?: string[] | 'all';
}

export const animationPlugin: ThemePlugin = {
  name: 'animation',
  version: '1.0.0',
  priority: 10,
  apply: (theme, options: AnimationOptions = {}) => {
    const {
      duration = 300,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
      components = 'all',
    } = options;

    const transition = `all ${duration}ms ${easing}`;

    if (components === 'all') {
      return {
        ...theme,
        transitions: {
          ...theme.transitions,
          duration: {
            ...theme.transitions?.duration,
            standard: duration,
          },
          easing: {
            ...theme.transitions?.easing,
            easeInOut: easing,
          },
        },
      };
    }

    const updatedComponents: any = { ...theme.components };
    components.forEach((comp) => {
      if (!updatedComponents[comp]) updatedComponents[comp] = {};
      if (!updatedComponents[comp].styleOverrides) {
        updatedComponents[comp].styleOverrides = {};
      }
      updatedComponents[comp].styleOverrides.root = {
        ...updatedComponents[comp].styleOverrides?.root,
        transition,
      };
    });

    return { ...theme, components: updatedComponents };
  },
};
