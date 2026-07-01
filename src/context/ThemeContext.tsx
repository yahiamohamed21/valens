"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

export type ThemeMode = "dark" | "light";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

export interface ThemePreset {
  name: string;
  primaryColor: string;
  accentColor: string;
}

export const PRESET_THEMES: ThemePreset[] = [
  { name: "Coral (Default)", primaryColor: "#FF8A75", accentColor: "#FF5226" },
  { name: "Electric Blue", primaryColor: "#60A5FA", accentColor: "#3B82F6" },
  { name: "Emerald", primaryColor: "#34D399", accentColor: "#10B981" },
  { name: "Violet", primaryColor: "#A78BFA", accentColor: "#8B5CF6" },
  { name: "Rose", primaryColor: "#FB7185", accentColor: "#E11D48" },
  { name: "Amber", primaryColor: "#FBBF24", accentColor: "#F59E0B" },
  { name: "Cyan", primaryColor: "#22D3EE", accentColor: "#06B6D4" },
  { name: "Lime", primaryColor: "#A3E635", accentColor: "#84CC16" },
];

const DEFAULT_THEME: ThemeConfig = {
  mode: "dark",
  primaryColor: "#FF8A75",
  accentColor: "#FF5226",
};

interface ThemeContextType {
  theme: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (hex: string) => void;
  setAccentColor: (hex: string) => void;
  applyPreset: (preset: ThemePreset) => void;
  resetToDefault: () => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Utility to convert hex to rgb string "r g b"
const hexToRgbStr = (hex: string) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(x => x + x).join("");
  }
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
};

// Darken a hex color by a percentage (0-100)
const darkenHex = (hex: string, percent: number) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(x => x + x).join("");
  }
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));

  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) {
      try {
        setThemeState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse theme", e);
      }
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(newTheme));
  };

  useEffect(() => {
    if (!mounted) return;
    
    // Apply dataset attribute for mode
    document.documentElement.setAttribute("data-theme", theme.mode);
    if (theme.mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Inject CSS variables
    if (theme.mode === "light") {
      // Darken colors dynamically in light mode to keep layouts legible and high-contrast
      document.documentElement.style.setProperty("--rt-primary", hexToRgbStr(darkenHex(theme.primaryColor, 25)));
      document.documentElement.style.setProperty("--rt-accent", hexToRgbStr(darkenHex(theme.accentColor, 20)));
    } else {
      document.documentElement.style.setProperty("--rt-primary", hexToRgbStr(theme.primaryColor));
      document.documentElement.style.setProperty("--rt-accent", hexToRgbStr(theme.accentColor));
    }
    
  }, [theme, mounted]);

  const setMode = (mode: ThemeMode) => setTheme({ ...theme, mode });
  const setPrimaryColor = (hex: string) => setTheme({ ...theme, primaryColor: hex });
  const setAccentColor = (hex: string) => setTheme({ ...theme, accentColor: hex });
  
  const applyPreset = (preset: ThemePreset) => {
    setTheme({
      ...theme,
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
    });
  };

  const resetToDefault = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider value={{ theme, setMode, setPrimaryColor, setAccentColor, applyPreset, resetToDefault, isPanelOpen, setIsPanelOpen }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
