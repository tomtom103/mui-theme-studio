// lib/utils/code-generator.ts
import type { BrandConfig } from "../theme/types";
import { buildThemeFromBrand } from "../adapters/theme-library-adapter";
import type { Theme } from '@mui/material/styles';

/**
 * Serialize a value to TypeScript code
 * Special handling for theme functions
 */
function serializeValue(value: any, indent: number = 0, skipFunctions: boolean = false): string {
  const spaces = " ".repeat(indent);
  const innerSpaces = " ".repeat(indent + 2);

  if (value === null) return "null";
  if (value === undefined) return "undefined";
  
  // Handle primitives
  if (typeof value === "string") return `'${value.replace(/'/g, "\\'")}'`;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  
  // Handle functions - skip them if requested
  if (typeof value === "function") {
    return skipFunctions ? "undefined" : "/* function */";
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map(item => serializeValue(item, indent + 2, skipFunctions));
    return `[\n${innerSpaces}${items.join(`,\n${innerSpaces}`)}\n${spaces}]`;
  }
  
  // Handle objects
  if (typeof value === "object") {
    const entries = Object.entries(value).filter(([_, v]) => {
      // Skip functions if requested, otherwise include them as comments
      return skipFunctions ? typeof v !== "function" : true;
    });
    if (entries.length === 0) return "{}";
    
    const lines = entries.map(([key, val]) => {
      const serializedVal = serializeValue(val, indent + 2, skipFunctions);
      // Use quotes for keys with special characters or spaces
      const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      return `${innerSpaces}${quotedKey}: ${serializedVal}`;
    });
    
    return `{\n${lines.join(",\n")}\n${spaces}}`;
  }
  
  return "undefined";
}

/**
 * Extract relevant theme properties for code generation
 */
function extractThemeConfig(theme: Theme): any {
  return {
    palette: {
      mode: theme.palette.mode,
      primary: {
        main: theme.palette.primary.main,
        light: theme.palette.primary.light,
        dark: theme.palette.primary.dark,
        contrastText: theme.palette.primary.contrastText,
      },
      secondary: {
        main: theme.palette.secondary.main,
        light: theme.palette.secondary.light,
        dark: theme.palette.secondary.dark,
        contrastText: theme.palette.secondary.contrastText,
      },
      error: {
        main: theme.palette.error.main,
        light: theme.palette.error.light,
        dark: theme.palette.error.dark,
        contrastText: theme.palette.error.contrastText,
      },
      warning: {
        main: theme.palette.warning.main,
        light: theme.palette.warning.light,
        dark: theme.palette.warning.dark,
        contrastText: theme.palette.warning.contrastText,
      },
      info: {
        main: theme.palette.info.main,
        light: theme.palette.info.light,
        dark: theme.palette.info.dark,
        contrastText: theme.palette.info.contrastText,
      },
      success: {
        main: theme.palette.success.main,
        light: theme.palette.success.light,
        dark: theme.palette.success.dark,
        contrastText: theme.palette.success.contrastText,
      },
      background: {
        default: theme.palette.background.default,
        paper: theme.palette.background.paper,
      },
      text: {
        primary: theme.palette.text.primary,
        secondary: theme.palette.text.secondary,
        disabled: theme.palette.text.disabled,
      },
    },
    typography: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeightLight: theme.typography.fontWeightLight,
      fontWeightRegular: theme.typography.fontWeightRegular,
      fontWeightMedium: theme.typography.fontWeightMedium,
      fontWeightBold: theme.typography.fontWeightBold,
    },
    shape: {
      borderRadius: theme.shape.borderRadius,
    },
    spacing: theme.spacing(1),
  };
}
/**
 * Generate MUI theme code from built theme
 */
function generateMuiThemeCode(brand: BrandConfig): string {
  const themeName = brand.name.replace(/\s+/g, "");
  
  // Build the actual theme using the library
  const theme = buildThemeFromBrand(brand);
  
  // Extract colorSchemes from the theme
  const colorSchemes = (theme as any).colorSchemes || {};
  
  // Serialize light and dark color schemes
  const lightPalette = colorSchemes.light?.palette ? serializeValue({
    primary: colorSchemes.light.palette.primary,
    secondary: colorSchemes.light.palette.secondary,
    error: colorSchemes.light.palette.error,
    warning: colorSchemes.light.palette.warning,
    info: colorSchemes.light.palette.info,
    success: colorSchemes.light.palette.success,
    background: colorSchemes.light.palette.background,
    text: colorSchemes.light.palette.text,
  }, 8) : serializeValue(extractThemeConfig(theme).palette, 8);
  
  const darkPalette = colorSchemes.dark?.palette ? serializeValue({
    primary: colorSchemes.dark.palette.primary,
    secondary: colorSchemes.dark.palette.secondary,
    error: colorSchemes.dark.palette.error,
    warning: colorSchemes.dark.palette.warning,
    info: colorSchemes.dark.palette.info,
    success: colorSchemes.dark.palette.success,
    background: colorSchemes.dark.palette.background,
    text: colorSchemes.dark.palette.text,
  }, 8) : lightPalette;
  
  const typography = serializeValue({
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeightLight: theme.typography.fontWeightLight,
    fontWeightRegular: theme.typography.fontWeightRegular,
    fontWeightMedium: theme.typography.fontWeightMedium,
    fontWeightBold: theme.typography.fontWeightBold,
  }, 2);
  
  const shape = serializeValue({
    borderRadius: theme.shape.borderRadius,
  }, 2);
  
  const spacing = theme.spacing(1);
  
  // Extract component overrides (skip functions since they can't be serialized)
  const components = theme.components || {};
  const componentsCode = Object.keys(components).length > 0 
    ? `\n\n  components: ${serializeValue(components, 2, true)},`
    : '';
  
  return `// ${brand.name} Theme Configuration
// Generated by Theme Studio on ${new Date().toISOString()}
// Preset: ${brand.designStyle || 'minimal'}

import { createTheme } from '@mui/material/styles';

export const ${themeName}Theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
    cssVarPrefix: 'mui',
  },
  
  colorSchemes: {
    light: {
      palette: ${lightPalette},
    },
    dark: {
      palette: ${darkPalette},
    },
  },

  typography: ${typography},
  
  shape: ${shape},
  
  spacing: ${spacing},${componentsCode}
});

// Usage with React:
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { ${themeName}Theme } from './theme';
//
// function App() {
//   return (
//     <ThemeProvider theme={${themeName}Theme}>
//       <CssBaseline />
//       <YourApp />
//     </ThemeProvider>
//   );
// }
`;
}

/**
 * Generate legacy extendTheme code
 */
function generateLegacyCode(brand: BrandConfig): string {
  const themeName = brand.name.replace(/\s+/g, "");
  
  return `// ${brand.name} Theme Configuration
// Generated by Theme Studio on ${new Date().toISOString()}

import { extendTheme } from '@mui/material/styles';

export const ${themeName}Theme = extendTheme({
  cssVarPrefix: 'brand',
  
  colorSchemes: {
    light: {
      palette: {
        primary: ${serializeValue(brand.tokens.palette.primary, 8)},
        secondary: ${serializeValue(brand.tokens.palette.secondary, 8)},
        error: ${serializeValue(brand.tokens.palette.error, 8)},
        warning: ${serializeValue(brand.tokens.palette.warning, 8)},
        info: ${serializeValue(brand.tokens.palette.info, 8)},
        success: ${serializeValue(brand.tokens.palette.success, 8)},
      },
    },
    dark: {
      palette: {
        primary: ${serializeValue(brand.tokens.palette.primary, 8)},
        secondary: ${serializeValue(brand.tokens.palette.secondary, 8)},
      },
    },
  },

  typography: ${serializeValue(brand.tokens.typography, 2)},
  
  shape: ${serializeValue(brand.tokens.shape, 2)},
  
  spacing: ${brand.tokens.spacing},
});

// Usage:
// import { CssVarsProvider } from '@mui/material/styles';
// import { ${themeName}Theme } from './theme';
//
// <CssVarsProvider theme={${themeName}Theme}>
//   <App />
// </CssVarsProvider>
`;
}

export function generateThemeCode(
  brand: BrandConfig,
  format: "typescript" | "json" | "theme-library",
): string {
  if (format === "json") {
    return JSON.stringify(brand.tokens, null, 2);
  }

  if (format === "theme-library") {
    // Generate full MUI theme code using the library
    return generateMuiThemeCode(brand);
  }

  // Legacy format
  return generateLegacyCode(brand);
}
