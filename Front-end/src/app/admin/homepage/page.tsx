"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { HomePageSettings } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";

const inputClass =
  "w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/40 focus:outline-none focus:border-primary-coral/60 focus:ring-1 focus:ring-primary-coral/20 transition-all";

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  dir = "ltr",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          dir={dir}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className={inputClass}
        />
      )}
    </div>
  );
}

export default function AdminHomepageCmsPage() {
  const { homePageSettings, updateHomePageSettings } = useApp();

  const [form, setForm] = useState<HomePageSettings>(homePageSettings);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof HomePageSettings>(key: K, value: HomePageSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomePageSettings(form);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Suffix is "" for English fields, "_ar" for Arabic ones.
  const suffix = lang === "ar" ? "_ar" : "";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Storefront CMS</h1>
          <p className="text-xs text-muted-text mt-1">Edit the homepage hero and banner copy.</p>
        </div>

        <div className="inline-flex rounded-full border border-border-color bg-surface-deep p-0.5 self-start">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-4 py-1.5 rounded-full text-3xs font-extrabold uppercase tracking-wider transition-all ${
                lang === l ? "bg-primary-coral text-main-bg" : "text-muted-text hover:text-white"
              }`}
            >
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col gap-5">
        <h2 className="text-3xs font-extrabold uppercase tracking-widest text-primary-coral">Hero Section</h2>

        <Field
          label="Promo Badge"
          value={(form[`promoBadge${suffix}` as keyof HomePageSettings] as string) ?? ""}
          onChange={(v) => set(`promoBadge${suffix}` as keyof HomePageSettings, v as never)}
          placeholder={lang === "ar" ? "مثال: وصل حديثًا" : "e.g. New Arrivals"}
          dir={dir}
        />
        <Field
          label="Title"
          value={(form[`heroTitle${suffix}` as keyof HomePageSettings] as string) ?? ""}
          onChange={(v) => set(`heroTitle${suffix}` as keyof HomePageSettings, v as never)}
          placeholder={lang === "ar" ? "العنوان الرئيسي" : "Main headline"}
          dir={dir}
        />
        <Field
          label="Subtitle"
          value={(form[`heroSubtitle${suffix}` as keyof HomePageSettings] as string) ?? ""}
          onChange={(v) => set(`heroSubtitle${suffix}` as keyof HomePageSettings, v as never)}
          placeholder={lang === "ar" ? "نص وصفي مساند" : "Supporting description"}
          dir={dir}
          multiline
        />
        <Field
          label="Button Label"
          value={(form[`heroCtaText${suffix}` as keyof HomePageSettings] as string) ?? ""}
          onChange={(v) => set(`heroCtaText${suffix}` as keyof HomePageSettings, v as never)}
          placeholder={lang === "ar" ? "تسوق الآن" : "Shop Now"}
          dir={dir}
        />
        {lang === "en" && (
          <Field
            label="Button Link"
            value={form.heroCtaLink}
            onChange={(v) => set("heroCtaLink", v)}
            placeholder="/shop"
          />
        )}
      </section>

      <div className="border-t border-border-color" />

      {/* Science Banner */}
      <section className="flex flex-col gap-5">
        <h2 className="text-3xs font-extrabold uppercase tracking-widest text-primary-coral">Science Banner</h2>

        <Field
          label="Title"
          value={(form[`firstBannerTitle${suffix}` as keyof HomePageSettings] as string) ?? ""}
          onChange={(v) => set(`firstBannerTitle${suffix}` as keyof HomePageSettings, v as never)}
          placeholder={lang === "ar" ? "عنوان قسم العلم" : "Section headline"}
          dir={dir}
        />
        <Field
          label="Subtitle"
          value={(form[`firstBannerSubtitle${suffix}` as keyof HomePageSettings] as string) ?? ""}
          onChange={(v) => set(`firstBannerSubtitle${suffix}` as keyof HomePageSettings, v as never)}
          placeholder={lang === "ar" ? "نص مساند" : "Supporting text"}
          dir={dir}
          multiline
        />
        <Field
          label="Button Label"
          value={(form[`firstBannerCtaText${suffix}` as keyof HomePageSettings] as string) ?? ""}
          onChange={(v) => set(`firstBannerCtaText${suffix}` as keyof HomePageSettings, v as never)}
          placeholder={lang === "ar" ? "اعرف أكتر" : "Learn More"}
          dir={dir}
        />
      </section>

      {lang === "en" && (
        <>
          <div className="border-t border-border-color" />

          {/* Brand Identity (no AR variant needed) */}
          <section className="flex flex-col gap-5">
            <h2 className="text-3xs font-extrabold uppercase tracking-widest text-primary-coral">Brand Identity</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Logo Text" value={form.logoText} onChange={(v) => set("logoText", v)} placeholder="VALENS" />
              <Field label="Brand Name" value={form.brandName} onChange={(v) => set("brandName", v)} placeholder="Brand name" />
            </div>
          </section>
        </>
      )}

      {/* Save bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={!dirty}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-coral px-7 py-3 text-xs font-black tracking-widest text-main-bg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <Icon name="check" size={14} />
          PUBLISH CHANGES
        </button>
        {saved && <span className="text-xs font-bold text-green-400">Saved.</span>}
        {!saved && dirty && <span className="text-xs text-muted-text">You have unsaved changes.</span>}
      </div>
    </form>
  );
}