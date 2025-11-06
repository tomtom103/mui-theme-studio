"use client";

import {
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Delete,
  Refresh,
  Code,
  Lightbulb,
  Settings,
  Tune,
} from "@mui/icons-material";
import { useThemeStore, selectActiveBrand } from "@/lib/store/theme-store";
import { useState } from "react";
import type { ComponentOverrides } from "@/lib/theme/types";

// Popular MUI components to override
const AVAILABLE_COMPONENTS = [
  "MuiButton",
  "MuiCard",
  "MuiPaper",
  "MuiTextField",
  "MuiChip",
  "MuiAppBar",
  "MuiAlert",
  "MuiAvatar",
  "MuiCheckbox",
  "MuiRadio",
  "MuiSwitch",
  "MuiSlider",
  "MuiRating",
  "MuiDialog",
  "MuiDrawer",
  "MuiTooltip",
  "MuiTabs",
  "MuiTab",
  "MuiAccordion",
  "MuiBadge",
  "MuiBottomNavigation",
  "MuiBreadcrumbs",
  "MuiLink",
  "MuiMenu",
  "MuiPagination",
  "MuiStepper",
  "MuiTable",
] as const;

// Common style properties
const COMMON_STYLE_PROPS = [
  { key: "borderRadius", label: "Border Radius", placeholder: "4px", hint: "e.g., 8px, 1rem" },
  { key: "padding", label: "Padding", placeholder: "8px", hint: "e.g., 16px, 1rem" },
  { key: "margin", label: "Margin", placeholder: "0", hint: "e.g., 8px, 1rem" },
  { key: "backgroundColor", label: "Background Color", placeholder: "#ffffff", hint: "e.g., #fff, rgba(0,0,0,0.1)" },
  { key: "color", label: "Text Color", placeholder: "#000000", hint: "e.g., #000, var(--mui-palette-primary-main)" },
  { key: "fontSize", label: "Font Size", placeholder: "14px", hint: "e.g., 16px, 1rem" },
  { key: "fontWeight", label: "Font Weight", placeholder: "400", hint: "e.g., 400, 600, bold" },
  { key: "boxShadow", label: "Box Shadow", placeholder: "none", hint: "e.g., 0 2px 8px rgba(0,0,0,0.1)" },
  { key: "border", label: "Border", placeholder: "none", hint: "e.g., 1px solid #ccc" },
  { key: "textTransform", label: "Text Transform", placeholder: "none", hint: "none, uppercase, lowercase, capitalize" },
];

// Component-specific variants
const COMPONENT_VARIANTS: Record<string, string[]> = {
  MuiButton: ["root", "contained", "outlined", "text"],
  MuiCard: ["root"],
  MuiPaper: ["root", "elevation0", "elevation1", "elevation2", "elevation3"],
  MuiTextField: ["root"],
  MuiChip: ["root", "filled", "outlined"],
  MuiAlert: ["root", "standardSuccess", "standardInfo", "standardWarning", "standardError"],
  MuiTabs: ["root", "indicator"],
  MuiTab: ["root", "selected"],
};

// Quick presets for common customizations
const QUICK_PRESETS = {
  roundedButtons: {
    component: "MuiButton",
    variant: "root",
    styles: { borderRadius: "24px" },
    label: "Rounded Buttons",
  },
  flatButtons: {
    component: "MuiButton",
    variant: "contained",
    styles: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
    label: "Flat Buttons (No Shadow)",
  },
  roundedCards: {
    component: "MuiCard",
    variant: "root",
    styles: { borderRadius: "16px" },
    label: "Rounded Cards",
  },
  noButtonTransform: {
    component: "MuiButton",
    variant: "root",
    styles: { textTransform: "none" },
    label: "No Uppercase Buttons",
  },
};

export default function ComponentOverridesEditor() {
  const brand = useThemeStore(selectActiveBrand);
  const updateBrand = useThemeStore((state) => state.updateBrand);
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState(false);

  if (!brand) {
    return <Typography>No brand selected</Typography>;
  }

  const components = brand.tokens.components || {};

  const updateComponentOverride = (
    componentName: string,
    variant: string,
    property: string,
    value: any
  ) => {
    const currentComponents = { ...components };
    
    if (!currentComponents[componentName]) {
      currentComponents[componentName] = { styleOverrides: {} };
    }
    
    if (!currentComponents[componentName].styleOverrides) {
      currentComponents[componentName].styleOverrides = {};
    }
    
    if (!currentComponents[componentName].styleOverrides![variant]) {
      currentComponents[componentName].styleOverrides![variant] = {};
    }

    if (value === "" || value === null || value === undefined) {
      delete currentComponents[componentName].styleOverrides![variant][property];
      
      // Clean up empty objects
      if (Object.keys(currentComponents[componentName].styleOverrides![variant]).length === 0) {
        delete currentComponents[componentName].styleOverrides![variant];
      }
      if (Object.keys(currentComponents[componentName].styleOverrides || {}).length === 0) {
        delete currentComponents[componentName].styleOverrides;
      }
      if (Object.keys(currentComponents[componentName]).length === 0) {
        delete currentComponents[componentName];
      }
    } else {
      currentComponents[componentName].styleOverrides![variant][property] = value;
    }

    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        components: currentComponents,
      },
    });
  };

  const addComponent = (componentName: string) => {
    if (!componentName || components[componentName]) return;
    
    const currentComponents = { ...components };
    currentComponents[componentName] = {
      styleOverrides: {
        root: {},
      },
    };

    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        components: currentComponents,
      },
    });
    
    setSelectedComponent("");
  };

  const removeComponent = (componentName: string) => {
    const currentComponents = { ...components };
    delete currentComponents[componentName];

    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        components: currentComponents,
      },
    });
  };

  const applyQuickPreset = (presetKey: keyof typeof QUICK_PRESETS) => {
    const preset = QUICK_PRESETS[presetKey];
    const currentComponents = { ...components };
    
    if (!currentComponents[preset.component]) {
      currentComponents[preset.component] = { styleOverrides: {} };
    }
    
    if (!currentComponents[preset.component].styleOverrides) {
      currentComponents[preset.component].styleOverrides = {};
    }
    
    currentComponents[preset.component].styleOverrides![preset.variant] = {
      ...currentComponents[preset.component].styleOverrides![preset.variant],
      ...preset.styles,
    };

    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        components: currentComponents,
      },
    });
  };

  const clearAllOverrides = () => {
    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        components: {},
      },
    });
  };

  const getStyleValue = (componentName: string, variant: string, property: string): string => {
    return components[componentName]?.styleOverrides?.[variant]?.[property] || "";
  };

  const activeComponents = Object.keys(components);
  const availableToAdd = AVAILABLE_COMPONENTS.filter((c) => !activeComponents.includes(c));

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tune /> Component Overrides
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize the appearance and behavior of MUI components
        </Typography>
      </Box>

      {/* Quick Presets */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Lightbulb fontSize="small" /> Quick Presets
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          Apply common customizations with one click
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {Object.entries(QUICK_PRESETS).map(([key, preset]) => (
            <Chip
              key={key}
              label={preset.label}
              onClick={() => applyQuickPreset(key as keyof typeof QUICK_PRESETS)}
              icon={<Add />}
              variant="outlined"
            />
          ))}
        </Stack>
      </Paper>

      {/* Mode Toggle */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={advancedMode}
              onChange={(e) => setAdvancedMode(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography variant="body2">
              Advanced mode (JSON editor)
            </Typography>
          }
        />
        {activeComponents.length > 0 && (
          <Button
            size="small"
            color="error"
            onClick={clearAllOverrides}
            startIcon={<Delete />}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Add Component */}
      {availableToAdd.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add Component Override
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl fullWidth size="small">
              <InputLabel>Select Component</InputLabel>
              <Select
                value={selectedComponent}
                label="Select Component"
                onChange={(e) => setSelectedComponent(e.target.value)}
              >
                {availableToAdd.map((comp) => (
                  <MenuItem key={comp} value={comp}>
                    {comp}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => addComponent(selectedComponent)}
              disabled={!selectedComponent}
              startIcon={<Add />}
            >
              Add
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Active Component Overrides */}
      {activeComponents.length === 0 ? (
        <Alert severity="info" icon={<Settings />}>
          No component overrides yet. Add a component above or apply a quick preset to get started.
        </Alert>
      ) : (
        <Stack spacing={1}>
          {activeComponents.map((componentName) => {
            const variants = COMPONENT_VARIANTS[componentName] || ["root"];
            const componentData = components[componentName];

            return (
              <Accordion 
                key={componentName} 
                disableGutters 
                elevation={0} 
                variant="outlined"
                slotProps={{ transition: { unmountOnExit: true } }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore />}
                  sx={{ 
                    "& .MuiAccordionSummary-content": { 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 1 
                    } 
                  }}
                >
                  <Code fontSize="small" />
                  <Typography sx={{ fontFamily: "monospace", flex: 1 }}>
                    {componentName}
                  </Typography>
                  <Chip 
                    label="Remove" 
                    size="small" 
                    color="error"
                    variant="outlined"
                    deleteIcon={<Delete />}
                    onDelete={(e) => {
                      e.stopPropagation();
                      removeComponent(componentName);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {advancedMode ? (
                      // Advanced JSON Editor
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          Edit JSON directly (advanced)
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          value={JSON.stringify(componentData, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              const currentComponents = { ...components };
                              currentComponents[componentName] = parsed;
                              updateBrand(brand.id, {
                                tokens: {
                                  ...brand.tokens,
                                  components: currentComponents,
                                },
                              });
                            } catch (err) {
                              // Invalid JSON, don't update
                            }
                          }}
                          sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                        />
                      </Box>
                    ) : (
                      // Visual Editor
                      variants.map((variant) => (
                        <Box key={variant}>
                          <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip label={variant} size="small" variant="outlined" />
                            Variant Styles
                          </Typography>
                          <Stack spacing={2}>
                            {COMMON_STYLE_PROPS.map((prop) => (
                              <TextField
                                key={prop.key}
                                fullWidth
                                size="small"
                                label={prop.label}
                                value={getStyleValue(componentName, variant, prop.key)}
                                onChange={(e) =>
                                  updateComponentOverride(
                                    componentName,
                                    variant,
                                    prop.key,
                                    e.target.value
                                  )
                                }
                                placeholder={prop.placeholder}
                                helperText={prop.hint}
                                InputProps={{
                                  endAdornment: getStyleValue(componentName, variant, prop.key) && (
                                    <Tooltip title="Clear">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          updateComponentOverride(
                                            componentName,
                                            variant,
                                            prop.key,
                                            ""
                                          )
                                        }
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  ),
                                }}
                              />
                            ))}
                          </Stack>
                          {variant !== variants[variants.length - 1] && (
                            <Divider sx={{ my: 2 }} />
                          )}
                        </Box>
                      ))
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      )}

      {/* Info */}
      <Alert severity="info" icon={<Code />}>
        <Typography variant="body2" gutterBottom>
          <strong>Component overrides allow you to customize MUI components globally.</strong>
        </Typography>
        <Typography variant="caption" display="block">
          Changes here affect all instances of the component in your theme. Use CSS properties and values.
          For theme variables, use: <code>var(--mui-palette-primary-main)</code>
        </Typography>
      </Alert>
    </Stack>
  );
}
