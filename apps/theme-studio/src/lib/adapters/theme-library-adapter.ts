// Adapter layer to bridge between theme-studio's BrandConfig and theme-library
import { 
  ThemeBuilder, 
  ColorTokens, 
  PresetBuilder,
  animationPlugin,
  accessibilityPlugin
} from '@mui-theme-builder/theme-library';
import type { BrandConfig } from '../theme/types';
import type { Theme } from '@mui/material/styles';

// ============================================================================
// Caching Strategy
// ============================================================================

// Cache preset instances to avoid recreating them on every theme build
// NOTE: Clear this cache when making changes to presets during development
const presetCache = new Map<string, PresetBuilder>();

// Cache built themes to avoid rebuilding on every render
// Key format: `${brandId}-${designStyle}-${updatedAt}`
const themeCache = new Map<string, Theme>();
const MAX_THEME_CACHE_SIZE = 10; // Limit cache size to prevent memory leaks

// Uncomment to clear cache on hot reload during development
// if (import.meta.hot) {
//   import.meta.hot.accept(() => {
//     presetCache.clear();
//     themeCache.clear();
//   });
// }

/**
 * Clear old themes from cache when it gets too large
 */
function pruneThemeCache() {
  if (themeCache.size > MAX_THEME_CACHE_SIZE) {
    // Remove the oldest entries (first entries in Map)
    const keysToRemove = Array.from(themeCache.keys()).slice(0, themeCache.size - MAX_THEME_CACHE_SIZE);
    keysToRemove.forEach(key => themeCache.delete(key));
  }
}

/**
 * Clear all theme and preset caches (useful for debugging or memory management)
 */
export function clearThemeCaches() {
  themeCache.clear();
  presetCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getThemeCacheStats() {
  return {
    themeCacheSize: themeCache.size,
    presetCacheSize: presetCache.size,
    themeCacheKeys: Array.from(themeCache.keys()),
  };
}

// Plugin configuration is static - define once
const PLUGIN_CONFIG = {
  animation: { duration: 250 },
  accessibility: { 
    focusVisible: true,
    minTargetSize: 44 
  },
};

/**
 * Create a new ThemeBuilder with plugins pre-configured
 * Note: We can't cache the builder itself because plugins need to be registered per-instance,
 * but we can reuse the plugin configuration and rely on the PluginManager's internal caching
 */
function createBuilderWithPlugins(): ThemeBuilder {
  return new ThemeBuilder()
    .usePlugin(animationPlugin, PLUGIN_CONFIG.animation)
    .usePlugin(accessibilityPlugin, PLUGIN_CONFIG.accessibility);
}

/**
 * Convert BrandConfig palette to theme-library ColorTokens
 */
export function brandToColorTokens(brand: BrandConfig): Partial<ColorTokens> {
  return {
    primary: brand.tokens.palette.primary.main,
    secondary: brand.tokens.palette.secondary.main,
    error: brand.tokens.palette.error.main,
    warning: brand.tokens.palette.warning.main,
    info: brand.tokens.palette.info.main,
    success: brand.tokens.palette.success.main,
  };
}

/**
 * Map design style ID to custom preset builder
 */
export function getPresetForDesignStyle(
  designStyleId?: string
): PresetBuilder | null {
  if (!designStyleId) return createMinimalPreset(); // Default

  // All presets are now custom-built in theme-studio
  switch (designStyleId) {
    case 'glassmorphism':
      return createGlassmorphismPreset();
    case 'neumorphism':
      return createNeumorphismPreset();
    case 'brutalism':
      return createBrutalismPreset();
    case 'minimal':
    case 'flat-design':
      return createMinimalPreset();
    case 'cyberpunk':
      return createCyberpunkPreset();
    case 'gradient-mesh':
      return createGradientMeshPreset();
    case 'material-design-3':
      return createMaterialDesign3Preset();
    case 'retro':
      return createRetroPreset();
    default:
      return createMinimalPreset();
  }
}

/**
 * Build a complete theme from BrandConfig using theme-library
 */
export function buildThemeFromBrand(brand: BrandConfig): Theme {
  // Create cache key based on brand ID, design style, and last update
  const cacheKey = `${brand.id}-${brand.designStyle || 'minimal'}-${brand.metadata.updatedAt}`;
  
  // Check if theme is already cached
  if (themeCache.has(cacheKey)) {
    return themeCache.get(cacheKey)!;
  }
  
  // Create builder with plugins pre-configured
  const builder = createBuilderWithPlugins()
    .withColorTokens(brandToColorTokens(brand));

  // Get custom preset for the design style (cached)
  const preset = getPresetForDesignStyle(brand.designStyle);
  
  if (preset) {
    builder.withCustomPreset(preset);
  }

  // Get the preset's base theme to extract colorSchemes if defined
  const presetBaseTheme = preset?.['baseTheme'] || {};
  const presetColorSchemes = presetBaseTheme.colorSchemes || {};

  // Build colorSchemes that include brand colors
  // IMPORTANT: Create complete palette objects with all variants for CSS variables
  const colorSchemes = {
    light: {
      palette: {
        // Start with preset colors (backgrounds, etc.)
        ...presetColorSchemes.light?.palette,
        // Then override with brand semantic colors - include ALL variants
        primary: {
          main: brand.tokens.palette.primary.main,
          light: brand.tokens.palette.primary.light || brand.tokens.palette.primary.main,
          dark: brand.tokens.palette.primary.dark || brand.tokens.palette.primary.main,
          contrastText: brand.tokens.palette.primary.contrastText || '#ffffff',
        },
        secondary: {
          main: brand.tokens.palette.secondary.main,
          light: brand.tokens.palette.secondary.light || brand.tokens.palette.secondary.main,
          dark: brand.tokens.palette.secondary.dark || brand.tokens.palette.secondary.main,
          contrastText: brand.tokens.palette.secondary.contrastText || '#ffffff',
        },
        error: {
          main: brand.tokens.palette.error.main,
          light: brand.tokens.palette.error.light || brand.tokens.palette.error.main,
          dark: brand.tokens.palette.error.dark || brand.tokens.palette.error.main,
          contrastText: brand.tokens.palette.error.contrastText || '#ffffff',
        },
        warning: {
          main: brand.tokens.palette.warning.main,
          light: brand.tokens.palette.warning.light || brand.tokens.palette.warning.main,
          dark: brand.tokens.palette.warning.dark || brand.tokens.palette.warning.main,
          contrastText: brand.tokens.palette.warning.contrastText || '#ffffff',
        },
        info: {
          main: brand.tokens.palette.info.main,
          light: brand.tokens.palette.info.light || brand.tokens.palette.info.main,
          dark: brand.tokens.palette.info.dark || brand.tokens.palette.info.main,
          contrastText: brand.tokens.palette.info.contrastText || '#ffffff',
        },
        success: {
          main: brand.tokens.palette.success.main,
          light: brand.tokens.palette.success.light || brand.tokens.palette.success.main,
          dark: brand.tokens.palette.success.dark || brand.tokens.palette.success.main,
          contrastText: brand.tokens.palette.success.contrastText || '#ffffff',
        },
      },
    },
    dark: {
      palette: {
        // Start with preset colors (backgrounds, etc.)
        ...presetColorSchemes.dark?.palette,
        // Then override with brand semantic colors - include ALL variants
        primary: {
          main: brand.tokens.palette.primary.main,
          light: brand.tokens.palette.primary.light || brand.tokens.palette.primary.main,
          dark: brand.tokens.palette.primary.dark || brand.tokens.palette.primary.main,
          contrastText: brand.tokens.palette.primary.contrastText || '#ffffff',
        },
        secondary: {
          main: brand.tokens.palette.secondary.main,
          light: brand.tokens.palette.secondary.light || brand.tokens.palette.secondary.main,
          dark: brand.tokens.palette.secondary.dark || brand.tokens.palette.secondary.main,
          contrastText: brand.tokens.palette.secondary.contrastText || '#ffffff',
        },
        error: {
          main: brand.tokens.palette.error.main,
          light: brand.tokens.palette.error.light || brand.tokens.palette.error.main,
          dark: brand.tokens.palette.error.dark || brand.tokens.palette.error.main,
          contrastText: brand.tokens.palette.error.contrastText || '#ffffff',
        },
        warning: {
          main: brand.tokens.palette.warning.main,
          light: brand.tokens.palette.warning.light || brand.tokens.palette.warning.main,
          dark: brand.tokens.palette.warning.dark || brand.tokens.palette.warning.main,
          contrastText: brand.tokens.palette.warning.contrastText || '#ffffff',
        },
        info: {
          main: brand.tokens.palette.info.main,
          light: brand.tokens.palette.info.light || brand.tokens.palette.info.main,
          dark: brand.tokens.palette.info.dark || brand.tokens.palette.info.main,
          contrastText: brand.tokens.palette.info.contrastText || '#ffffff',
        },
        success: {
          main: brand.tokens.palette.success.main,
          light: brand.tokens.palette.success.light || brand.tokens.palette.success.main,
          dark: brand.tokens.palette.success.dark || brand.tokens.palette.success.main,
          contrastText: brand.tokens.palette.success.contrastText || '#ffffff',
        },
      },
    },
  };

  // Apply base theme customizations
  builder.withBaseTheme({
    colorSchemes, // Include brand colors in both color schemes
    typography: {
      fontFamily: brand.tokens.typography.fontFamily,
      fontSize: brand.tokens.typography.fontSize,
      fontWeightLight: brand.tokens.typography.fontWeightLight,
      fontWeightRegular: brand.tokens.typography.fontWeightRegular,
      fontWeightMedium: brand.tokens.typography.fontWeightMedium,
      fontWeightBold: brand.tokens.typography.fontWeightBold,
    },
    shape: {
      borderRadius: brand.tokens.shape.borderRadius,
    },
    spacing: brand.tokens.spacing,
  });

  // Build the theme
  const theme = builder.build();
  
  // Cache the built theme
  themeCache.set(cacheKey, theme);
  
  // Prune cache if it's getting too large
  pruneThemeCache();
  
  return theme;
}

// ============================================================================
// Preset Builders for all design styles
// ============================================================================

/**
 * Glassmorphism preset - Apple-inspired frosted glass aesthetic
 */
function createGlassmorphismPreset(): PresetBuilder {
  if (presetCache.has('glassmorphism')) {
    return presetCache.get('glassmorphism')!;
  }

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: 'rgba(250, 250, 252, 0.72)', // iOS-like translucent background
        paper: 'rgba(255, 255, 255, 0.72)',
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: 'rgba(250, 250, 252, 0.72)',
            paper: 'rgba(255, 255, 255, 0.72)',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: 'rgba(28, 28, 30, 0.72)', // iOS dark background
            paper: 'rgba(44, 44, 46, 0.72)',
          },
        },
      },
    },
    shape: {
      borderRadius: 12, // Apple-like rounded corners
    },
  })
    .setMetadata('Glassmorphism', 'Apple-inspired frosted glass with vibrant blur')
    .applySurfaceStyle((theme) => ({
      // Let colorSchemes handle background, just add glass effects
      backdropFilter: 'saturate(180%) blur(8px)', // Reduced blur for less obstruction
      WebkitBackdropFilter: 'saturate(180%) blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      ...theme.applyStyles('dark', {
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }),
    }))
    // Actions (Buttons) - Use theme colors with glassmorphic effect
    .applyActionStyle((theme: Theme) => ({
      borderRadius: 10,
      textTransform: 'none',
      fontWeight: 500,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      transition: 'all 0.2s ease',
    }))
    // Form Inputs (Text fields, selects, etc.) - Apply to actual input elements
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      root: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 10,
        transition: 'all 0.2s ease',
      },
      notchedOutline: {
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: 10,
        transition: 'all 0.2s ease',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }),
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.1)',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'currentColor',
        boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.1)',
        ...theme.applyStyles('dark', {
          borderColor: 'currentColor',
          boxShadow: '0 0 0 4px rgba(10, 132, 255, 0.3)',
        }),
      },
    }))
    .applyToComponent('MuiFilledInput', (theme: Theme) => ({
      root: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 10,
        transition: 'all 0.2s ease',
        '&::before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          ...theme.applyStyles('dark', {
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }),
        },
        '&:hover:not(.Mui-disabled)::before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          ...theme.applyStyles('dark', {
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          }),
        },
        '&.Mui-focused::after': {
          boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.1)',
          ...theme.applyStyles('dark', {
            boxShadow: '0 0 0 4px rgba(10, 132, 255, 0.3)',
          }),
        },
      },
    }))
    // Selection Controls (Checkboxes, Radio, Switch)
    .applySelectionStyle((theme: Theme) => ({
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
      ...theme.applyStyles('dark', {
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      }),
    }))
    .applyToComponent('MuiCard', (theme: Theme) => ({
      // Let colorSchemes handle background
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      ...theme.applyStyles('dark', {
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }),
    }))
    .applyToComponent('MuiPaper', (theme: Theme) => ({
      // Let colorSchemes handle background
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      ...theme.applyStyles('dark', {
        // No overrides needed
      }),
    }))
    .applyToComponent('MuiBackdrop', {
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slightly more visible backdrop
      backdropFilter: 'none', // No blur for maximum clarity
    })
    .applyToComponent('MuiModal', {
      // Remove backdrop filter from Modal root to prevent double blur
      backdropFilter: 'none',
      border: 'none',
      boxShadow: 'none',
    })
    .applyToComponent('MuiPopover', {
      // Remove backdrop filter from Popover root
      backdropFilter: 'none',
      border: 'none',
      boxShadow: 'none',
    })
    .applyToComponent('MuiTabs', (theme: Theme) => ({
      '& .MuiTabs-indicator': {
        height: 2,
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
      },
    }))
    .applyToComponent('MuiTab', (theme: Theme) => ({
      textTransform: 'none',
      fontWeight: 500,
      borderRadius: 10,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
      '&.Mui-selected': {
        fontWeight: 600,
      },
      ...theme.applyStyles('dark', {
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      }),
    }));

  presetCache.set('glassmorphism', preset);
  return preset;
}

/**
 * Neumorphism preset - Elegant soft UI with subtle depth
 */
function createNeumorphismPreset(): PresetBuilder {
  if (presetCache.has('neumorphism')) {
    return presetCache.get('neumorphism')!;
  }

  const baseColor = '#e8ecf1'; // Softer, cooler gray-blue
  const darkBaseColor = '#2a2d35'; // Dark mode equivalent

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: baseColor,
        paper: baseColor,
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: baseColor,
            paper: baseColor,
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: darkBaseColor,
            paper: darkBaseColor,
          },
        },
      },
    },
    shape: {
      borderRadius: 16, // Softer corners
    },
  })
    .setMetadata('Neumorphism', 'Soft, extruded surfaces with elegant shadows')
    .applySurfaceStyle((theme: Theme) => ({
      // Don't set background here - let colorSchemes handle it via CSS variables
      borderRadius: 16,
      boxShadow: '9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      ...theme.applyStyles('dark', {
        // Don't set background here either - colorSchemes handle it
        boxShadow: '9px 9px 16px rgba(0, 0, 0, 0.5), -9px -9px 16px rgba(58, 61, 71, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }),
    }))
    // Actions (Buttons) - Soft extruded effect
    .applyActionStyle((theme: Theme) => ({
      // Don't set background - let colorSchemes handle it
      borderRadius: 12,
      textTransform: 'none',
      fontWeight: 600,
      boxShadow: '6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.7), -8px -8px 16px rgba(255, 255, 255, 0.6)',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
        transform: 'translateY(0)',
      },
      ...theme.applyStyles('dark', {
        // Don't set background - colorSchemes handle it
        boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.5), -6px -6px 12px rgba(58, 61, 71, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        '&:hover': {
          boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(58, 61, 71, 0.4)',
          transform: 'translateY(-2px)',
        },
        '&:active': {
          boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(58, 61, 71, 0.2)',
          transform: 'translateY(0)',
        },
      }),
    }))
    // Form Inputs - Apply soft inset effect to actual input elements
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      root: {
        borderRadius: 12,
        transition: 'box-shadow 0.3s ease',
      },
      notchedOutline: {
        border: 'none',
      },
      input: {
        boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
        borderRadius: 12,
        ...theme.applyStyles('dark', {
          boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(58, 61, 71, 0.2)',
        }),
      },
      '&.Mui-focused': {
        '.MuiOutlinedInput-input': {
          boxShadow: 'inset 6px 6px 12px rgba(163, 177, 198, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.6)',
          ...theme.applyStyles('dark', {
            boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(58, 61, 71, 0.3)',
          }),
        },
      },
    }))
    .applyToComponent('MuiFilledInput', (theme: Theme) => ({
      root: {
        borderRadius: 12,
        boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
        transition: 'box-shadow 0.3s ease',
        '&::before, &::after': {
          display: 'none', // Remove underline
        },
        '&.Mui-focused': {
          boxShadow: 'inset 6px 6px 12px rgba(163, 177, 198, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.6)',
        },
        ...theme.applyStyles('dark', {
          boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(58, 61, 71, 0.2)',
          '&.Mui-focused': {
            boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(58, 61, 71, 0.3)',
          },
        }),
      },
    }))
    .applyToComponent('MuiTabs', (theme: Theme) => ({
      '& .MuiTabs-indicator': {
        height: 3,
        borderRadius: 3,
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.7)',
        ...theme.applyStyles('dark', {
          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(58, 61, 71, 0.3)',
        }),
      },
    }))
    .applyToComponent('MuiTab', (theme: Theme) => ({
      textTransform: 'none',
      fontWeight: 500,
      borderRadius: 16,
      margin: '0 4px',
      '&.Mui-selected': {
        boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.15), inset -2px -2px 4px rgba(255, 255, 255, 0.7)',
        ...theme.applyStyles('dark', {
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.4), inset -2px -2px 4px rgba(58, 61, 71, 0.2)',
        }),
      },
    }));

  presetCache.set('neumorphism', preset);
  return preset;
}

/**
 * Brutalism preset - Bold, high-contrast design with strong borders
 */
function createBrutalismPreset(): PresetBuilder {
  if (presetCache.has('brutalism')) {
    return presetCache.get('brutalism')!;
  }

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: '#fafafa',
        paper: '#ffffff',
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#fafafa',
            paper: '#ffffff',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#0a0a0a',
            paper: '#1a1a1a',
          },
        },
      },
    },
    shape: {
      borderRadius: 2, // Sharp, minimal rounding
    },
    typography: {
      fontFamily: '"Space Grotesk", "Archivo Black", "Arial Black", sans-serif',
      fontWeightBold: 900,
      fontWeightMedium: 700,
    },
    })
    .setMetadata('Brutalism', 'Bold, unapologetic design with maximum contrast')
    .applySurfaceStyle((theme: Theme) => ({
      border: '4px solid #000',
      boxShadow: '8px 8px 0 #000',
      // Let colorSchemes handle background
      borderRadius: 0,
      ...theme.applyStyles('dark', {
        border: '4px solid #fff',
        boxShadow: '8px 8px 0 #fff',
      }),
    }))
    // Actions (Buttons) - Bold shadows and sharp edges
    .applyActionStyle((theme: Theme) => ({
      borderRadius: 0,
      border: '3px solid #000',
      boxShadow: '6px 6px 0 #000',
      textTransform: 'uppercase',
      fontWeight: 900,
      fontSize: '0.95rem',
      letterSpacing: '0.5px',
      transition: 'all 0.1s ease',
      '&:hover': {
        transform: 'translate(-3px, -3px)',
        boxShadow: '9px 9px 0 #000',
      },
      '&:active': {
        transform: 'translate(3px, 3px)',
        boxShadow: '3px 3px 0 #000',
      },
      ...theme.applyStyles('dark', {
        border: '3px solid #fff',
        boxShadow: '6px 6px 0 #fff',
        '&:hover': {
          transform: 'translate(-3px, -3px)',
          boxShadow: '9px 9px 0 #fff',
        },
        '&:active': {
          transform: 'translate(3px, 3px)',
          boxShadow: '3px 3px 0 #fff',
        },
      }),
    }))
    // Form Inputs - Apply borders to the actual input components, not wrappers
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      notchedOutline: {
        border: '3px solid #000',
        borderRadius: 0,
        transition: 'all 0.1s ease',
        ...theme.applyStyles('dark', {
          borderColor: '#fff',
        }),
      },
      root: {
        fontWeight: 700,
        borderRadius: 0,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          transform: 'translate(-1px, -1px)',
          boxShadow: '2px 2px 0 #000',
          ...theme.applyStyles('dark', {
            boxShadow: '2px 2px 0 #fff',
          }),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: '3px solid #000',
          outline: '4px solid #000',
          outlineOffset: 2,
          ...theme.applyStyles('dark', {
            borderColor: '#fff',
            outline: '4px solid #fff',
          }),
        },
      },
    }))
    .applyToComponent('MuiSelect', (theme: Theme) => ({
      icon: {
        color: '#000',
        fontWeight: 900,
        ...theme.applyStyles('dark', {
          color: '#fff',
        }),
      },
    }))
    .applyToComponent('MuiInputLabel', (theme: Theme) => ({
      root: {
        fontWeight: 700,
        color: '#000',
        '&.Mui-focused': {
          fontWeight: 900,
          color: '#000',
        },
        ...theme.applyStyles('dark', {
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff',
          },
        }),
      },
    }))
    .applyToComponent('MuiCard', (theme: Theme) => ({
      border: '4px solid #000',
      boxShadow: '8px 8px 0 #000',
      borderRadius: 0,
      ...theme.applyStyles('dark', {
        border: '4px solid #fff',
        boxShadow: '8px 8px 0 #fff',
      }),
    }))
    .applyToComponent('MuiBackdrop', {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Moderate backdrop for brutalism
    })
    .applyToComponent('MuiTabs', (theme: Theme) => ({
      borderBottom: '4px solid #000',
      '& .MuiTabs-indicator': {
        height: 6,
        backgroundColor: '#000',
        ...theme.applyStyles('dark', {
          backgroundColor: '#fff',
        }),
      },
      ...theme.applyStyles('dark', {
        borderBottom: '4px solid #fff',
      }),
    }))
    .applyToComponent('MuiTab', (theme: Theme) => ({
      textTransform: 'uppercase',
      fontWeight: 900,
      fontSize: '1rem',
      letterSpacing: '0.1em',
      border: '3px solid transparent',
      transition: 'none',
      '&:hover': {
        border: '3px solid #000',
        transform: 'translate(-1px, -1px)',
        boxShadow: '2px 2px 0 #000',
      },
      '&.Mui-selected': {
        border: '3px solid #000',
        fontWeight: 900,
      },
      ...theme.applyStyles('dark', {
        '&:hover': {
          border: '3px solid #fff',
          boxShadow: '2px 2px 0 #fff',
        },
        '&.Mui-selected': {
          border: '3px solid #fff',
        },
      }),
    }));

  presetCache.set('brutalism', preset);
  return preset;
}

/**
 * Minimal preset - Clean, refined Scandinavian design
 */
function createMinimalPreset(): PresetBuilder {
  if (presetCache.has('minimal')) {
    return presetCache.get('minimal')!;
  }

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: '#fafafa',
        paper: '#ffffff',
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#fafafa',
            paper: '#ffffff',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
    },
  })
    .setMetadata('Minimal', 'Clean, elegant Scandinavian design')
    .applySurfaceStyle((theme: Theme) => ({
      // Let colorSchemes handle background
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      borderRadius: 8,
      ...theme.applyStyles('dark', {
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      }),
    }))
    // Actions (Buttons) - Clean with subtle borders
    .applyActionStyle((theme: Theme) => ({
      borderRadius: 6,
      textTransform: 'none',
      fontWeight: 500,
      boxShadow: 'none',
      border: '1.5px solid rgba(0, 0, 0, 0.12)',
      transition: 'all 0.2s ease',
      '&:hover': {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transform: 'translateY(-1px)',
        borderColor: 'rgba(0, 0, 0, 0.2)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      ...theme.applyStyles('dark', {
        border: '1.5px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          transform: 'translateY(-1px)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      }),
    }))
    // Form Inputs - Apply to actual input elements with subtle borders
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      root: {
        borderRadius: 6,
        transition: 'all 0.2s ease',
      },
      notchedOutline: {
        border: '1.5px solid rgba(0, 0, 0, 0.12)',
        transition: 'all 0.2s ease',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }),
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.2)',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        }),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'currentColor',
        boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.05)',
        ...theme.applyStyles('dark', {
          boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)',
        }),
      },
    }));

  presetCache.set('minimal', preset);
  return preset;
}

/**
 * Cyberpunk preset - Cyberpunk 2077 inspired neon aesthetics
 * Uses theme accent colors (primary/secondary) for neon effects
 */
function createCyberpunkPreset(): PresetBuilder {
  if (presetCache.has('cyberpunk')) {
    return presetCache.get('cyberpunk')!;
  }

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: '#050505', // Nearly black background like CP2077
        paper: '#0a0a0f',
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#f5f5f5', // Light gray with slight warmth
            paper: '#ffffff',
          },
          text: {
            primary: '#1a1a1a',
            secondary: '#4a4a4a',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#050505', // Nearly black background
            paper: '#0a0a0f',
          },
          text: {
            primary: '#e0e0e0',
            secondary: '#a0a0a0',
          },
        },
      },
    },
    shape: {
      borderRadius: 0, // Sharp edges like CP2077 UI
    },
    typography: {
      fontFamily: '"Rajdhani", "Orbitron", "Roboto Mono", monospace',
      fontWeightMedium: 600,
      fontWeightBold: 700,
    },
  })
    .setMetadata('Cyberpunk', 'Cyberpunk 2077 neon-noir aesthetic')
    .applySurfaceStyle((theme: Theme) => ({
      // Default to dark mode aesthetic
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f14 100%)',
      border: `1px solid color-mix(in srgb, ${theme.palette.primary.main} 40%, transparent)`,
      boxShadow: `0 0 20px color-mix(in srgb, ${theme.palette.primary.main} 15%, transparent), 0 4px 20px rgba(0, 0, 0, 0.8)`,
      borderRadius: 0,
      ...theme.applyStyles('light', {
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        border: `1px solid color-mix(in srgb, ${theme.palette.primary.main} 25%, transparent)`,
        boxShadow: `0 0 15px color-mix(in srgb, ${theme.palette.primary.main} 10%, transparent), 0 4px 20px rgba(0, 0, 0, 0.15)`,
      }),
    }))
    // Actions (Buttons) - Use primary color for neon borders with intense glow
    .applyActionStyle((theme: Theme) => ({
      background: `linear-gradient(135deg, color-mix(in srgb, ${theme.palette.primary.main} 10%, transparent) 0%, color-mix(in srgb, ${theme.palette.primary.main} 5%, transparent) 100%)`,
      border: `2px solid color-mix(in srgb, ${theme.palette.primary.main} 70%, transparent)`,
      borderRadius: 0,
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: '2px',
      boxShadow: `0 0 25px color-mix(in srgb, ${theme.palette.primary.main} 40%, transparent), inset 0 0 10px color-mix(in srgb, ${theme.palette.primary.main} 10%, transparent)`,
      transition: 'all 0.2s ease',
      color: theme.palette.primary.main,
      '&:hover': {
        background: `linear-gradient(135deg, color-mix(in srgb, ${theme.palette.secondary.main} 20%, transparent) 0%, color-mix(in srgb, ${theme.palette.primary.main} 20%, transparent) 100%)`,
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 0 40px color-mix(in srgb, ${theme.palette.secondary.main} 60%, transparent), inset 0 0 15px color-mix(in srgb, ${theme.palette.secondary.main} 20%, transparent)`,
        transform: 'translateY(-1px)',
        color: theme.palette.secondary.main,
      },
      ...theme.applyStyles('dark', {
        color: theme.palette.primary.main,
        background: `linear-gradient(135deg, color-mix(in srgb, ${theme.palette.primary.main} 15%, transparent) 0%, color-mix(in srgb, ${theme.palette.primary.main} 10%, transparent) 100%)`,
        border: `2px solid color-mix(in srgb, ${theme.palette.primary.main} 80%, transparent)`,
        boxShadow: `0 0 30px color-mix(in srgb, ${theme.palette.primary.main} 50%, transparent), inset 0 0 10px color-mix(in srgb, ${theme.palette.primary.main} 10%, transparent)`,
        '&:hover': {
          background: `linear-gradient(135deg, color-mix(in srgb, ${theme.palette.secondary.main} 20%, transparent) 0%, color-mix(in srgb, ${theme.palette.primary.main} 20%, transparent) 100%)`,
          borderColor: theme.palette.secondary.main,
          boxShadow: `0 0 50px color-mix(in srgb, ${theme.palette.secondary.main} 70%, transparent), inset 0 0 15px color-mix(in srgb, ${theme.palette.secondary.main} 20%, transparent)`,
          transform: 'translateY(-1px)',
          color: theme.palette.secondary.main,
        },
      }),
    }))
    // Form Inputs - Use primary color for neon borders on actual input elements
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      root: {
        borderRadius: 0,
        transition: 'all 0.2s ease',
      },
      notchedOutline: {
        border: `2px solid color-mix(in srgb, ${theme.palette.primary.main} 50%, transparent)`,
        boxShadow: `0 0 20px color-mix(in srgb, ${theme.palette.primary.main} 20%, transparent)`,
        transition: 'all 0.2s ease',
        ...theme.applyStyles('dark', {
          borderColor: `color-mix(in srgb, ${theme.palette.primary.main} 60%, transparent)`,
          boxShadow: `0 0 20px color-mix(in srgb, ${theme.palette.primary.main} 25%, transparent)`,
        }),
      },
      input: {
        color: theme.palette.primary.main,
        fontWeight: 500,
        ...theme.applyStyles('dark', {
          color: theme.palette.primary.main,
        }),
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `color-mix(in srgb, ${theme.palette.secondary.main} 80%, transparent)`,
        boxShadow: `0 0 30px color-mix(in srgb, ${theme.palette.secondary.main} 35%, transparent)`,
        ...theme.applyStyles('dark', {
          borderColor: `color-mix(in srgb, ${theme.palette.secondary.main} 70%, transparent)`,
          boxShadow: `0 0 30px color-mix(in srgb, ${theme.palette.secondary.main} 40%, transparent)`,
        }),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 40px color-mix(in srgb, ${theme.palette.primary.main} 60%, transparent), inset 0 0 15px color-mix(in srgb, ${theme.palette.primary.main} 10%, transparent)`,
        ...theme.applyStyles('dark', {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 40px color-mix(in srgb, ${theme.palette.primary.main} 70%, transparent), inset 0 0 15px color-mix(in srgb, ${theme.palette.primary.main} 15%, transparent)`,
        }),
      },
    }))
    .applyToComponent('MuiBackdrop', (theme: Theme) => ({
      backgroundColor: 'rgba(5, 5, 5, 0.6)',
      ...theme.applyStyles('light', {
        backgroundColor: 'rgba(245, 245, 245, 0.6)',
      }),
    }));

  presetCache.set('cyberpunk', preset);
  return preset;
}

/**
 * Gradient Mesh preset - Smooth, vibrant gradients
 */
function createGradientMeshPreset(): PresetBuilder {
  if (presetCache.has('gradient-mesh')) {
    return presetCache.get('gradient-mesh')!;
  }

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paper: '#ffffff',
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            paper: '#ffffff',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b3d 100%)', // Darker gradient
            paper: '#1e1e1e',
          },
        },
      },
    },
    shape: {
      borderRadius: 16,
    },
  })
    .setMetadata('Gradient Mesh', 'Vibrant mesh gradients')
    .applySurfaceStyle((theme: Theme) => ({
      // Let colorSchemes handle background
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      borderRadius: 16,
      ...theme.applyStyles('dark', {
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }),
    }))
    // Actions (Buttons) - Vibrant gradient backgrounds
    .applyActionStyle((theme: Theme) => ({
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: 12,
      color: '#fff',
      textTransform: 'none',
      fontWeight: 600,
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
        transform: 'translateY(-2px)',
      },
      ...theme.applyStyles('dark', {
        background: 'linear-gradient(135deg, #4a5568 0%, #553c9a 100%)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        '&:hover': {
          background: 'linear-gradient(135deg, #553c9a 0%, #4a5568 100%)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
          transform: 'translateY(-2px)',
        },
      }),
    }))
    // Form Inputs - Apply frosted glass effect to actual input elements
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      root: {
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        transition: 'all 0.3s ease',
      },
      notchedOutline: {
        border: '1.5px solid rgba(255, 255, 255, 0.4)',
        transition: 'all 0.3s ease',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }),
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(102, 126, 234, 0.3)',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(102, 126, 234, 0.4)',
        }),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(102, 126, 234, 0.6)',
        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
      },
    }))
    .applyToComponent('MuiCard', (theme: Theme) => ({
      // Let colorSchemes handle background
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      ...theme.applyStyles('dark', {
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }),
    }));

  presetCache.set('gradient-mesh', preset);
  return preset;
}

/**
 * Material Design 3 preset - Modern Material You
 */
function createMaterialDesign3Preset(): PresetBuilder {
  if (presetCache.has('material-design-3')) {
    return presetCache.get('material-design-3')!;
  }

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: '#fef7ff', // Tinted background (Material You style)
        paper: '#ffffff',
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#fef7ff', // Tinted background (Material You style)
            paper: '#ffffff',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#1c1b1f', // Material 3 dark surface
            paper: '#28282c',
          },
        },
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
  })
    .setMetadata('Material Design 3', 'Modern Material You with dynamic elevation')
    .applySurfaceStyle((theme: Theme) => ({
      // Let colorSchemes handle background
      borderRadius: 16,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.1)',
      border: 'none',
      ...theme.applyStyles('dark', {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.4)',
      }),
    }))
    // Actions (Buttons) - Pill-shaped Material You style
    .applyActionStyle((theme: Theme) => ({
      borderRadius: 20, // Pill-shaped (full-width)
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      ...theme.applyStyles('dark', {
        '&:hover': {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.4)',
        },
      }),
    }))
    // Form Inputs - Apply to actual input elements with MD3 filled style
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      root: {
        borderRadius: 4,
        transition: 'all 0.2s ease',
      },
      notchedOutline: {
        border: '1px solid rgba(0, 0, 0, 0.12)',
        transition: 'all 0.2s ease',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255, 255, 255, 0.12)',
        }),
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.2)',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#6750a4',
        borderWidth: 2,
        boxShadow: 'none',
        ...theme.applyStyles('dark', {
          borderColor: '#a18ccc',
        }),
      },
    }))
    .applyToComponent('MuiFilledInput', (theme: Theme) => ({
      root: {
        borderRadius: '4px 4px 0 0',
        transition: 'all 0.2s ease',
        '&::before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          ...theme.applyStyles('dark', {
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }),
        },
        '&:hover:not(.Mui-disabled)::before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
          ...theme.applyStyles('dark', {
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }),
        },
        '&.Mui-focused::after': {
          borderBottom: '2px solid #6750a4',
          ...theme.applyStyles('dark', {
            borderBottom: '2px solid #a18ccc',
          }),
        },
      },
    }))
    .applyToComponent('MuiCard', (theme: Theme) => ({
      borderRadius: 16,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.1)',
      ...theme.applyStyles('dark', {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.4)',
      }),
    }))
    .applyToComponent('MuiFab', {
      borderRadius: 16, // Material 3 FAB shape
      boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
    })
    .applyToComponent('MuiTabs', (theme: Theme) => ({
      '& .MuiTabs-indicator': {
        height: 3,
        borderRadius: '3px 3px 0 0',
      },
    }))
    .applyToComponent('MuiTab', (theme: Theme) => ({
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      minHeight: 48,
      borderRadius: '12px 12px 0 0',
      '&.Mui-selected': {
        fontWeight: 700,
      },
    }));

  presetCache.set('material-design-3', preset);
  return preset;
}

/**
 * Retro preset - Warm vintage 80s aesthetic
 */
function createRetroPreset(): PresetBuilder {
  if (presetCache.has('retro')) {
    return presetCache.get('retro')!;
  }

  const preset = new PresetBuilder({
    palette: {
      background: {
        default: '#f4e8d8', // Warm beige/cream
        paper: '#fff8e7',
      },
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#f4e8d8', // Warm beige/cream
            paper: '#fff8e7',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#2a2520', // Dark warm brown
            paper: '#3a3330',
          },
        },
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Courier Prime", "Courier New", monospace',
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
  })
    .setMetadata('Retro', 'Warm vintage aesthetics with soft shadows')
    .applySurfaceStyle((theme: Theme) => ({
      // Let colorSchemes handle background
      border: '3px solid #d4a574',
      boxShadow: '6px 6px 0 #c49563',
      borderRadius: 4,
      ...theme.applyStyles('dark', {
        border: '3px solid #7a6555',
        boxShadow: '6px 6px 0 #5a4a40',
      }),
    }))
    // Actions (Buttons) - Retro offset shadows
    .applyActionStyle((theme: Theme) => ({
      // Let colorSchemes handle background
      border: '3px solid #c49563',
      boxShadow: '4px 4px 0 #a57743',
      borderRadius: 2,
      textTransform: 'uppercase',
      fontWeight: 700,
      fontSize: '0.875rem',
      letterSpacing: '0.5px',
      color: '#5a3e2b',
      transition: 'all 0.15s ease',
      '&:hover': {
        transform: 'translate(-2px, -2px)',
        boxShadow: '6px 6px 0 #a57743',
      },
      '&:active': {
        transform: 'translate(2px, 2px)',
        boxShadow: '2px 2px 0 #a57743',
      },
      ...theme.applyStyles('dark', {
        border: '3px solid #7a6555',
        boxShadow: '4px 4px 0 #4a3a30',
        color: '#e8d4ba',
        '&:hover': {
          transform: 'translate(-2px, -2px)',
          boxShadow: '6px 6px 0 #4a3a30',
        },
        '&:active': {
          transform: 'translate(2px, 2px)',
          boxShadow: '2px 2px 0 #4a3a30',
        },
      }),
    }))
    // Form Inputs - Apply simple retro borders to actual input elements
    .applyToComponent('MuiOutlinedInput', (theme: Theme) => ({
      root: {
        borderRadius: 2,
        fontFamily: 'inherit',
        transition: 'all 0.2s ease',
      },
      notchedOutline: {
        border: '2px solid #d4a574',
        transition: 'all 0.2s ease',
        ...theme.applyStyles('dark', {
          borderColor: '#7a6555',
        }),
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#b88653',
        ...theme.applyStyles('dark', {
          borderColor: '#8a7565',
        }),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#a57743',
        boxShadow: '0 0 0 3px rgba(164, 119, 67, 0.2)',
        ...theme.applyStyles('dark', {
          borderColor: '#9a8575',
          boxShadow: '0 0 0 3px rgba(154, 133, 117, 0.3)',
        }),
      },
    }))
    .applyToComponent('MuiCard', (theme: Theme) => ({
      // Let colorSchemes handle background
      border: '3px solid #d4a574',
      boxShadow: '6px 6px 0 #c49563',
      ...theme.applyStyles('dark', {
        border: '3px solid #7a6555',
        boxShadow: '6px 6px 0 #5a4a40',
      }),
    }))
    .applyToComponent('MuiBackdrop', {
      backgroundColor: 'rgba(90, 62, 43, 0.4)', // Lighter warm tint for retro
    });

  presetCache.set('retro', preset);
  return preset;
}

/**
 * Get preset name for BrandSelector display
 */
export function getPresetDisplayName(designStyleId?: string): string {
  const names: Record<string, string> = {
    glassmorphism: 'Glassmorphism',
    neumorphism: 'Neumorphism',
    brutalism: 'Brutalism',
    minimal: 'Minimal',
    'flat-design': 'Flat Design',
    cyberpunk: 'Cyberpunk',
    'gradient-mesh': 'Gradient Mesh',
    'material-design-3': 'Material Design 3',
    retro: 'Retro',
  };

  return names[designStyleId || ''] || 'Custom';
}
