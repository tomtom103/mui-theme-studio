# MUI Theme Library - Complete Implementation Guide

## Overview

This library provides a comprehensive, plugin-based theming system for Material-UI with:

- **4 Built-in Presets**: Glassmorphism, Neumorphism, Brutalism, and Minimal
- **Plugin System**: Animation, Accessibility, and Responsive plugins
- **Component Categorization**: Intelligent grouping of MUI components
- **React Integration**: Provider, hooks, and switcher components
- **Token System**: Colors, spacing, typography, and shadows
- **Utility Functions**: Color manipulation, validators, and deep merge

## Project Structure

```
src/
├── core/
│   ├── ThemeBuilder.ts           # Main orchestrator
│   ├── PresetBuilder.ts          # Preset creation system
│   └── index.ts
├── types/
│   ├── index.ts                  # Type definitions
│   └── components.ts             # Component types
├── presets/
│   ├── index.ts                  # Preset registry
│   ├── componentCategories.ts    # Component mapping
│   └── styleGenerators.ts        # Reusable styles
├── plugins/
│   ├── types.ts                  # Plugin interfaces
│   ├── PluginManager.ts          # Plugin orchestration
│   ├── animationPlugin.ts        # Animation plugin
│   ├── accessibilityPlugin.ts    # A11y plugin
│   ├── responsivePlugin.ts       # Responsive plugin
│   └── index.ts
├── react/
│   ├── ThemeProvider.tsx         # Context provider
│   ├── usePreset.ts              # Preset hook
│   ├── useThemeTokens.ts         # Token hook
│   ├── ThemeSwitcher.tsx         # UI switcher
│   └── index.ts
├── tokens/
│   ├── colors.ts                 # Color tokens
│   ├── spacing.ts                # Spacing scale
│   ├── typography.ts             # Typography tokens
│   ├── shadows.ts                # Shadow system
│   └── index.ts
├── utils/
│   ├── deepMerge.ts              # Object merging
│   ├── validators.ts             # Type validation
│   ├── colorHelpers.ts           # Color utilities
│   └── index.ts
├── examples/
│   ├── basic.example.tsx
│   ├── advanced.example.tsx
│   └── custom-preset.example.tsx
└── index.ts                      # Main export
```

## Usage Examples

### 1. Basic React Integration

```tsx
import { 
  CustomThemeProvider, 
  ThemeSwitcher 
} from '@mui-theme-builder/theme-library';
import { Button, Card } from '@mui/material';

function App() {
  return (
    <CustomThemeProvider
      initialPreset="glassmorphism"
      baseTokens={{
        primary: '#6366f1',
        secondary: '#ec4899',
      }}
    >
      <ThemeSwitcher variant="buttons" />
      <Card>
        <Button variant="contained">Themed Button</Button>
      </Card>
    </CustomThemeProvider>
  );
}
```

### 2. ThemeBuilder with Plugins

```tsx
import { 
  ThemeBuilder,
  animationPlugin,
  accessibilityPlugin,
  responsivePlugin
} from '@mui-theme-builder/theme-library';
import { ThemeProvider } from '@mui/material/styles';

const theme = new ThemeBuilder()
  .withColorTokens({
    primary: '#10b981',
    secondary: '#f59e0b',
  })
  .withPreset('neumorphism', { intensity: 1.2 })
  .usePlugin(animationPlugin, { duration: 200 })
  .usePlugin(accessibilityPlugin, { 
    focusVisible: true,
    minTargetSize: 44 
  })
  .usePlugin(responsivePlugin, { 
    fluidTypography: true 
  })
  .build();

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### 3. Custom Preset Creation

```tsx
import { 
  PresetBuilder, 
  styleGenerators 
} from '@mui-theme-builder/theme-library';

const myBrandPreset = new PresetBuilder({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1' },
  },
})
  .setMetadata('My Brand', 'Custom company theme')
  // Apply to all surfaces (Card, Paper, Dialog, etc.)
  .applySurfaceStyle(styleGenerators.glass, { 
    blur: 15, 
    opacity: 0.3,
    tint: 'light'
  })
  // Apply to all inputs (Button, TextField, etc.)
  .applyInputStyle((theme) => ({
    borderRadius: 12,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  }))
  // Specific component overrides
  .applyToComponent('MuiButton', {
    textTransform: 'none',
    fontWeight: 700,
    padding: '12px 32px',
  })
  .applyToComponent('MuiCard', {
    borderRadius: 16,
  });

// Use with ThemeBuilder
const theme = new ThemeBuilder()
  .withCustomPreset(myBrandPreset)
  .build();
```

### 4. Style Generator Patterns

```tsx
import { styleGenerators } from '@mui-theme-builder/theme-library';

// Available generators:
const glassStyle = styleGenerators.glass(theme, { 
  blur: 10, 
  opacity: 0.25, 
  tint: 'light' 
});

const neomorphicStyle = styleGenerators.neomorphic(theme, { 
  distance: 8, 
  intensity: 1 
});

const flatStyle = styleGenerators.flat(theme);

const elevatedStyle = styleGenerators.elevated(theme, { 
  elevation: 2 
});

const brutalStyle = styleGenerators.brutal(theme, { 
  borderWidth: 3, 
  shadowOffset: 8 
});

const gradientStyle = styleGenerators.gradient(theme, { 
  from: '#6366f1', 
  to: '#ec4899', 
  angle: 45 
});
```

### 5. Component Categories

```tsx
import { 
  PresetBuilder,
  MUI_COMPONENT_CATEGORIES 
} from '@mui-theme-builder/theme-library';

// Categories:
// - surfaces: Card, Paper, Dialog, Drawer, Menu, etc.
// - inputs: Button, TextField, Select, Checkbox, etc.
// - dataDisplay: Chip, Avatar, Badge, Table, etc.
// - feedback: Alert, Snackbar, Progress, Skeleton, etc.
// - navigation: Tabs, Breadcrumbs, Pagination, etc.

const preset = new PresetBuilder()
  // Apply to specific categories
  .applyToCategories(
    ['surfaces', 'feedback'],
    styleGenerators.glass,
    { blur: 10 }
  )
  // Or use convenience methods
  .applySurfaceStyle(styleGenerators.elevated)
  .applyInputStyle(styleGenerators.neomorphic)
  .applyDataDisplayStyle(styleGenerators.flat)
  .applyFeedbackStyle(styleGenerators.glass)
  .applyNavigationStyle(styleGenerators.minimal);
```

### 6. React Hooks

```tsx
import { 
  useCustomTheme,
  usePreset,
  useThemeTokens 
} from '@mui-theme-builder/theme-library';

function MyComponent() {
  // Access theme context
  const { 
    currentTheme, 
    presetName, 
    switchPreset,
    applyCustomPreset,
    updateTokens,
    resetTheme 
  } = useCustomTheme();

  // Use preset dynamically
  const glassTheme = usePreset('glassmorphism', { blur: 15 });

  // Manage tokens
  const { colors, setColors } = useThemeTokens();
  
  const handleColorChange = () => {
    setColors({ primary: '#ff0000' });
  };

  return (
    <div>
      <button onClick={() => switchPreset('neumorphism')}>
        Switch to Neumorphism
      </button>
      <button onClick={resetTheme}>Reset</button>
    </div>
  );
}
```

### 7. Creating Custom Plugins

```tsx
import { ThemePlugin } from '@mui-theme-builder/theme-library';

export interface MyPluginOptions {
  customProp?: string;
}

export const myCustomPlugin: ThemePlugin = {
  name: 'my-custom-plugin',
  version: '1.0.0',
  priority: 20, // Lower runs first
  dependencies: ['animation'], // Optional
  apply: (theme, options: MyPluginOptions = {}) => {
    const { customProp = 'default' } = options;

    return {
      ...theme,
      components: {
        ...theme.components,
        MuiButton: {
          ...theme.components?.MuiButton,
          styleOverrides: {
            ...theme.components?.MuiButton?.styleOverrides,
            root: {
              ...theme.components?.MuiButton?.styleOverrides?.root,
              // Your custom styles
              customProperty: customProp,
            },
          },
        },
      },
    };
  },
};

// Use it
const theme = new ThemeBuilder()
  .usePlugin(myCustomPlugin, { customProp: 'value' })
  .build();
```

## Preset Options

### Glassmorphism
```tsx
createGlassmorphismPreset({
  blur: 10,              // Backdrop blur amount
  opacity: 0.25,         // Background opacity
  tint: 'light' | 'dark' // Color tint
})
```

### Neumorphism
```tsx
createNeumorphismPreset({
  intensity: 1,          // Shadow intensity
  baseColor: '#e0e0e0'   // Background color
})
```

### Brutalism
```tsx
createBrutalismPreset({
  borderWidth: 3,                         // Border thickness
  shadowIntensity: 'low' | 'medium' | 'high' // Shadow size
})
```

### Minimal
```tsx
createMinimalPreset({
  borderRadius: 8,       // Corner radius
  elevation: 1           // Shadow elevation
})
```

## Color Utilities

```tsx
import { 
  hexToRgb,
  rgbToHex,
  adjustBrightness,
  adjustOpacity,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirements
} from '@mui-theme-builder/theme-library';

const rgb = hexToRgb('#6366f1'); // { r: 99, g: 102, b: 241 }
const hex = rgbToHex(99, 102, 241); // '#6366f1'
const lighter = adjustBrightness('#6366f1', 20);
const transparent = adjustOpacity('#6366f1', 0.5);
const lum = getLuminance('#6366f1');
const ratio = getContrastRatio('#6366f1', '#ffffff');
const accessible = meetsContrastRequirements('#6366f1', '#ffffff', 'AA');
```

## Next Steps

1. **Install dependencies**: Run `pnpm install` in the theme-library directory
2. **Build the library**: Run `pnpm build`
3. **Import in your app**: Use in the theme-studio or other packages
4. **Customize**: Create your own presets and plugins
5. **Extend**: Add more style generators and component categories

## Tips

- Use `ThemeBuilder` for programmatic theme creation
- Use `CustomThemeProvider` for React apps with dynamic switching
- Combine multiple plugins for rich functionality
- Create reusable presets for your brand guidelines
- Use component categories to apply consistent styles
