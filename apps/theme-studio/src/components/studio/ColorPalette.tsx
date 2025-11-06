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
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import {
  ExpandMore,
  Shuffle,
  ColorLens,
  AutoFixHigh,
  CheckCircle,
  Palette,
  Tune,
  Circle,
} from "@mui/icons-material";
import { HexColorPicker } from "react-colorful";
import { useThemeStore, selectActiveBrand } from "@/lib/store/theme-store";
import { checkContrast } from "@/lib/utils/contrast-checker";
import {
  generatePalette,
  getRandomVibrantColor,
  ColorHarmonyType,
  hexToHSL,
  hslToHex,
  getComplementary,
  getAnalogous,
  getTriadic,
  getTetradic,
  getSplitComplementary,
  getMonochromatic,
  getSquare,
  getCompound,
  getShades,
  getCustom,
  adjustLightness,
  getContrastColor,
} from "@/lib/utils/color-harmony";
import ColorWheel from "./ColorWheel";

type TabValue = "wheel" | "harmony" | "manual";

export default function ColorPalette() {
  const brand = useThemeStore(selectActiveBrand);
  const updateBrand = useThemeStore((state) => state.updateBrand);

  const [activeTab, setActiveTab] = useState<TabValue>("wheel");
  const [expandedPanel, setExpandedPanel] = useState<string>("primary");
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for smooth color updates
  const [localColors, setLocalColors] = useState<
    Record<string, Record<string, string>>
  >({});

  // Color wheel state
  const [wheelBaseColor, setWheelBaseColor] = useState("#1976d2");
  const [wheelHarmonyType, setWheelHarmonyType] =
    useState<ColorHarmonyType>("complementary");
  const [wheelMarkers, setWheelMarkers] = useState<
    Array<{ color: string; label?: string }>
  >([]);
  
  // Custom mode state - allow users to add/manage custom markers
  const [customMarkers, setCustomMarkers] = useState<string[]>([]);

  // Palette generator state
  const [generatorBaseColor, setGeneratorBaseColor] = useState("#1976d2");
  const [generatorHarmonyType, setGeneratorHarmonyType] =
    useState<ColorHarmonyType>("complementary");
  const [previewPalette, setPreviewPalette] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Update wheel markers when harmony type changes
  useEffect(() => {
    const markers: Array<{ color: string; label?: string }> = [];
    const baseHsl = hexToHSL(wheelBaseColor);

    switch (wheelHarmonyType) {
      case "analogous":
        const analogous = getAnalogous(wheelBaseColor);
        markers.push({ color: analogous[0] }, { color: analogous[1] });
        break;
      case "monochromatic":
        // For monochromatic, show variations of lightness
        const mono = getMonochromatic(wheelBaseColor, 3);
        markers.push({ color: mono[0] }, { color: mono[1] });
        break;
      case "triad":
        const triadic = getTriadic(wheelBaseColor);
        markers.push({ color: triadic[0] }, { color: triadic[1] });
        break;
      case "complementary":
        markers.push({ color: getComplementary(wheelBaseColor) });
        break;
      case "split-complementary":
        const split = getSplitComplementary(wheelBaseColor);
        markers.push({ color: split[0] }, { color: split[1] });
        break;
      case "square":
        const square = getSquare(wheelBaseColor);
        markers.push(
          { color: square[0] },
          { color: square[1] },
          { color: square[2] }
        );
        break;
      case "compound":
        const compound = getCompound(wheelBaseColor);
        markers.push(
          { color: compound[0] },
          { color: compound[1] },
          { color: compound[2] }
        );
        break;
      case "shades":
        // For shades, show variations in saturation/lightness
        const shades = getShades(wheelBaseColor, 3);
        markers.push({ color: shades[0] }, { color: shades[1] });
        break;
      case "custom":
        // For custom mode, use user-managed markers
        customMarkers.forEach(color => {
          markers.push({ color });
        });
        break;
    }

    setWheelMarkers(markers);
  }, [wheelBaseColor, wheelHarmonyType, customMarkers]);

  if (!brand) {
    return <Typography>No brand selected</Typography>;
  }

  // Get color from local state if being edited, otherwise from brand
  const getColor = (paletteKey: string, colorKey: string): string => {
    return (
      localColors[paletteKey]?.[colorKey] ||
      (
        brand.tokens.palette[
          paletteKey as keyof typeof brand.tokens.palette
        ] as any
      )?.[colorKey] ||
      ""
    );
  };

  // Handle immediate local update
  const handleLocalColorChange = useCallback(
    (paletteKey: string, colorKey: string, value: string) => {
      setLocalColors((prev) => ({
        ...prev,
        [paletteKey]: {
          ...(prev[paletteKey] || {}),
          [colorKey]: value,
        },
      }));
    },
    []
  );

  // Commit color to store with debouncing
  const commitColorChange = useCallback(
    (
      paletteKey: keyof typeof brand.tokens.palette,
      colorKey: "main" | "light" | "dark" | "contrastText",
      value: string
    ) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

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

        setLocalColors((prev) => {
          const newState = { ...prev };
          if (newState[paletteKey]) {
            delete newState[paletteKey][colorKey];
            if (Object.keys(newState[paletteKey]).length === 0) {
              delete newState[paletteKey];
            }
          }
          return newState;
        });
      }, 150);
    },
    [brand, updateBrand]
  );

  // Apply palette from color wheel
  const handleApplyWheelPalette = () => {
    if (!brand) return;

    const palette = generatePalette(wheelBaseColor, wheelHarmonyType);

    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        palette: {
          ...brand.tokens.palette,
          primary: { ...palette.primary },
          secondary: { ...palette.secondary },
          error: { ...palette.error },
          warning: { ...palette.warning },
          info: { ...palette.info },
          success: { ...palette.success },
          neutral: palette.neutral ? { ...palette.neutral } : { ...brand.tokens.palette.neutral },
        },
      },
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Generate preview for harmony generator
  const handleGeneratePreview = () => {
    const palette = generatePalette(generatorBaseColor, generatorHarmonyType);
    setPreviewPalette(palette);
  };

  // Randomize for harmony generator
  const handleRandomize = () => {
    const randomColor = getRandomVibrantColor();
    setGeneratorBaseColor(randomColor);
    const palette = generatePalette(randomColor, generatorHarmonyType);
    setPreviewPalette(palette);
  };

  // Apply palette from harmony generator
  const handleApplyGeneratorPalette = () => {
    if (!previewPalette || !brand) return;

    updateBrand(brand.id, {
      tokens: {
        ...brand.tokens,
        palette: {
          ...brand.tokens.palette,
          primary: { ...previewPalette.primary },
          secondary: { ...previewPalette.secondary },
          error: { ...previewPalette.error },
          warning: { ...previewPalette.warning },
          info: { ...previewPalette.info },
          success: { ...previewPalette.success },
          neutral: previewPalette.neutral ? { ...previewPalette.neutral } : { ...brand.tokens.palette.neutral },
        },
      },
    });

    setPreviewPalette(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderColorScale = (
    label: string,
    paletteKey: keyof typeof brand.tokens.palette
  ) => {
    const colors = brand.tokens.palette[paletteKey];

    const mainColor = getColor(paletteKey, "main") || colors.main;
    const lightColor =
      getColor(paletteKey, "light") || colors.light || colors.main;
    const darkColor =
      getColor(paletteKey, "dark") || colors.dark || colors.main;
    const contrastColor =
      getColor(paletteKey, "contrastText") ||
      colors.contrastText ||
      "#ffffff";

    const contrast = checkContrast(mainColor, contrastColor);

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

  const renderColorBox = (label: string, color: string) => (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 1,
          bgcolor: color,
          border: 1,
          borderColor: "divider",
          mb: 1,
          mx: "auto",
        }}
      />
      <Typography variant="caption" display="block">
        {label}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontFamily: "monospace", fontSize: "0.65rem" }}
      >
        {color}
      </Typography>
    </Box>
  );

  return (
    <Stack spacing={2}>
      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" icon={<CheckCircle />}>
          Palette applied successfully! Check the live preview.
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          🎨 Color Palette
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and customize your brand colors
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
      >
        <Tab icon={<Circle />} label="Wheel" value="wheel" />
        <Tab icon={<Palette />} label="Harmony" value="harmony" />
        <Tab icon={<Tune />} label="Manual" value="manual" />
      </Tabs>

      <Divider />

      {/* Color Wheel Tab */}
      {activeTab === "wheel" && (
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Pick colors from the interactive color wheel. Choose a harmony
              type to see related colors.
            </Typography>
          </Box>

          {/* Harmony Type Selection */}
          <FormControl fullWidth size="small">
            <InputLabel>Harmony Type</InputLabel>
            <Select
              value={wheelHarmonyType}
              label="Harmony Type"
              onChange={(e) =>
                setWheelHarmonyType(e.target.value as ColorHarmonyType)
              }
            >
              <MenuItem value="analogous">Analogous</MenuItem>
              <MenuItem value="monochromatic">Monochromatic</MenuItem>
              <MenuItem value="triad">Triad</MenuItem>
              <MenuItem value="complementary">Complementary</MenuItem>
              <MenuItem value="split-complementary">
                Split Complementary
              </MenuItem>
              <MenuItem value="square">Square</MenuItem>
              <MenuItem value="compound">Compound</MenuItem>
              <MenuItem value="shades">Shades</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {/* Color Wheel */}
          <ColorWheel
            value={wheelBaseColor}
            onChange={setWheelBaseColor}
            size={280}
            markers={wheelMarkers}
            customMode={wheelHarmonyType === "custom"}
            onMarkerAdd={(color) => {
              if (customMarkers.length < 5) {
                setCustomMarkers(prev => [...prev, color]);
              }
            }}
          />
          
          {/* Custom Mode Controls */}
          {wheelHarmonyType === "custom" && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Custom Markers
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hold Shift and click on the color wheel to add custom color markers (up to 5 additional colors)
                </Typography>
                
                {customMarkers.length > 0 && (
                  <Stack spacing={1}>
                    {customMarkers.map((color, idx) => (
                      <Stack 
                        key={idx} 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: color,
                            border: 1,
                            borderColor: "divider",
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ fontFamily: "monospace", flex: 1 }}
                        >
                          {color}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setCustomMarkers(prev => 
                              prev.filter((_, i) => i !== idx)
                            );
                          }}
                        >
                          <Circle sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
                
                <Button
                  size="small"
                  variant="outlined"
                  disabled={customMarkers.length >= 5}
                  onClick={() => {
                    // Add a random color as a starting point
                    const newColor = getRandomVibrantColor();
                    setCustomMarkers(prev => [...prev, newColor]);
                  }}
                  startIcon={<ColorLens />}
                >
                  Add Random Marker ({customMarkers.length}/5)
                </Button>
                
                {customMarkers.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() => setCustomMarkers([])}
                  >
                    Clear All Markers
                  </Button>
                )}
              </Stack>
            </Paper>
          )}

          {/* Color Display */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 1,
                    bgcolor: wheelBaseColor,
                    border: 2,
                    borderColor: "primary.main",
                    mb: 1,
                    mx: "auto",
                  }}
                />
                <Typography variant="caption" display="block">
                  Base
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "monospace", fontSize: "0.65rem" }}
                >
                  {wheelBaseColor}
                </Typography>
              </Box>

              {wheelMarkers.map((marker, idx) => (
                <Box key={idx} sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      bgcolor: marker.color,
                      border: 1,
                      borderColor: "divider",
                      mb: 1,
                      mx: "auto",
                    }}
                  />
                  <Typography variant="caption" display="block">
                    {marker.label || `Color ${idx + 1}`}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace", fontSize: "0.65rem" }}
                  >
                    {marker.color}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Apply Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleApplyWheelPalette}
            startIcon={<AutoFixHigh />}
            fullWidth
          >
            Apply Palette to Theme
          </Button>

          <Alert severity="info">
            The base color will be applied as your primary color. Related colors
            will be distributed across secondary, warning, and info.
          </Alert>
        </Stack>
      )}

      {/* Harmony Generator Tab */}
      {activeTab === "harmony" && (
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generate harmonious color palettes based on color theory
            </Typography>
          </Box>

          {/* Base Color Picker */}
          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Base Color
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <HexColorPicker
                  color={generatorBaseColor}
                  onChange={setGeneratorBaseColor}
                  style={{ width: "100%", height: 150 }}
                />
              </Box>
              <Tooltip title="Random vibrant color">
                <IconButton onClick={handleRandomize} color="primary">
                  <Shuffle />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 1, fontFamily: "monospace", textAlign: "center" }}
            >
              {generatorBaseColor}
            </Typography>
          </Box>

          {/* Harmony Type Selection */}
          <FormControl fullWidth>
            <InputLabel>Color Harmony</InputLabel>
            <Select
              value={generatorHarmonyType}
              label="Color Harmony"
              onChange={(e) =>
                setGeneratorHarmonyType(e.target.value as ColorHarmonyType)
              }
            >
              <MenuItem value="analogous">
                <Box>
                  <Typography variant="body2">Analogous</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Adjacent colors (harmonious)
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="monochromatic">
                <Box>
                  <Typography variant="body2">Monochromatic</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Single hue with varying lightness
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="triad">
                <Box>
                  <Typography variant="body2">Triad</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Three equally spaced colors
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="complementary">
                <Box>
                  <Typography variant="body2">Complementary</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Opposite colors (high contrast)
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="split-complementary">
                <Box>
                  <Typography variant="body2">Split Complementary</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Base + two adjacent to complement
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="square">
                <Box>
                  <Typography variant="body2">Square</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Four colors equally spaced (90°)
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="compound">
                <Box>
                  <Typography variant="body2">Compound (Tetradic)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Two complementary pairs
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="shades">
                <Box>
                  <Typography variant="body2">Shades</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Variations in saturation and lightness
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="custom">
                <Box>
                  <Typography variant="body2">Custom</Typography>
                  <Typography variant="caption" color="text.secondary">
                    User-defined color angles
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Generate Button */}
          <Button
            variant="outlined"
            size="large"
            onClick={handleGeneratePreview}
            startIcon={<ColorLens />}
            fullWidth
          >
            Generate Preview
          </Button>

          {/* Preview */}
          {previewPalette && (
            <>
              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Preview Palette
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Stack spacing={2}>
                    {/* Primary */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                        display="block"
                      >
                        Primary
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-around"
                      >
                        {renderColorBox("Light", previewPalette.primary.light)}
                        {renderColorBox("Main", previewPalette.primary.main)}
                        {renderColorBox("Dark", previewPalette.primary.dark)}
                      </Stack>
                    </Box>

                    {/* Secondary */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                        display="block"
                      >
                        Secondary
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-around"
                      >
                        {renderColorBox(
                          "Light",
                          previewPalette.secondary.light
                        )}
                        {renderColorBox("Main", previewPalette.secondary.main)}
                        {renderColorBox("Dark", previewPalette.secondary.dark)}
                      </Stack>
                    </Box>

                    {/* Accent Colors */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                        display="block"
                      >
                        Accent Colors
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-around"
                      >
                        {renderColorBox("Warning", previewPalette.warning.main)}
                        {renderColorBox("Info", previewPalette.info.main)}
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              {/* Apply Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleApplyGeneratorPalette}
                startIcon={<AutoFixHigh />}
                fullWidth
                color="primary"
              >
                Apply to Current Theme
              </Button>
            </>
          )}
        </Stack>
      )}

      {/* Manual Editor Tab */}
      {activeTab === "manual" && (
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Fine-tune each color individually with contrast checking
            </Typography>
          </Box>

          {renderColorScale("Primary", "primary")}
          {renderColorScale("Secondary", "secondary")}
          {renderColorScale("Error", "error")}
          {renderColorScale("Warning", "warning")}
          {renderColorScale("Info", "info")}
          {renderColorScale("Success", "success")}
          {renderColorScale("Neutral", "neutral")}
        </Stack>
      )}
    </Stack>
  );
}
