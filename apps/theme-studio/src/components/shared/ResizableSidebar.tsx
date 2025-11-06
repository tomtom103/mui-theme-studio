"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { Box } from "@mui/material";

interface ResizableSidebarProps {
  children: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export default function ResizableSidebar({
  children,
  defaultWidth = 400,
  minWidth = 300,
  maxWidth = 800,
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <Box
      ref={sidebarRef}
      sx={{
        width: width,
        position: "relative",
        flexShrink: 0,
        transition: isResizing ? "none" : "width 0.1s ease",
      }}
    >
      {children}

      {/* Resize Handle */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          cursor: "col-resize",
          backgroundColor: "transparent",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "primary.main",
          },
          "&:active": {
            backgroundColor: "primary.dark",
          },
          zIndex: 10,
        }}
      >
        {/* Visible indicator on hover */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: "divider",
          }}
        />
      </Box>
    </Box>
  );
}
