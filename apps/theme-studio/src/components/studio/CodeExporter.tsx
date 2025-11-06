"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Alert,
} from "@mui/material";
import { Download, ContentCopy, Check } from "@mui/icons-material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useThemeStore, selectActiveBrand } from "@/lib/store/theme-store";
import { generateThemeCode } from "@/lib/utils/code-generator";
import { saveAs } from "file-saver";

export default function CodeExporter() {
  const brand = useThemeStore(selectActiveBrand);

  const [format, setFormat] = useState<"theme-library" | "typescript" | "json">("theme-library");
  const [copied, setCopied] = useState(false);

  if (!brand) {
    return <Alert severity="info">Select a brand to export</Alert>;
  }

  const code = generateThemeCode(brand, format);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const extension = format === "json" ? "json" : "ts";
    const filename = `${brand.name.toLowerCase().replace(/\s+/g, "-")}-theme.${extension}`;
    saveAs(blob, filename);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Export Theme Code
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Copy or download the theme configuration for use in your application.
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" gutterBottom display="block">
          Format
        </Typography>
        <ToggleButtonGroup
          value={format}
          exclusive
          onChange={(_, val) => val && setFormat(val)}
          size="small"
        >
          <ToggleButton value="theme-library">Theme Library (Recommended)</ToggleButton>
          <ToggleButton value="typescript">Legacy TypeScript</ToggleButton>
          <ToggleButton value="json">JSON</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {format === "theme-library" && (
        <Alert severity="info">
          This code uses the @mui-theme-builder/theme-library package. 
          Install it with: <code>npm install @mui-theme-builder/theme-library</code>
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 0, overflow: "hidden" }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {brand.name} Theme
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={copied ? <Check /> : <ContentCopy />}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Stack>
        </Box>

        <Box sx={{ maxHeight: 500, overflow: "auto" }}>
          <SyntaxHighlighter
            language={format === "typescript" ? "typescript" : "json"}
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderRadius: 0 }}
          >
            {code}
          </SyntaxHighlighter>
        </Box>
      </Paper>

      <Alert severity="info">
        <Typography variant="body2">
          <strong>Usage Instructions:</strong> Import this theme in your app and
          wrap your components with `CssVarsProvider` from
          `@mui/material/styles`.
        </Typography>
      </Alert>
    </Stack>
  );
}
