"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { hexToHSL, hslToHex } from "@/lib/utils/color-harmony";

interface ColorWheelProps {
  value: string; // hex color
  onChange: (color: string) => void;
  size?: number;
  markers?: Array<{ color: string; label?: string }>;
  customMode?: boolean; // Enable custom marker placement
  onMarkerAdd?: (color: string) => void; // Callback when clicking in custom mode
}

export default function ColorWheel({
  value,
  onChange,
  size = 300,
  markers = [],
  customMode = false,
  onMarkerAdd,
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseWheelRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Draw the static base color wheel once (cached in off-screen canvas)
  useEffect(() => {
    // Create off-screen canvas for base wheel
    if (!baseWheelRef.current) {
      baseWheelRef.current = document.createElement('canvas');
      baseWheelRef.current.width = size;
      baseWheelRef.current.height = size;
    }

    const baseCanvas = baseWheelRef.current;
    const ctx = baseCanvas.getContext("2d");
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear and draw base wheel
    ctx.clearRect(0, 0, size, size);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 90) * (Math.PI / 180);
      const endAngle = (angle + 1 - 90) * (Math.PI / 180);

      // Draw saturated outer ring
      for (let r = radius * 0.3; r <= radius; r += 1) {
        const saturation = ((r - radius * 0.3) / (radius * 0.7)) * 100;
        const lightness = 50;
        const color = hslToHex(angle, saturation, lightness);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.stroke();
      }
    }

    // Draw center white circle
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius * 0.3
    );
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fill();
  }, [size]); // Only redraw base wheel when size changes

  // Draw markers on top (fast, runs on every value/markers change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseWheelRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas and copy base wheel
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(baseWheelRef.current, 0, 0);

    // Draw current color marker
    const hsl = hexToHSL(value);
    const angle = (hsl.h - 90) * (Math.PI / 180);
    const distance = (hsl.s / 100) * (radius * 0.7) + radius * 0.3;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    // Draw outer circle
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw inner circle with color
    ctx.fillStyle = value;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw additional markers
    markers.forEach((marker) => {
      const markerHsl = hexToHSL(marker.color);
      const markerAngle = (markerHsl.h - 90) * (Math.PI / 180);
      const markerDistance =
        (markerHsl.s / 100) * (radius * 0.7) + radius * 0.3;
      const markerX = centerX + Math.cos(markerAngle) * markerDistance;
      const markerY = centerY + Math.sin(markerAngle) * markerDistance;

      // Draw marker
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(markerX, markerY, 6, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = marker.color;
      ctx.beginPath();
      ctx.arc(markerX, markerY, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [value, markers, size]);

  const handleColorPick = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 10;

      // Calculate angle and distance from center
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      // Only respond if within the wheel
      if (distance < radius * 0.3 || distance > radius) return;

      // Calculate HSL values
      const hue = (angle + 360) % 360;
      const saturation = ((distance - radius * 0.3) / (radius * 0.7)) * 100;
      const lightness = 50;

      const newColor = hslToHex(hue, saturation, lightness);
      onChange(newColor);
    },
    [onChange, size]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (customMode && onMarkerAdd) {
      // In custom mode with Shift key, add marker instead of dragging
      if (e.shiftKey) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 10;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only add marker if within valid wheel area
        if (distance >= radius * 0.3 && distance <= radius) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          const hue = (angle + 360) % 360;
          const saturation = ((distance - radius * 0.3) / (radius * 0.7)) * 100;
          const lightness = 50;
          const newColor = hslToHex(hue, saturation, lightness);
          onMarkerAdd(newColor);
        }
        return;
      }
    }
    
    setIsDragging(true);
    handleColorPick(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleColorPick(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const touch = e.touches[0];
    handleColorPick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleColorPick(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? "grabbing" : "crosshair",
          touchAction: "none",
        }}
      />
    </Box>
  );
}
