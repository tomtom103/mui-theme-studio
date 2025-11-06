"use client";

import { useState } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tooltip,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { Add, ContentCopy, Delete } from "@mui/icons-material";
import { useThemeStore } from "@/lib/store/theme-store";
import type { BrandConfig, DesignStyle } from "@/lib/theme/types";
import { createNewBrand } from "@/lib/theme/defaults";
import { getStyleColorPalette, hasStyleColors } from "@/lib/theme/style-colors";
import { useShallow } from "zustand/react/shallow";

// Design style options with descriptions
const DESIGN_STYLES: Array<{
  id: DesignStyle;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple design with subtle shadows",
    icon: "⚪",
  },
  {
    id: "material-design-3",
    name: "Material Design 3",
    description: "Google's latest design system with elevated surfaces",
    icon: "🎨",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass effect with blur and transparency",
    icon: "💎",
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft UI with subtle shadows and highlights",
    icon: "🔘",
  },
  {
    id: "brutalism",
    name: "Brutalism",
    description: "Bold, chunky borders with high contrast",
    icon: "🧱",
  },
  {
    id: "flat-design",
    name: "Flat Design",
    description: "No shadows, solid colors, minimal depth",
    icon: "📐",
  },
  {
    id: "retro",
    name: "Retro",
    description: "Vintage warm colors and classic styling",
    icon: "📻",
  },
  // {
  //   id: "cyberpunk",
  //   name: "Cyberpunk",
  //   description: "Neon colors with high contrast and glow effects",
  //   icon: "⚡",
  // },
];

export default function BrandSelector() {
  const {
    brands,
    activeBrandId,
    setActiveBrand,
    addBrand,
    duplicateBrand,
    deleteBrand,
    updateBrand,
  } = useThemeStore(
    useShallow((state) => ({
      brands: state.brands,
      activeBrandId: state.activeBrandId,
      setActiveBrand: state.setActiveBrand,
      addBrand: state.addBrand,
      duplicateBrand: state.duplicateBrand,
      deleteBrand: state.deleteBrand,
      updateBrand: state.updateBrand,
    }))
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [selectedDesignStyle, setSelectedDesignStyle] =
    useState<DesignStyle>("minimal");

  const handleCreateBrand = () => {
    if (!newBrandName.trim()) return;

    const newBrand = createNewBrand(newBrandName, selectedDesignStyle);

    addBrand(newBrand);
    setNewBrandName("");
    setSelectedDesignStyle("minimal"); // Reset to default
    setDialogOpen(false);
  };

  const handleDuplicate = () => {
    if (activeBrandId) {
      duplicateBrand(activeBrandId);
    }
  };

  const handleDelete = () => {
    if (activeBrandId && brands.length > 1) {
      deleteBrand(activeBrandId);
    }
  };

  const handleDesignStyleChange = (event: SelectChangeEvent<string>) => {
    const newStyle = event.target.value as DesignStyle;
    if (!activeBrandId) return;

    const brand = brands.find((b) => b.id === activeBrandId);
    if (!brand) return;

    // Check if this style has recommended colors
    if (hasStyleColors(newStyle)) {
      const styleColors = getStyleColorPalette(newStyle);
      
      // Update both design style and colors
      updateBrand(activeBrandId, { 
        designStyle: newStyle,
        tokens: {
          ...brand.tokens,
          palette: {
            ...brand.tokens.palette,
            ...styleColors,
          },
        },
      });
    } else {
      // Just update the design style
      updateBrand(activeBrandId, { designStyle: newStyle });
    }
  };

  const activeBrand = brands.find((b) => b.id === activeBrandId);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        {/* Design Style Selector for active brand */}
        {activeBrand && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={activeBrand.designStyle || "minimal"}
              onChange={handleDesignStyleChange}
              displayEmpty
            >
              {DESIGN_STYLES.map((style) => (
                <MenuItem key={style.id} value={style.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{style.icon}</span>
                    <span>{style.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Brand</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Brand Name"
            type="text"
            fullWidth
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateBrand();
              }
            }}
          />
          
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Design Style
            </Typography>
            <Select
              value={selectedDesignStyle}
              onChange={(e) => setSelectedDesignStyle(e.target.value as DesignStyle)}
            >
              {DESIGN_STYLES.map((style) => (
                <MenuItem key={style.id} value={style.id}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{style.icon}</span>
                      <Typography variant="body1">{style.name}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {style.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateBrand} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
