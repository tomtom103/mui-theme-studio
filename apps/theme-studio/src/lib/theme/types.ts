// lib/theme/types.ts
import type { ThemeOptions } from "@mui/material/styles";

export interface BrandConfig {
  id: string;
  name: string;
  description?: string;
  tokens: BrandTokens;
  designStyle?: DesignStyle; // Optional design style preset
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

export interface BrandTokens {
  palette: {
    primary: ColorScale;
    secondary: ColorScale;
    error: ColorScale;
    warning: ColorScale;
    info: ColorScale;
    success: ColorScale;
    neutral: ColorScale;
  };
  typography: {
    fontFamily: string;
    fontFamilyCode?: string;
    fontSize: number;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
    fontWeightBold: number;
    h1?: TypographyStyle;
    h2?: TypographyStyle;
    h3?: TypographyStyle;
    h4?: TypographyStyle;
    h5?: TypographyStyle;
    h6?: TypographyStyle;
    body1?: TypographyStyle;
    body2?: TypographyStyle;
    button?: TypographyStyle;
    caption?: TypographyStyle;
  };
  shape: {
    borderRadius: number;
  };
  spacing: number; // Base unit
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  // Advanced theming
  elevation?: ElevationConfig;
  effects?: EffectsConfig;
  surfaces?: SurfaceConfig;
  components?: ComponentOverrides;
}

export interface ElevationConfig {
  // For neumorphism and other elevation-based styles
  style: "material" | "neumorphic" | "flat" | "layered";
  intensity: number; // 0-100
  lightSource?: {
    angle: number; // degrees
    distance: number;
  };
}

export interface EffectsConfig {
  // For glassmorphism, frosted glass, etc.
  blur?: {
    enabled: boolean;
    amount: number; // px
  };
  backdrop?: {
    enabled: boolean;
    blur: number; // px
    saturation: number; // percentage
  };
  gradients?: {
    enabled: boolean;
    style: "subtle" | "vibrant" | "mesh";
  };
  glow?: {
    enabled: boolean;
    intensity: number; // 0-100
  };
}

export interface SurfaceConfig {
  // Background and surface treatments
  style: "solid" | "gradient" | "glass" | "textured";
  opacity?: number; // 0-1
  pattern?: "none" | "dots" | "grid" | "noise";
  contrast: "low" | "medium" | "high";
}

export interface ColorScale {
  main: string;
  light?: string;
  dark?: string;
  contrastText?: string;
}

export interface TypographyStyle {
  fontSize?: string | number;
  fontWeight?: number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
}

export interface ComponentOverrides {
  MuiButton?: {
    defaultProps?: Record<string, any>;
    styleOverrides?: {
      root?: Record<string, any>;
      contained?: Record<string, any>;
      outlined?: Record<string, any>;
      text?: Record<string, any>;
    };
  };
  MuiCard?: {
    defaultProps?: Record<string, any>;
    styleOverrides?: {
      root?: Record<string, any>;
    };
  };
  MuiPaper?: {
    defaultProps?: Record<string, any>;
    styleOverrides?: {
      root?: Record<string, any>;
      elevation0?: Record<string, any>;
      elevation1?: Record<string, any>;
      elevation2?: Record<string, any>;
      elevation3?: Record<string, any>;
    };
  };
  MuiTextField?: {
    defaultProps?: Record<string, any>;
    styleOverrides?: {
      root?: Record<string, any>;
    };
  };
  MuiChip?: {
    defaultProps?: Record<string, any>;
    styleOverrides?: {
      root?: Record<string, any>;
    };
  };
  MuiAppBar?: {
    defaultProps?: Record<string, any>;
    styleOverrides?: {
      root?: Record<string, any>;
    };
  };
  // Extensible for other components
  [key: string]: any;
}

// Design style presets
export type DesignStyle =
  | "material-design-3"
  | "neumorphism"
  | "glassmorphism"
  | "brutalism"
  | "flat-design"
  | "minimal"
  | "gradient-mesh"
  | "retro"
  | "cyberpunk";

export interface DesignStyleConfig {
  id: DesignStyle;
  name: string;
  description: string;
  preview?: string; // URL or emoji
  elevation: ElevationConfig;
  effects: EffectsConfig;
  surfaces: SurfaceConfig;
  componentOverrides: ComponentOverrides;
}
