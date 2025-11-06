// Theme switcher component
import React from 'react';
import { 
  Box, 
  Button, 
  ButtonGroup, 
  Paper, 
  Typography, 
  Stack 
} from '@mui/material';
import { useCustomTheme } from './ThemeProvider';
import { PresetBuilder } from '../core/PresetBuilder';

export interface PresetOption {
  name: string;
  label: string;
  preset: PresetBuilder;
}

export interface ThemeSwitcherProps {
  presets: PresetOption[];
  variant?: 'buttons' | 'grid';
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

/**
 * ThemeSwitcher - A UI component for switching between custom presets
 * 
 * @example
 * ```tsx
 * const presets = [
 *   { name: 'minimal', label: 'Minimal', preset: createMinimalPreset() },
 *   { name: 'dark', label: 'Dark Mode', preset: createDarkPreset() },
 * ];
 * 
 * <ThemeSwitcher presets={presets} />
 * ```
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  presets,
  variant = 'buttons',
  orientation = 'horizontal',
  showLabels = true,
}) => {
  const { applyCustomPreset, resetTheme } = useCustomTheme();

  if (variant === 'buttons') {
    return (
      <ButtonGroup orientation={orientation} variant="outlined">
        {presets.map((option) => (
          <Button
            key={option.name}
            onClick={() => applyCustomPreset(option.preset)}
          >
            {showLabels ? option.label : option.label[0].toUpperCase()}
          </Button>
        ))}
        <Button onClick={resetTheme} color="secondary">
          Reset
        </Button>
      </ButtonGroup>
    );
  }

  if (variant === 'grid') {
    return (
      <Stack spacing={2}>
        <Typography variant="h6">Choose Theme</Typography>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          {presets.map((option) => (
            <Paper
              key={option.name}
              onClick={() => applyCustomPreset(option.preset)}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Typography variant="subtitle1">
                {option.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Stack>
    );
  }

  return null;
};
