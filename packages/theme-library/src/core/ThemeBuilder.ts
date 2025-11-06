// Main theme builder orchestrator
import { 
  createTheme, 
  ThemeOptions, 
  Theme 
} from '@mui/material/styles';
import { PresetBuilder } from './PresetBuilder';
import { DefaultPluginManager, ThemePlugin } from '../plugins';
import { ColorTokens, ThemeBuilderConfig } from '../types';
import { deepMerge } from '../utils/deepMerge';

export class ThemeBuilder {
  private config: ThemeBuilderConfig;
  private pluginManager: DefaultPluginManager;
  private customPreset: PresetBuilder | null = null;

  constructor(config: ThemeBuilderConfig = {}) {
    this.config = config;
    this.pluginManager = new DefaultPluginManager();
  }

  // Chainable configuration methods
  withColorTokens(tokens: Partial<ColorTokens>) {
    this.config.colorTokens = { ...this.config.colorTokens, ...tokens };
    return this;
  }

  withCustomPreset(presetBuilder: PresetBuilder) {
    this.customPreset = presetBuilder;
    return this;
  }

  usePlugin(plugin: ThemePlugin, options?: any) {
    this.pluginManager.register(plugin);
    if (!this.config.pluginOptions) {
      this.config.pluginOptions = {};
    }
    this.config.pluginOptions[plugin.name] = options;
    return this;
  }

  withBaseTheme(baseTheme: Partial<ThemeOptions>) {
    this.config.baseTheme = deepMerge(this.config.baseTheme || {}, baseTheme);
    return this;
  }

  // Build the final theme
  build() {
    // 1. Create a base theme to get default shadows and other base values
    const baseTheme = createTheme({
      palette: {
        primary: { main: this.config.colorTokens?.primary || '#1976d2' },
        secondary: { main: this.config.colorTokens?.secondary || '#dc004e' },
      },
    });

    // 2. Start with empty theme options - colorSchemes will come from baseTheme config
    let themeOptions: ThemeOptions = {};

    // 3. Apply custom preset FIRST (if provided) so brand colors can override
    if (this.customPreset) {
      const presetOptions = this.customPreset.build(baseTheme);
      themeOptions = deepMerge(themeOptions, presetOptions);
    }

    // 4. Apply base theme config (which includes brand-specific colorSchemes) AFTER preset
    if (this.config.baseTheme) {
      themeOptions = deepMerge(themeOptions, this.config.baseTheme);
    }

    // 5. Apply plugins

    themeOptions = this.pluginManager.apply(themeOptions, this.config.pluginOptions);

    // 6. Enable CSS variables with colorScheme selector
    // According to latest MUI docs: use createTheme with cssVariables: true
    // IMPORTANT: Must provide BOTH palette and colorSchemes
    // palette is used as default/fallback when no color scheme is active
    const finalOptions: any = {
      ...themeOptions,
      // Add default palette from light colorScheme
      palette: (themeOptions.colorSchemes as any)?.light?.palette || themeOptions.palette,
      cssVariables: {
        colorSchemeSelector: 'class',
        cssVarPrefix: 'mui',
      },
    };
    
    const theme = createTheme(finalOptions);
    
    return theme;
  }

  // Get current configuration
  getConfig() {
    return { ...this.config };
  }

  // Clone builder
  clone() {
    const cloned = new ThemeBuilder(this.config);
    cloned.customPreset = this.customPreset?.clone() || null;
    return cloned;
  }
}
