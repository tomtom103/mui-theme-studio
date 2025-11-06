// All type definitions
import { Theme, ThemeOptions } from '@mui/material/styles';
import { ComponentCategory } from './components';

export * from './components';

export interface ColorTokens {
  primary: string;
  secondary: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
  background?: {
    default: string;
    paper: string;
  };
  text?: {
    primary: string;
    secondary: string;
  };
}

export interface SpacingTokens {
  baseUnit: number;
  scale: 'linear' | 'exponential';
  steps: number[];
}

export interface TypographyTokens {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface PresetOptions {
  [key: string]: any;
}

export interface ThemeBuilderConfig {
  colorTokens?: Partial<ColorTokens>;
  spacingTokens?: Partial<SpacingTokens>;
  typographyTokens?: Partial<TypographyTokens>;
  baseTheme?: Partial<ThemeOptions>;
  pluginOptions?: Record<string, any>;
}

export type StyleGenerator = (theme: Theme, options?: any) => Record<string, any>;

export interface PresetRule {
  categories: ComponentCategory[];
  styleGenerator: StyleGenerator;
  options?: any;
  specificOverrides?: Record<string, any>;
}
