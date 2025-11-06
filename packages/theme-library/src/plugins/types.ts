// Plugin interface definitions
import { ThemeOptions } from '@mui/material/styles';

export interface ThemePlugin {
  name: string;
  version?: string;
  apply: (theme: ThemeOptions, options?: any) => ThemeOptions;
  priority?: number; // Lower = earlier
  dependencies?: string[]; // Other plugin names
}

export interface PluginManager {
  register(plugin: ThemePlugin): void;
  apply(theme: ThemeOptions, options?: Record<string, any>): ThemeOptions;
  get(name: string): ThemePlugin | undefined;
  list(): ThemePlugin[];
}
