# MUI Theme Library

A comprehensive, plugin-based theming system for Material-UI (MUI) that provides preset styles, component categorization, and advanced customization capabilities.

## Features

- 🎨 **Built-in Presets**: Glassmorphism, Neumorphism, Brutalism, and Minimal design styles
- 🔧 **Plugin System**: Extend themes with animation, accessibility, and responsive plugins
- ⚛️ **React Integration**: Context-based theme provider with hooks
- 🎯 **Component Categories**: Intelligent categorization of MUI components
- 🛠️ **Custom Presets**: Build your own design systems with ease
- 🎭 **Style Generators**: Reusable style functions for common patterns
- 📦 **TypeScript**: Full type safety and IntelliSense support

## Installation

```bash
npm install @mui-theme-builder/theme-library @mui/material @emotion/react @emotion/styled
```

## Quick Start

### Basic Usage with React

```tsx
import { CustomThemeProvider, ThemeSwitcher } from '@mui-theme-builder/theme-library';
import { Button, Card, CardContent } from '@mui/material';

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
        <CardContent>
          <Button variant="contained">Themed Button</Button>
        </CardContent>
      </Card>
    </CustomThemeProvider>
  );
}
```

### Advanced Usage with ThemeBuilder

```tsx
import { ThemeBuilder } from '@mui-theme-builder/theme-library';
import { animationPlugin, accessibilityPlugin } from '@mui-theme-builder/theme-library';
import { ThemeProvider } from '@mui/material/styles';

const theme = new ThemeBuilder()
  .withColorTokens({
    primary: '#10b981',
    secondary: '#f59e0b',
  })
  .withPreset('neumorphism', { intensity: 1.2 })
  .usePlugin(animationPlugin, { duration: 200 })
  .usePlugin(accessibilityPlugin, { focusVisible: true })
  .build();

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### Custom Preset

```tsx
import { PresetBuilder, styleGenerators } from '@mui-theme-builder/theme-library';

const myPreset = new PresetBuilder()
  .setMetadata('My Brand', 'Custom brand theme')
  .applySurfaceStyle(styleGenerators.glass, { blur: 15, opacity: 0.3 })
  .applyInputStyle((theme) => ({
    borderRadius: theme.shape.borderRadius * 2,
    '&:hover': {
      transform: 'scale(1.02)',
    },
  }))
  .applyToComponent('MuiButton', {
    textTransform: 'none',
    fontWeight: 700,
  });
```

## Available Presets

### Glassmorphism
Frosted glass aesthetic with backdrop blur effects.

```tsx
createGlassmorphismPreset({ blur: 10, opacity: 0.25, tint: 'light' })
```

### Neumorphism
Soft UI with extruded elements and subtle shadows.

```tsx
createNeumorphismPreset({ intensity: 1, baseColor: '#e0e0e0' })
```

### Brutalism
Bold, raw design with thick borders and strong shadows.

```tsx
createBrutalismPreset({ borderWidth: 3, shadowIntensity: 'medium' })
```

### Minimal
Clean and simple design with subtle elevations.

```tsx
createMinimalPreset({ borderRadius: 8, elevation: 1 })
```

## Built-in Plugins

### Animation Plugin
Add smooth transitions to components.

```tsx
usePlugin(animationPlugin, { duration: 300, easing: 'ease-in-out' })
```

### Accessibility Plugin
Enhance accessibility with focus indicators and minimum target sizes.

```tsx
usePlugin(accessibilityPlugin, { 
  focusVisible: true, 
  minTargetSize: 44,
  reducedMotion: true 
})
```

### Responsive Plugin
Configure breakpoints and fluid typography.

```tsx
usePlugin(responsivePlugin, { 
  fluidTypography: true,
  breakpoints: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }
})
```

## Component Categories

The library categorizes MUI components into logical groups:

- **Surfaces**: Card, Paper, Dialog, Drawer, etc.
- **Inputs**: Button, TextField, Select, Checkbox, etc.
- **Data Display**: Chip, Avatar, Badge, Table, etc.
- **Feedback**: Alert, Snackbar, Progress, Skeleton, etc.
- **Navigation**: Tabs, Breadcrumbs, Pagination, etc.

## API Reference

### ThemeBuilder

```tsx
new ThemeBuilder()
  .withColorTokens({ primary: '#000', secondary: '#fff' })
  .withPreset('glassmorphism')
  .withCustomPreset(presetBuilder)
  .usePlugin(plugin, options)
  .withBaseTheme(themeOptions)
  .build()
```

### PresetBuilder

```tsx
new PresetBuilder()
  .setMetadata(name, description)
  .applyToCategories(categories, styleGenerator, options)
  .applySurfaceStyle(styleGenerator, options)
  .applyInputStyle(styleGenerator, options)
  .applyGlobalStyle(styleGenerator, options)
  .applyToComponent(componentName, styles)
  .build(theme)
```

### Hooks

- `useCustomTheme()` - Access theme context
- `usePreset(presetName, options)` - Create preset dynamically
- `useThemeTokens()` - Manage color tokens

## License

MIT
