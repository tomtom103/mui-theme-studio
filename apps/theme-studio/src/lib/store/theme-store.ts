// lib/store/theme-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BrandConfig } from "../theme/types";
import { getDefaultBrand } from "../theme/defaults";

interface ThemeStore {
  brands: BrandConfig[];
  activeBrandId: string | null;
  colorMode: "light" | "dark" | "system";

  // Actions
  addBrand: (brand: BrandConfig) => void;
  updateBrand: (id: string, updates: Partial<BrandConfig>) => void;
  deleteBrand: (id: string) => void;
  setActiveBrand: (id: string) => void;
  duplicateBrand: (id: string) => void;
  setColorMode: (mode: "light" | "dark" | "system") => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      brands: [getDefaultBrand()],
      activeBrandId: "default-brand",
      colorMode: "light",

      addBrand: (brand) =>
        set((state) => ({
          brands: [...state.brands, brand],
          activeBrandId: brand.id,
        })),

      updateBrand: (id, updates) =>
        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === id
              ? {
                  ...b,
                  ...updates,
                  metadata: {
                    ...b.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              : b,
          ),
        })),

      deleteBrand: (id) =>
        set((state) => {
          const newBrands = state.brands.filter((b) => b.id !== id);
          return {
            brands: newBrands,
            activeBrandId:
              state.activeBrandId === id
                ? newBrands[0]?.id || null
                : state.activeBrandId,
          };
        }),

      setActiveBrand: (id) => set({ activeBrandId: id }),

      duplicateBrand: (id) => {
        const state = get();
        const brand = state.brands.find((b) => b.id === id);
        if (!brand) return;

        const newBrand: BrandConfig = {
          ...brand,
          id: `${brand.id}-copy-${Date.now()}`,
          name: `${brand.name} (Copy)`,
          metadata: {
            ...brand.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        state.addBrand(newBrand);
      },

      setColorMode: (mode) => set({ colorMode: mode }),
    }),
    {
      name: "theme-studio-storage",
    },
  ),
);

// Selectors for optimized subscriptions
export const selectActiveBrand = (state: ThemeStore) =>
  state.brands.find((b) => b.id === state.activeBrandId) || null;

export const selectBrandById = (id: string) => (state: ThemeStore) =>
  state.brands.find((b) => b.id === id) || null;
