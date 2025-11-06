// MUI Component categorization
import type { ComponentCategory } from '../types/components';

// Re-export for convenience
export type { ComponentCategory };

export const MUI_COMPONENT_CATEGORIES = {
  // Layout & Containers
  surfaces: [
    'MuiCard',
    'MuiPaper',
    'MuiAccordion',
    'MuiDialog',
    'MuiDrawer',
    'MuiMenu',
    'MuiPopover',
    'MuiAppBar',
  ],
  
  // Interactive Actions (Buttons)
  actions: [
    'MuiButton',
    'MuiIconButton',
    'MuiFab',
    'MuiButtonGroup',
  ],
  
  // Form Inputs (Text, Select, etc.)
  inputs: [
    'MuiTextField',
    'MuiSelect',
    'MuiAutocomplete',
    'MuiFilledInput',
    'MuiOutlinedInput',
    'MuiInput',
    'MuiInputBase',
  ],
  
  // Selection Controls (Checkboxes, Radio, etc.)
  selections: [
    'MuiCheckbox',
    'MuiRadio',
    'MuiSwitch',
    'MuiRadioGroup',
    'MuiFormControlLabel',
  ],
  
  // Sliders & Range Controls
  sliders: [
    'MuiSlider',
    'MuiRating',
  ],
  
  // Data Display
  dataDisplay: [
    'MuiChip',
    'MuiAvatar',
    'MuiBadge',
    'MuiList',
    'MuiListItem',
    'MuiListItemButton',
    'MuiTable',
    'MuiTableCell',
    'MuiTableRow',
    'MuiTooltip',
    'MuiTypography',
  ],
  
  // Feedback & Status
  feedback: [
    'MuiAlert',
    'MuiSnackbar',
    'MuiCircularProgress',
    'MuiLinearProgress',
    'MuiSkeleton',
    'MuiBackdrop',
  ],
  
  // Navigation
  navigation: [
    'MuiTabs',
    'MuiTab',
    'MuiBottomNavigation',
    'MuiBreadcrumbs',
    'MuiPagination',
    'MuiStepper',
    'MuiStep',
    'MuiLink',
  ],
} as const;

// Helper to get all component names
export const getAllComponentNames = (): string[] => {
  return Object.values(MUI_COMPONENT_CATEGORIES).flat();
};

// Helper to get category for a component
export const getCategoryForComponent = (
  componentName: string
): ComponentCategory | null => {
  for (const [category, components] of Object.entries(MUI_COMPONENT_CATEGORIES)) {
    if ((components as readonly string[]).includes(componentName)) {
      return category as ComponentCategory;
    }
  }
  return null;
};
