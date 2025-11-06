# MUI Theme Builder - Turborepo Monorepo

A comprehensive monorepo for building and managing @mui themes, featuring a visual Theme Studio application.

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `theme-studio`: A Next.js 15 app - **Visual MUI Theme Builder and Manager**
- `docs`: A vanilla [Vite](https://vitejs.dev) TypeScript app
- `web`: Another vanilla [Vite](https://vitejs.dev) TypeScript app
- `@repo/ui`: A stub component & utility library shared by apps
- `@repo/eslint-config`: Shared `eslint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```sh
pnpm install
```

### Development

Run all apps in development mode:

```sh
pnpm dev
```

Or run a specific app:

```sh
# Theme Studio on port 3001
pnpm --filter theme-studio dev

# Docs on default port
pnpm --filter docs dev

# Web on default port
pnpm --filter web dev
```

### Build

Build all apps and packages:

```sh
pnpm build
```

### Production

Serve the production build:

```sh
# Build and serve Theme Studio in production mode
pnpm prod

# Or build first, then start
pnpm build
pnpm start

# Theme Studio specific
pnpm --filter theme-studio serve
```

The Theme Studio production server runs on `http://localhost:3001`.

## Theme Studio

The **Theme Studio** is a visual development tool that allows you to:

- 🎨 Create and manage multiple brand themes
- 🌈 Edit color palettes with live preview
- ✍️ Customize typography settings
- 👁️ Test components across light/dark modes
- 📦 Export production-ready theme code
- ♿ Validate WCAG accessibility contrast ratios

Visit the Theme Studio at `http://localhost:3001` when running in development mode.

For more details, see the [Theme Studio README](./apps/theme-studio/README.md).

## Project Structure

```
mui-theme-builder/
├── apps/
│   ├── theme-studio/     # Next.js MUI Theme Builder
│   ├── docs/             # Vite documentation app
│   └── web/              # Vite web app
├── packages/
│   ├── ui/               # Shared UI components
│   ├── eslint-config/    # Shared ESLint config
│   └── typescript-config/# Shared TypeScript config
└── turbo.json           # Turborepo configuration
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Turborepo](https://turbo.build/repo) for monorepo management
- [pnpm](https://pnpm.io/) for package management
