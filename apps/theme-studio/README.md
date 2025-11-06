# MUI Theme Studio

A visual development tool for creating and managing Material-UI v8 themes. Build, customize, and export production-ready theme configurations with live preview.

## Features

- 🎨 **Visual Color Editor** - Edit all color scales with live preview and WCAG contrast checking
- 📝 **Typography Management** - Customize font families, weights, and sizes
- 🌓 **Dark Mode Support** - Toggle between light and dark themes
- 👁️ **Live Preview** - See your changes in real-time across MUI components
- 💾 **Multi-Brand Management** - Create, duplicate, and manage multiple brand themes
- 📦 **Export Themes** - Generate TypeScript or JSON theme code for your projects
- ♿ **Accessibility Validation** - Built-in WCAG contrast ratio checking
- 💿 **Persistent Storage** - Auto-save themes to browser localStorage

## Getting Started

### Development

```bash
# From the root of the monorepo
pnpm install

# Start the development server
pnpm dev
```

The Theme Studio will be available at `http://localhost:3001`

### Building

```bash
# Build for production
pnpm build

# Serve the production build
pnpm start

# Or do both in one command
pnpm serve
```

The production server runs on `http://localhost:3001`

## Usage

1. **Select or Create a Brand** - Use the brand selector in the top toolbar
2. **Edit Colors** - Navigate to the Colors tab to customize your palette
3. **Customize Typography** - Adjust fonts and weights in the Typography tab
4. **Preview Components** - See your theme applied to real MUI components in the preview pane
5. **Export Your Theme** - Go to the Export tab to download or copy your theme code

## Tech Stack

- **Next.js 15** - React framework with App Router
- **MUI v8** - Material-UI component library
- **Zustand** - State management with persistence
- **React Colorful** - Color picker component
- **TypeScript** - Type-safe development

## Architecture

The application follows a modular architecture:

- `/src/app` - Next.js app router pages and layouts
- `/src/components` - React components organized by feature
- `/src/lib` - Core utilities and business logic
  - `/theme` - Theme builder and type definitions
  - `/store` - Zustand state management
  - `/utils` - Helper functions (contrast checker, code generator)

## License

MIT
