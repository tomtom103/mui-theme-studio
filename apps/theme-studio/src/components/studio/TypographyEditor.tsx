"use client";

import {
  Box,
  Typography,
  TextField,
  Stack,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  Refresh,
  FormatSize,
  FontDownload,
  Settings,
} from "@mui/icons-material";
import { useThemeStore, selectActiveBrand } from "@/lib/store/theme-store";
import { useState, useCallback, useRef, useEffect } from "react";
import type { TypographyStyle } from "@/lib/theme/types";

// Popular Google Fonts with categories
const FONT_CATEGORIES = {
  Serif: [
    "Playfair Display",
    "Merriweather",
    "Lora",
    "PT Serif",
    "Crimson Text",
    "Source Serif Pro",
  ],
  "Sans Serif": [
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Inter",
    "Work Sans",
    "Nunito",
    "Raleway",
    "Ubuntu",
  ],
  Monospace: [
    "Roboto Mono",
    "Source Code Pro",
    "JetBrains Mono",
    "Fira Code",
    "IBM Plex Mono",
  ],
  Display: [
    "Bebas Neue",
    "Oswald",
    "Righteous",
    "Abril Fatface",
    "Fredoka One",
  ],
};

const SYSTEM_FONTS = [
  "System UI",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
];

type VariantKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "button" | "caption";

const VARIANT_INFO: Record<VariantKey, { label: string; description: string; defaultSize: string }> = {
  h1: { label: "Heading 1", description: "Largest heading", defaultSize: "6rem" },
  h2: { label: "Heading 2", description: "Second-level heading", defaultSize: "3.75rem" },
  h3: { label: "Heading 3", description: "Third-level heading", defaultSize: "3rem" },
  h4: { label: "Heading 4", description: "Fourth-level heading", defaultSize: "2.125rem" },
  h5: { label: "Heading 5", description: "Fifth-level heading", defaultSize: "1.5rem" },
  h6: { label: "Heading 6", description: "Smallest heading", defaultSize: "1.25rem" },
  body1: { label: "Body 1", description: "Primary body text", defaultSize: "1rem" },
  body2: { label: "Body 2", description: "Secondary body text", defaultSize: "0.875rem" },
  button: { label: "Button", description: "Button text style", defaultSize: "0.875rem" },
  caption: { label: "Caption", description: "Small helper text", defaultSize: "0.75rem" },
};

export default function TypographyEditor() {
  const brand = useThemeStore(selectActiveBrand);
  const updateBrand = useThemeStore((state) => state.updateBrand);
  const [selectedCategory, setSelectedCategory] = useState<string>("Sans Serif");
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleFontFamilyChange = useCallback((value: string) => {
    const fontStack = value.includes(",")
      ? value
      : `"${value}", "Helvetica", "Arial", sans-serif`;

    // Debounce the update
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      updateBrand(brand.id, {
        tokens: {
          ...brand.tokens,
          typography: {
            ...brand.tokens.typography,
            fontFamily: fontStack,
          },
        },
      });
    }, 150);
  }, [brand, updateBrand]);

  const handleFontSizeChange = useCallback((value: number) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      updateBrand(brand.id, {
        tokens: {
          ...brand.tokens,
          typography: {
            ...brand.tokens.typography,
            fontSize: value,
          },
        },
      });
    }, 150);
  }, [brand, updateBrand]);

  const handleFontWeightChange = useCallback((
    key:
      | "fontWeightLight"
      | "fontWeightRegular"
      | "fontWeightMedium"
      | "fontWeightBold",
    value: number,
  ) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      updateBrand(brand.id, {
        tokens: {
          ...brand.tokens,
          typography: {
            ...brand.tokens.typography,
            [key]: value,
          },
        },
      });
    }, 150);
  }, [brand, updateBrand]);

  const handleVariantChange = useCallback((variant: VariantKey, updates: Partial<TypographyStyle>) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const currentVariant = brand.tokens.typography[variant] || {};
      updateBrand(brand.id, {
        tokens: {
          ...brand.tokens,
          typography: {
            ...brand.tokens.typography,
            [variant]: {
              ...currentVariant,
              ...updates,
            },
          },
        },
      });
    }, 150);
  }, [brand, updateBrand]);

  const resetVariant = useCallback((variant: VariantKey) => {
    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        typography: {
          ...brand.tokens.typography,
          [variant]: undefined,
        },
      },
    });
  }, [brand, updateBrand]);

  const getVariantValue = useCallback((variant: VariantKey): TypographyStyle => {
    return brand.tokens.typography[variant] || {};
  }, [brand]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FontDownload /> Typography System
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize fonts, weights, and typography variants
        </Typography>
      </Box>

      {/* Font Family Picker */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FormatSize fontSize="small" /> Font Family
        </Typography>
        
        <Stack spacing={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Font Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Font Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.keys(FONT_CATEGORIES).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
              <MenuItem value="System">System Fonts</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              {selectedCategory === "System" ? "System Fonts" : `${selectedCategory} Fonts`}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedCategory === "System"
                ? SYSTEM_FONTS.map((font) => (
                    <Chip
                      key={font}
                      label={font}
                      onClick={() => handleFontFamilyChange(font)}
                      color={brand.tokens.typography.fontFamily.includes(font) ? "primary" : "default"}
                      sx={{ fontFamily: font }}
                    />
                  ))
                : FONT_CATEGORIES[selectedCategory as keyof typeof FONT_CATEGORIES]?.map((font) => (
                    <Chip
                      key={font}
                      label={font}
                      onClick={() => handleFontFamilyChange(font)}
                      color={brand.tokens.typography.fontFamily.includes(font) ? "primary" : "default"}
                      sx={{ fontFamily: `"${font}", sans-serif` }}
                    />
                  ))}
            </Stack>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Custom Font Stack"
            value={brand.tokens.typography.fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            placeholder='"Roboto", "Helvetica", "Arial", sans-serif'
            helperText="Enter a custom font family or complete font stack"
          />
        </Stack>
      </Paper>

      {/* Base Settings */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Settings fontSize="small" /> Base Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              size="small"
              label="Base Font Size"
              type="number"
              value={brand.tokens.typography.fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              size="small"
              label="Light Weight"
              type="number"
              value={brand.tokens.typography.fontWeightLight}
              onChange={(e) =>
                handleFontWeightChange("fontWeightLight", Number(e.target.value))
              }
              slotProps={{
                htmlInput: { min: 100, max: 900, step: 100 }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              size="small"
              label="Regular Weight"
              type="number"
              value={brand.tokens.typography.fontWeightRegular}
              onChange={(e) =>
                handleFontWeightChange("fontWeightRegular", Number(e.target.value))
              }
              slotProps={{
                htmlInput: { min: 100, max: 900, step: 100 }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              size="small"
              label="Medium Weight"
              type="number"
              value={brand.tokens.typography.fontWeightMedium}
              onChange={(e) =>
                handleFontWeightChange("fontWeightMedium", Number(e.target.value))
              }
              slotProps={{
                htmlInput: { min: 100, max: 900, step: 100 }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              size="small"
              label="Bold Weight"
              type="number"
              value={brand.tokens.typography.fontWeightBold}
              onChange={(e) =>
                handleFontWeightChange("fontWeightBold", Number(e.target.value))
              }
              slotProps={{
                htmlInput: { min: 100, max: 900, step: 100 }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Divider />

      {/* Typography Variants */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Typography Variants
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          Customize individual text styles for different use cases
        </Typography>

        <Stack spacing={1}>
          {(Object.keys(VARIANT_INFO) as VariantKey[]).map((variant) => {
            const variantData = getVariantValue(variant);
            const info = VARIANT_INFO[variant];
            const hasCustomization = Object.keys(variantData).length > 0;

            return (
              <Accordion key={variant} disableGutters elevation={0} variant="outlined">
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                    <Typography
                      variant={variant}
                      sx={{
                        fontSize: variant.startsWith("h") ? "1.2rem" : "1rem",
                        flex: 1,
                      }}
                    >
                      {info.label}
                    </Typography>
                    {hasCustomization && (
                      <Chip label="Custom" size="small" color="primary" variant="outlined" />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Typography variant="caption" color="text.secondary">
                      {info.description} • Default: {info.defaultSize}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Font Size"
                          value={variantData.fontSize || ""}
                          onChange={(e) =>
                            handleVariantChange(variant, { fontSize: e.target.value })
                          }
                          placeholder={info.defaultSize}
                          helperText="e.g., 2rem, 24px"
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Font Weight"
                          type="number"
                          value={variantData.fontWeight || ""}
                          onChange={(e) =>
                            handleVariantChange(variant, {
                              fontWeight: Number(e.target.value),
                            })
                          }
                          placeholder="400"
                          slotProps={{
                            htmlInput: { min: 100, max: 900, step: 100 }
                          }}
                          helperText="100-900"
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Line Height"
                          value={variantData.lineHeight || ""}
                          onChange={(e) =>
                            handleVariantChange(variant, { lineHeight: e.target.value })
                          }
                          placeholder="1.5"
                          helperText="e.g., 1.5, 24px"
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Letter Spacing"
                          value={variantData.letterSpacing || ""}
                          onChange={(e) =>
                            handleVariantChange(variant, {
                              letterSpacing: e.target.value,
                            })
                          }
                          placeholder="0"
                          helperText="e.g., 0.5px, 0.05em"
                        />
                      </Grid>
                    </Grid>

                    {hasCustomization && (
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Tooltip title="Reset to default">
                          <IconButton
                            size="small"
                            onClick={() => resetVariant(variant)}
                            color="error"
                          >
                            <Refresh fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Preview
                      </Typography>
                      <Typography variant={variant}>
                        The quick brown fox jumps over the lazy dog
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}
