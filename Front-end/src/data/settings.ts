import type { HomePageSettings, StoreSettings } from "@/types/store";

export const defaultHomePageSettings: HomePageSettings = {
  brandName: "VALENS",
  logoText: "VALENS",
  heroTitle: "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
  heroSubtitle:
    "Engineered for elite athletes. Premium supplements formulated with clinical dosages, clean ingredients, and zero compromises.",
  heroCtaText: "SHOP THE NUTRITION",
  heroCtaLink: "/products",
  firstBannerTitle: "THE VALENS FORMULA",
  firstBannerSubtitle:
    "Cold-filtered processing, zero artificial coloring, complete transparency. We don't hide behind proprietary blends. What you see is exactly what powers you.",
  firstBannerCtaText: "DISCOVER THE SCIENCE",
  promoBadge: "ELITE PERFORMANCE LINE",
};

export const defaultStoreSettings: StoreSettings = {
  brandName: "VALENS",
  logoText: "VALENS",
  contactEmail: "elite@valens.com",
  contactPhone: "+1 (800) 825-3677",
  address: "88 Science & Athletics Drive, Sector 4, CA 90210",
  shippingCost: 60,
  taxRate: 5,
  socialInstagram: "@valens_nutrition",
  socialTwitter: "@valens_performance",
  socialFacebook: "valens.elite",
};
