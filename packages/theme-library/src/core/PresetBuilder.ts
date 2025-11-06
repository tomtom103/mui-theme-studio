// Main preset builder class
import { ThemeOptions, Theme, Components } from '@mui/material/styles';
import { MUI_COMPONENT_CATEGORIES, ComponentCategory } from '../presets/componentCategories';
import { PresetRule, StyleGenerator } from '../types';

export class PresetBuilder {
  private rules: PresetRule[] = [];
  private baseTheme: Partial<ThemeOptions> = {};
  private metadata: { name?: string; description?: string } = {};

  constructor(baseTheme?: Partial<ThemeOptions>) {
    if (baseTheme) {
      this.baseTheme = baseTheme;
    }
  }

  // Set metadata
  setMetadata(name: string, description?: string) {
    this.metadata = { name, description };
    return this;
  }

  // Apply to specific categories
  applyToCategories(
    categories: ComponentCategory[],
    styleGenerator: StyleGenerator,
    options?: any,
    specificOverrides?: Record<string, any>
  ) {
    this.rules.push({
      categories,
      styleGenerator,
      options,
      specificOverrides,
    });
    return this;
  }

  // Convenience methods
  applySurfaceStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['surfaces'], styleGenerator, options);
  }

  applyActionStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['actions'], styleGenerator, options);
  }

  applyInputStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['inputs'], styleGenerator, options);
  }

  applySelectionStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['selections'], styleGenerator, options);
  }

  applySliderStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['sliders'], styleGenerator, options);
  }

  applyDataDisplayStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['dataDisplay'], styleGenerator, options);
  }

  applyFeedbackStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['feedback'], styleGenerator, options);
  }

  applyNavigationStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(['navigation'], styleGenerator, options);
  }

  // Apply to all components
  applyGlobalStyle(styleGenerator: StyleGenerator, options?: any) {
    return this.applyToCategories(
      ['surfaces', 'actions', 'inputs', 'selections', 'sliders', 'dataDisplay', 'feedback', 'navigation'],
      styleGenerator,
      options
    );
  }

  // Apply to specific component
  applyToComponent(componentName: string, styles: Record<string, any> | ((theme: Theme) => Record<string, any>)) {
    // Find which category this component belongs to
    for (const [category, components] of Object.entries(MUI_COMPONENT_CATEGORIES)) {
      if ((components as readonly string[]).includes(componentName)) {
        this.rules.push({
          categories: [category as ComponentCategory],
          styleGenerator: () => ({}),
          specificOverrides: {
            [componentName]: styles,
          },
        });
        break;
      }
    }
    return this;
  }

  // Build the theme options
  build(theme: Theme): Partial<ThemeOptions> {
    const components: any = {};

    // Process each rule
    this.rules.forEach((rule) => {
      const componentNames = rule.categories.flatMap(
        (cat) => MUI_COMPONENT_CATEGORIES[cat]
      );

      componentNames.forEach((componentName) => {
        if (!components[componentName]) {
          components[componentName] = { styleOverrides: {} };
        }

        // Generate styles
        const generatedStyles = rule.styleGenerator(theme, rule.options);

        // Process specific overrides - can be static object or function
        const specificOverride = rule.specificOverrides?.[componentName];
        const resolvedOverride = typeof specificOverride === 'function' 
          ? specificOverride(theme) 
          : specificOverride;

        // Merge with existing
        components[componentName].styleOverrides = {
          ...components[componentName].styleOverrides,
          root: {
            ...components[componentName].styleOverrides?.root,
            ...generatedStyles,
            // Apply specific overrides
            ...resolvedOverride,
          },
        };
      });
    });

    return {
      ...this.baseTheme,
      components,
    };
  }

  // Clone for composition
  clone() {
    const cloned = new PresetBuilder(this.baseTheme);
    cloned.rules = [...this.rules];
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  // Get metadata
  getMetadata() {
    return this.metadata;
  }
}
