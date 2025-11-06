"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Divider,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Palette,
  TextFields,
  ViewModule,
  Code,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useThemeStore } from "@/lib/store/theme-store";
import BrandSelector from "@/components/studio/BrandSelector";
import ColorPalette from "@/components/studio/ColorPalette";
import TypographyEditor from "@/components/studio/TypographyEditor";
import ComponentPlayground from "@/components/studio/ComponentPlayground";
import CodeExporter from "@/components/studio/CodeExporter";
import ComponentOverridesEditor from "@/components/studio/ComponentOverridesEditor";
import ResizableSidebar from "@/components/shared/ResizableSidebar";

export default function ThemeStudio() {
  const [activeTab, setActiveTab] = useState(0);
  const colorMode = useThemeStore((state) => state.colorMode);
  const setColorMode = useThemeStore((state) => state.setColorMode);

  const handleModeToggle = useCallback(() => {
    // If system, go to light. If light, go to dark. If dark, go to light.
    if (colorMode === "system" || colorMode === "dark") {
      setColorMode("light");
    } else {
      setColorMode("dark");
    }
  }, [colorMode, setColorMode]);

  const getModeIcon = () => {
    if (colorMode === "dark") {
      return <LightMode />;
    }
    return <DarkMode />;
  };

  const getModeTooltip = () => {
    if (colorMode === "dark") {
      return "Switch to light mode";
    }
    return "Switch to dark mode";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top App Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 0, mr: 2 }}>
            Theme Studio
          </Typography>
          
          <Chip 
            label="Development Preview" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ mr: 3, fontWeight: 500 }}
          />

          <BrandSelector />

          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="standard"
            sx={{ ml: 3 }}
          >
            <Tab icon={<Palette />} label="Colors" iconPosition="start" disableRipple disableTouchRipple/>
            {/* <Tab icon={<TextFields />} label="Typography" iconPosition="start"disableRipple  />
            <Tab icon={<ViewModule />} label="Components" iconPosition="start" disableRipple /> */}
            <Tab icon={<Code />} label="Export" iconPosition="start" />
          </Tabs> 

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={getModeTooltip()}>
            <IconButton onClick={handleModeToggle} sx={{ mr: 1 }}>
              {getModeIcon()}
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<Code />}
            onClick={() => setActiveTab(3)}
          >
            Export Theme
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel - Editors (Resizable) */}
        <ResizableSidebar defaultWidth={650} minWidth={350} maxWidth={800}>
          <Paper
            sx={{
              height: "100%",
              overflow: "auto",
              borderRadius: 0,
              borderRight: 1,
              borderColor: "divider",
            }}
            elevation={0}
          >
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && <ColorPalette />}
              {activeTab === 1 && <CodeExporter />}
            </Box>
          </Paper>
        </ResizableSidebar>

        {/* Right Panel - Live Preview */}
        <Box sx={{ flex: 1, overflow: "auto", bgcolor: "background.default" }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <ComponentPlayground />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
