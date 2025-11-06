// Plugin manager implementation
import { ThemeOptions } from '@mui/material/styles';
import { ThemePlugin, PluginManager } from './types';

export class DefaultPluginManager implements PluginManager {
  private plugins = new Map<string, ThemePlugin>();

  register(plugin: ThemePlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }
    this.plugins.set(plugin.name, plugin);
  }

  apply(theme: ThemeOptions, options?: Record<string, any>): ThemeOptions {
    let result = theme;

    // Sort by priority
    const sortedPlugins = Array.from(this.plugins.values()).sort(
      (a, b) => (a.priority || 999) - (b.priority || 999)
    );

    // Check dependencies
    for (const plugin of sortedPlugins) {
      if (plugin.dependencies) {
        for (const dep of plugin.dependencies) {
          if (!this.plugins.has(dep)) {
            console.error(`Plugin ${plugin.name} requires ${dep}`);
            continue;
          }
        }
      }

      const pluginOptions = options?.[plugin.name];
      result = plugin.apply(result, pluginOptions);
    }

    return result;
  }

  get(name: string): ThemePlugin | undefined {
    return this.plugins.get(name);
  }

  list(): ThemePlugin[] {
    return Array.from(this.plugins.values());
  }
}
