"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Alert,
} from "@mui/material";
import {
  Shuffle,
  ColorLens,
  AutoFixHigh,
  CheckCircle,
} from "@mui/icons-material";
import { HexColorPicker } from "react-colorful";
import { useThemeStore, selectActiveBrand } from "@/lib/store/theme-store";
import {
  generatePalette,
  getRandomVibrantColor,
  ColorHarmonyType,
} from "@/lib/utils/color-harmony";

export default function PaletteGenerator() {
  const brand = useThemeStore(selectActiveBrand);
  const updateBrand = useThemeStore((state) => state.updateBrand);

  const [baseColor, setBaseColor] = useState("#1976d2");
  const [harmonyType, setHarmonyType] =
    useState<ColorHarmonyType>("complementary");
  const [previewPalette, setPreviewPalette] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!brand) {
    return <Typography>No brand selected</Typography>;
  }

  const handleGeneratePreview = () => {
    const palette = generatePalette(baseColor, harmonyType);
    setPreviewPalette(palette);
  };

  const handleRandomize = () => {
    const randomColor = getRandomVibrantColor();
    setBaseColor(randomColor);
    const palette = generatePalette(randomColor, harmonyType);
    setPreviewPalette(palette);
  };

  const handleApplyPalette = () => {
    if (!previewPalette || !brand) return;

    // Apply the palette - design style is applied automatically by the adapter
    const updatedTokens = {
      ...brand.tokens,
      palette: {
        primary: previewPalette.primary,
        secondary: previewPalette.secondary,
        error: previewPalette.error,
        warning: previewPalette.warning,
        info: previewPalette.info,
        success: previewPalette.success,
        neutral: previewPalette.neutral || brand.tokens.palette.neutral,
      },
    };

    console.log("Applying palette:", updatedTokens.palette);

    updateBrand(brand.id, {
      tokens: updatedTokens,
    });

    console.log("Theme updated for brand:", brand.id);

    setPreviewPalette(null);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
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
        sx={{ fontFamily: "monospace" }}
      >
        {color}
      </Typography>
    </Box>
  );

  return (
    <Stack spacing={3}>
      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" icon={<CheckCircle />}>
          Palette applied successfully! Check the live preview to see your new
          colors.
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          🎨 Color Palette Generator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate harmonious color palettes based on color theory
        </Typography>

        {/* Current Design Style Indicator */}
        {brand.tokens.components &&
          Object.keys(brand.tokens.components).length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                <strong>Active Design Style:</strong> Components have custom
                styling applied. Select a new style or choose "None" to reset.
              </Typography>
            </Alert>
          )}
      </Box>

      <Divider />

      {/* Base Color Picker */}
      <Box>
        <Typography variant="caption" gutterBottom display="block">
          Base Color
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <HexColorPicker
              color={baseColor}
              onChange={setBaseColor}
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
          {baseColor}
        </Typography>
      </Box>

      {/* Harmony Type Selection */}
      <FormControl fullWidth>
        <InputLabel>Color Harmony</InputLabel>
        <Select
          value={harmonyType}
          label="Color Harmony"
          onChange={(e) => setHarmonyType(e.target.value as ColorHarmonyType)}
        >
          <MenuItem value="complementary">
            <Box>
              <Typography variant="body2">Complementary</Typography>
              <Typography variant="caption" color="text.secondary">
                Opposite colors on the wheel (high contrast)
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="analogous">
            <Box>
              <Typography variant="body2">Analogous</Typography>
              <Typography variant="caption" color="text.secondary">
                Adjacent colors (harmonious, low contrast)
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="triadic">
            <Box>
              <Typography variant="body2">Triadic</Typography>
              <Typography variant="caption" color="text.secondary">
                Three colors equally spaced (vibrant)
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="tetradic">
            <Box>
              <Typography variant="body2">Tetradic (Square)</Typography>
              <Typography variant="caption" color="text.secondary">
                Four colors equally spaced (rich)
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="split-complementary">
            <Box>
              <Typography variant="body2">Split Complementary</Typography>
              <Typography variant="caption" color="text.secondary">
                Base + two adjacent to complement (balanced)
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="monochromatic">
            <Box>
              <Typography variant="body2">Monochromatic</Typography>
              <Typography variant="caption" color="text.secondary">
                Single hue with varying lightness (elegant)
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

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 1 }}>
        Design style is set in the Brand Selector above. This tool only generates color palettes.
      </Alert>

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
                    {renderColorBox("Light", previewPalette.secondary.light)}
                    {renderColorBox("Main", previewPalette.secondary.main)}
                    {renderColorBox("Dark", previewPalette.secondary.dark)}
                  </Stack>
                </Box>

                {/* Warning & Info */}
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
            onClick={handleApplyPalette}
            startIcon={<AutoFixHigh />}
            fullWidth
            color="primary"
          >
            Apply to Current Theme
          </Button>
        </>
      )}

      <Divider />

      <Box sx={{ bgcolor: "action.hover", p: 2, borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💡 <strong>Tip:</strong> Choose a base color and harmony type to
          generate beautiful palettes. Optionally select a design style (like
          Neumorphism or Glassmorphism) to apply advanced component styling and
          effects!
        </Typography>
      </Box>
    </Stack>
  );
}
