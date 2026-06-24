"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";

export default function AdminHomepageCmsPage() {
  const { homePageSettings, updateHomePageSettings } = useApp();

  // Form states - Homepage CMS
  const [cmsBrand, setCmsBrand] = useState(homePageSettings.brandName);
  const [cmsLogo, setCmsLogo] = useState(homePageSettings.logoText);
  const [cmsHeroTitle, setCmsHeroTitle] = useState(homePageSettings.heroTitle);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(homePageSettings.heroSubtitle);
  const [cmsHeroCtaText, setCmsHeroCtaText] = useState(homePageSettings.heroCtaText);
  const [cmsHeroCtaLink, setCmsHeroCtaLink] = useState(homePageSettings.heroCtaLink);
  const [cmsFirstTitle, setCmsFirstTitle] = useState(homePageSettings.firstBannerTitle);
  const [cmsFirstSubtitle, setCmsFirstSubtitle] = useState(homePageSettings.firstBannerSubtitle);
  const [cmsFirstCtaText, setCmsFirstCtaText] = useState(homePageSettings.firstBannerCtaText);
  const [cmsPromoBadge, setCmsPromoBadge] = useState(homePageSettings.promoBadge);

  // CMS Settings submit
  const handleCmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomePageSettings({
      brandName: cmsBrand,
      logoText: cmsLogo,
      heroTitle: cmsHeroTitle,
      heroSubtitle: cmsHeroSubtitle,
      heroCtaText: cmsHeroCtaText,
      heroCtaLink: cmsHeroCtaLink,
      firstBannerTitle: cmsFirstTitle,
      firstBannerSubtitle: cmsFirstSubtitle,
      firstBannerCtaText: cmsFirstCtaText,
      promoBadge: cmsPromoBadge
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border-color pb-4">
        <span className="text-xs font-bold text-soft-text uppercase font-semibold">Storefront layout CMS Control</span>
      </div>

      <form onSubmit={handleCmsSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Banner contents */}
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Hero Section Configurations</h3>

          <div>
            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Promo badge label</label>
            <input
              type="text"
              value={cmsPromoBadge}
              onChange={(e) => setCmsPromoBadge(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero main title</label>
            <input
              type="text"
              value={cmsHeroTitle}
              onChange={(e) => setCmsHeroTitle(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero subtitle description</label>
            <textarea
              value={cmsHeroSubtitle}
              onChange={(e) => setCmsHeroSubtitle(e.target.value)}
              className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero CTA Button Label</label>
              <input
                type="text"
                value={cmsHeroCtaText}
                onChange={(e) => setCmsHeroCtaText(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero CTA Button Link</label>
              <input
                type="text"
                value={cmsHeroCtaLink}
                onChange={(e) => setCmsHeroCtaLink(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Science banner CMS */}
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Science Banner Configurations</h3>

          <div>
            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Science Section Title</label>
            <input
              type="text"
              value={cmsFirstTitle}
              onChange={(e) => setCmsFirstTitle(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Science Section Subtitle</label>
            <textarea
              value={cmsFirstSubtitle}
              onChange={(e) => setCmsFirstSubtitle(e.target.value)}
              className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Science Section CTA Label</label>
            <input
              type="text"
              value={cmsFirstCtaText}
              onChange={(e) => setCmsFirstCtaText(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
            />
          </div>

          {/* Logo CMS */}
          <div className="grid grid-cols-2 gap-3 border-t border-border-color/30 pt-4 mt-2">
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Brand logo header text</label>
              <input
                type="text"
                value={cmsLogo}
                onChange={(e) => setCmsLogo(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Brand Name reference</label>
              <input
                type="text"
                value={cmsBrand}
                onChange={(e) => setCmsBrand(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-auto"
          >
            SYNC STOREFRONT BANNERS
            <Icon name="check" size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
