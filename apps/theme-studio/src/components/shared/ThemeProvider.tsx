"use client";

import { ReactNode, useEffect, useState, useMemo } from "react";
import { 
  ThemeProvider as MuiThemeProvider,
  useColorScheme 
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeStore } from "@/lib/store/theme-store";
import { buildThemeFromBrand } from "@/lib/adapters/theme-library-adapter";

interface ThemeProviderProps {
  children: ReactNode;
}

// Component to sync Zustand color mode to MUI's color scheme
// This runs inside ThemeProvider so it has access to useColorScheme
function ModeController({ children }: { children: ReactNode }) {
  const colorMode = useThemeStore((state) => state.colorMode);
  const { setMode } = useColorScheme();

  // Sync Zustand → MUI (one-way sync)
  // When user clicks toggle button, Zustand state updates, and we push to MUI
  useEffect(() => {
    setMode(colorMode);
  }, [colorMode, setMode]);

  return <>{children}</>;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Use selective subscriptions to avoid unnecessary re-renders
  const activeBrandId = useThemeStore((state) => state.activeBrandId);
  const activeBrand = useThemeStore((state) => 
    state.brands.find((b) => b.id === state.activeBrandId) || null
  );
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build theme with useMemo tied to the brand's updatedAt timestamp
  // This ensures a new theme is created only when the brand actually changes
  // The adapter now caches themes internally to prevent rebuilding
  const theme = useMemo(() => {
    if (!activeBrand) return undefined;
    
    return buildThemeFromBrand(activeBrand);
  }, [activeBrand?.id, activeBrand?.metadata.updatedAt, activeBrand?.designStyle]);

  if (!mounted) {
    return null;
  }

  // Don't render until we have a theme
  if (!theme) {
    return null;
  }

  return (
    <MuiThemeProvider 
      theme={theme}
      defaultMode="light"
    >
      <CssBaseline enableColorScheme />
      <ModeController>{children}</ModeController>
    </MuiThemeProvider>
  );
}
