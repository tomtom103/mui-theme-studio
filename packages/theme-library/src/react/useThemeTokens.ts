// Hook for managing theme tokens
import { useCustomTheme } from './ThemeProvider';
import { ColorTokens } from '../types';

export const useThemeTokens = () => {
  const { updateTokens, currentTheme } = useCustomTheme();

  const setColors = (colors: Partial<ColorTokens>) => {
    updateTokens(colors);
  };

  return {
    colors: {
      primary: currentTheme.palette.primary.main,
      secondary: currentTheme.palette.secondary.main,
    },
    setColors,
  };
};
