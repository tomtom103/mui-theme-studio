"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { HexColorPicker } from "react-colorful";
import { useThemeStore, selectActiveBrand } from "@/lib/store/theme-store";
import { checkContrast } from "@/lib/utils/contrast-checker";

export default function ColorPaletteEditor() {
  const brand = useThemeStore(selectActiveBrand);
  const updateBrand = useThemeStore((state) => state.updateBrand);

  const [expandedPanel, setExpandedPanel] = useState<string>("primary");
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Local state for color picker - updates immediately for smooth UX
  const [localColors, setLocalColors] = useState<Record<string, Record<string, string>>>({});
  const isDraggingRef = useRef(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  if (!brand) {
    return <Typography>No brand selected</Typography>;
  }

  // Get color from local state if being edited, otherwise from brand
  const getColor = (paletteKey: string, colorKey: string): string => {
    return localColors[paletteKey]?.[colorKey] || 
           (brand.tokens.palette[paletteKey as keyof typeof brand.tokens.palette] as any)?.[colorKey] || 
           '';
  };

  // Handle immediate local update (for smooth picker drag)
  const handleLocalColorChange = useCallback((
    paletteKey: string,
    colorKey: string,
    value: string,
  ) => {
    isDraggingRef.current = true;
    setLocalColors(prev => ({
      ...prev,
      [paletteKey]: {
        ...(prev[paletteKey] || {}),
        [colorKey]: value,
      },
    }));
  }, []);

  // Commit color to store with debouncing (for drag end or text input)
  const commitColorChange = useCallback((
    paletteKey: keyof typeof brand.tokens.palette,
    colorKey: "main" | "light" | "dark" | "contrastText",
    value: string,
  ) => {
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Set new timeout for debounced update
    updateTimeoutRef.current = setTimeout(() => {
      updateBrand(brand.id, {
        tokens: {
          ...brand.tokens,
          palette: {
            ...brand.tokens.palette,
            [paletteKey]: {
              ...brand.tokens.palette[paletteKey],
              [colorKey]: value,
            },
          },
        },
      });
      
      // Clear local state after committing
      setLocalColors(prev => {
        const newState = { ...prev };
        if (newState[paletteKey]) {
          delete newState[paletteKey][colorKey];
          if (Object.keys(newState[paletteKey]).length === 0) {
            delete newState[paletteKey];
          }
        }
        return newState;
      });
      
      isDraggingRef.current = false;
    }, 150); // 150ms debounce
  }, [brand, updateBrand]);

  const renderColorScale = (
    label: string,
    paletteKey: keyof typeof brand.tokens.palette,
  ) => {
    const colors = brand.tokens.palette[paletteKey];
    
    // Use local color if being edited, otherwise brand color
    const mainColor = getColor(paletteKey, 'main') || colors.main;
    const lightColor = getColor(paletteKey, 'light') || colors.light || colors.main;
    const darkColor = getColor(paletteKey, 'dark') || colors.dark || colors.main;
    const contrastColor = getColor(paletteKey, 'contrastText') || colors.contrastText || '#ffffff';
    
    const contrast = checkContrast(
      mainColor,
      contrastColor,
    );

    return (
      <Accordion
        expanded={expandedPanel === paletteKey}
        onChange={() =>
          setExpandedPanel(expandedPanel === paletteKey ? "" : paletteKey)
        }
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: mainColor,
                border: 1,
                borderColor: "divider",
              }}
            />
            <Typography>{label}</Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Stack spacing={3}>
            {/* Main Color */}
            <Box>
              <Typography variant="caption" gutterBottom>
                Main
              </Typography>
              <HexColorPicker
                color={mainColor}
                onChange={(color) => {
                  handleLocalColorChange(paletteKey, "main", color);
                  commitColorChange(paletteKey, "main", color);
                }}
                style={{ width: "100%", height: 150 }}
              />
              <TextField
                fullWidth
                size="small"
                value={mainColor}
                onChange={(e) => {
                  const value = e.target.value;
                  handleLocalColorChange(paletteKey, "main", value);
                  commitColorChange(paletteKey, "main", value);
                }}
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Light Variant */}
            <Box>
              <Typography variant="caption" gutterBottom>
                Light
              </Typography>
              <HexColorPicker
                color={lightColor}
                onChange={(color) => {
                  handleLocalColorChange(paletteKey, "light", color);
                  commitColorChange(paletteKey, "light", color);
                }}
                style={{ width: "100%", height: 100 }}
              />
              <TextField
                fullWidth
                size="small"
                value={colors.light || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleLocalColorChange(paletteKey, "light", value);
                  commitColorChange(paletteKey, "light", value);
                }}
                placeholder="Auto-generated"
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Dark Variant */}
            <Box>
              <Typography variant="caption" gutterBottom>
                Dark
              </Typography>
              <HexColorPicker
                color={darkColor}
                onChange={(color) => {
                  handleLocalColorChange(paletteKey, "dark", color);
                  commitColorChange(paletteKey, "dark", color);
                }}
                style={{ width: "100%", height: 100 }}
              />
              <TextField
                fullWidth
                size="small"
                value={colors.dark || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleLocalColorChange(paletteKey, "dark", value);
                  commitColorChange(paletteKey, "dark", value);
                }}
                placeholder="Auto-generated"
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Contrast Text */}
            <Box>
              <Typography variant="caption" gutterBottom>
                Contrast Text
              </Typography>
              <HexColorPicker
                color={contrastColor}
                onChange={(color) => {
                  handleLocalColorChange(paletteKey, "contrastText", color);
                  commitColorChange(paletteKey, "contrastText", color);
                }}
                style={{ width: "100%", height: 100 }}
              />
              <TextField
                fullWidth
                size="small"
                value={colors.contrastText || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleLocalColorChange(paletteKey, "contrastText", value);
                  commitColorChange(paletteKey, "contrastText", value);
                }}
                placeholder="Auto-generated"
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Contrast Warning */}
            {contrast < 4.5 && (
              <Alert severity="warning">
                Contrast ratio {contrast.toFixed(2)}:1 does not meet WCAG AA
                standard (4.5:1)
              </Alert>
            )}
            {contrast >= 4.5 && contrast < 7 && (
              <Alert severity="info">
                Contrast ratio {contrast.toFixed(2)}:1 meets WCAG AA
              </Alert>
            )}
            {contrast >= 7 && (
              <Alert severity="success">
                Contrast ratio {contrast.toFixed(2)}:1 meets WCAG AAA
              </Alert>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Color Palette
      </Typography>

      {renderColorScale("Primary", "primary")}
      {renderColorScale("Secondary", "secondary")}
      {renderColorScale("Error", "error")}
      {renderColorScale("Warning", "warning")}
      {renderColorScale("Info", "info")}
      {renderColorScale("Success", "success")}
      {renderColorScale("Neutral", "neutral")}
    </Stack>
  );
}
