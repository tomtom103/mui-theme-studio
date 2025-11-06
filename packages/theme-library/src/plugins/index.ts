// Plugin system exports
export * from './types';
export * from './PluginManager';
export * from './animationPlugin';
export * from './accessibilityPlugin';
export * from './responsivePlugin';

import { animationPlugin } from './animationPlugin';
import { accessibilityPlugin } from './accessibilityPlugin';
import { responsivePlugin } from './responsivePlugin';

export const BUILT_IN_PLUGINS = [
  animationPlugin,
  accessibilityPlugin,
  responsivePlugin,
];
