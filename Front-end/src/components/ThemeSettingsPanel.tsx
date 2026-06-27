"use client";

import React, { useState, useEffect } from "react";
import { useTheme, PRESET_THEMES } from "@/context/ThemeContext";
import { Icon } from "@/components/SvgIcons";
import { useApp } from "@/context/AppContext";

export const ThemeSettingsPanel = () => {
  const { theme, setMode, setPrimaryColor, setAccentColor, applyPreset, resetToDefault, isPanelOpen, setIsPanelOpen } = useTheme();
  const { locale, changeLanguage } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Button - Tab sticking out from the far-right edge */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9998] flex h-12 w-10 items-center justify-center rounded-l-xl bg-[#130d0b]/95 border-y border-l border-primary-coral/50 backdrop-blur-md shadow-[-5px_0_20px_rgba(255,138,117,0.15)] transition-all duration-300 hover:w-12 hover:border-primary-coral hover:shadow-[-5px_0_25px_rgba(255,138,117,0.35)] group cursor-pointer"
        aria-label="Theme Settings"
      >
        <div className="text-primary-coral transition-transform duration-500 group-hover:rotate-90">
          <Icon name="settings" size={20} />
        </div>
      </button>

      {/* Backdrop */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 z-[9999] h-full w-[320px] transform border-l border-border-color bg-surface-deep/95 backdrop-blur-xl transition-transform duration-500 ease-out flex flex-col ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-border-color px-6 py-5 ${
          locale === "ar" ? "flex-row-reverse" : ""
        }`}>
          <h2 className="text-sm font-black uppercase tracking-widest text-white">
            {locale === "ar" ? "إعدادات المظهر" : "Theme Settings"}
          </h2>
          <button
            onClick={() => setIsPanelOpen(false)}
            className="text-muted-text hover:text-primary-coral transition-colors cursor-pointer"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Language Selector */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-soft-text">
              {locale === "ar" ? "اللغة / Language" : "Language / اللغة"}
            </span>
            <div className="flex rounded-xl border border-border-color bg-card-bg p-1">
              <button
                onClick={() => changeLanguage("en")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  locale === "en"
                    ? "bg-surface-deep text-primary-coral shadow-sm"
                    : "text-muted-text hover:text-white"
                }`}
              >
                <span>🇺🇸</span> EN
              </button>
              <button
                onClick={() => changeLanguage("ar")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  locale === "ar"
                    ? "bg-surface-deep text-primary-coral shadow-sm"
                    : "text-muted-text hover:text-white"
                }`}
              >
                <span>🇪🇬</span> AR
              </button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-soft-text">
              {locale === "ar" ? "وضع العرض" : "Display Mode"}
            </span>
            <div className="flex rounded-xl border border-border-color bg-card-bg p-1">
              <button
                onClick={() => setMode("dark")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  theme.mode === "dark"
                    ? "bg-surface-deep text-primary-coral shadow-sm"
                    : "text-muted-text hover:text-white"
                }`}
              >
                {locale === "ar" ? "داكن" : "Dark"}
              </button>
              <button
                onClick={() => setMode("light")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  theme.mode === "light"
                    ? "bg-surface-deep text-primary-coral shadow-sm"
                    : "text-muted-text hover:text-white"
                }`}
              >
                {locale === "ar" ? "فاتح" : "Light"}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-soft-text">
              {locale === "ar" ? "قوالب الألوان" : "Color Presets"}
            </span>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_THEMES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  title={preset.name}
                  className="group relative flex aspect-square items-center justify-center rounded-xl border border-border-color bg-card-bg transition-all hover:scale-105 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(to bottom right, ${preset.primaryColor}, ${preset.accentColor})`, opacity: 0.2 }} />
                  <div
                    className="h-6 w-6 rounded-full shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.accentColor})` }}
                  />
                  {theme.primaryColor.toUpperCase() === preset.primaryColor.toUpperCase() && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white backdrop-blur-[2px]">
                      <Icon name="check" size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-soft-text">
              {locale === "ar" ? "تخصيص الألوان" : "Custom Palette"}
            </span>
            
            <div className={`flex items-center justify-between rounded-xl border border-border-color bg-card-bg p-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
              <span className="text-xs font-bold text-white">
                {locale === "ar" ? "الأساسي" : "Primary"}
              </span>
              <div className={`flex items-center gap-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                <span className="text-xs font-mono text-muted-text">{theme.primaryColor.toUpperCase()}</span>
                <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-border-color cursor-pointer">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute -top-2 -left-2 h-12 w-12 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-between rounded-xl border border-border-color bg-card-bg p-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
              <span className="text-xs font-bold text-white">
                {locale === "ar" ? "الثانوي" : "Accent"}
              </span>
              <div className={`flex items-center gap-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                <span className="text-xs font-mono text-muted-text">{theme.accentColor.toUpperCase()}</span>
                <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-border-color cursor-pointer">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="absolute -top-2 -left-2 h-12 w-12 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-border-color p-6 space-y-4">
          <p className="text-center text-[10px] text-muted-text">
            {locale === "ar" ? "يتم تطبيق التغييرات فوراً" : "Changes apply instantly"}
          </p>
          <button
            onClick={resetToDefault}
            className="w-full rounded-xl border border-border-color bg-surface-sec py-3 text-xs font-bold uppercase tracking-widest text-soft-text transition-all hover:border-primary-coral hover:text-white cursor-pointer"
          >
            {locale === "ar" ? "إعادة الضبط الافتراضي" : "Reset to Default"}
          </button>
        </div>

      </div>
    </>
  );
};
