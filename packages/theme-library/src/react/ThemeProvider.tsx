// React theme provider with preset switching
import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PresetBuilder } from '../core/PresetBuilder';
import { ColorTokens } from '../types';

interface ThemeContextValue {
  currentTheme: Theme;
  applyCustomPreset: (presetBuilder: PresetBuilder) => void;
  updateTokens: (tokens: Partial<ColorTokens>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface CustomThemeProviderProps {
  children: ReactNode;
  initialPreset?: PresetBuilder;
  baseTokens?: Partial<ColorTokens>;
  enableCssBaseline?: boolean;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
  initialPreset,
  baseTokens = {},
  enableCssBaseline = true,
}) => {
  const [customPreset, setCustomPreset] = useState<PresetBuilder | null>(
    initialPreset || null
  );
  const [tokens, setTokens] = useState(baseTokens);

  const currentTheme = useMemo(() => {
    // Create base theme with tokens
    let baseTheme = createTheme({
      palette: {
        primary: {
          main: tokens.primary || '#1976d2',
        },
        secondary: {
          main: tokens.secondary || '#dc004e',
        },
        ...(tokens.success && { success: { main: tokens.success } }),
        ...(tokens.warning && { warning: { main: tokens.warning } }),
        ...(tokens.error && { error: { main: tokens.error } }),
        ...(tokens.info && { info: { main: tokens.info } }),
      },
    });

    // Apply preset if exists
    if (customPreset) {
      const presetOptions = customPreset.build(baseTheme);
      baseTheme = createTheme(baseTheme, presetOptions);
    }

    return baseTheme;
  }, [customPreset, tokens]);

  const applyCustomPreset = useCallback((presetBuilder: PresetBuilder) => {
    setCustomPreset(presetBuilder);
  }, []);

  const updateTokens = useCallback((newTokens: Partial<ColorTokens>) => {
    setTokens((prev) => ({ ...prev, ...newTokens }));
  }, []);

  const resetTheme = useCallback(() => {
    setCustomPreset(null);
    setTokens(baseTokens);
  }, [baseTokens]);

  const value: ThemeContextValue = {
    currentTheme,
    applyCustomPreset,
    updateTokens,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={currentTheme}>
        {enableCssBaseline && <CssBaseline />}
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within CustomThemeProvider');
  }
  return context;
};
