"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useApp, HomeBanner, CarouselItem } from "@/context/AppContext";
import { ProductCard, ProductImage } from "@/components/ProductCard";
import { Icon } from "@/components/SvgIcons";
import { ValensBrandCarousel } from "@/components/ValensBrandCarousel";
import dynamic from "next/dynamic";

const fallbackCarouselData: CarouselItem[] = [
  {
    id: "performance-lab",
    title: "Performance Lab",
    imageUrl: "https://picsum.photos/id/1048/1200/900",
    imageAlt: "Athlete training in a modern performance lab",
    description: "Clinical-grade formulas built for measurable strength, endurance, and recovery.",
    title_ar: "مختبر الأداء",
    description_ar: "تركيبات ذات درجة سريرية مصممة للقوة وقوة التحمل والاستشفاء القابلة للقياس.",
  },
  {
    id: "daily-recovery",
    title: "Daily Recovery",
    imageUrl: "https://picsum.photos/id/1060/1200/900",
    imageAlt: "Clean recovery setup with water and wellness essentials",
    description: "Support the reset phase with transparent ingredients and consistent routines.",
    title_ar: "الاستشفاء اليومي",
    description_ar: "ادعم مرحلة إعادة الضبط بمكونات شفافة وروتين متسق.",
  },
  {
    id: "clean-energy",
    title: "Clean Energy",
    imageUrl: "https://picsum.photos/id/1076/1200/900",
    imageAlt: "Runner moving through a sunlit urban training route",
    description: "Focused, smooth output without relying on hidden proprietary blends.",
    title_ar: "الطاقة النظيفة",
    description_ar: "طاقة مركزة وسلسة دون الاعتماد على خلطات احتكارية مخفية.",
  },
  {
    id: "strength-stack",
    title: "Strength Stack",
    imageUrl: "https://picsum.photos/id/1084/1200/900",
    imageAlt: "Strength training equipment arranged in a premium gym",
    description: "Temporary product imagery while the final backend media API is prepared.",
    title_ar: "بناء القوة",
    description_ar: "صور منتجات مؤقتة لحين إعداد واجهة برمجة تطبيقات الوسائط الخلفية النهائية.",
  },
  {
    id: "sleep-reset",
    title: "Sleep Reset",
    imageUrl: "https://picsum.photos/id/1025/1200/900",
    imageAlt: "Calm evening recovery environment with soft natural light",
    description: "A calmer end-of-day ritual designed around better readiness tomorrow.",
    title_ar: "ضبط النوم",
    description_ar: "طقوس نهاية اليوم الأكثر هدوءاً والمصممة للاستعداد بشكل أفضل للغد.",
  },
];

const Carousel = dynamic(() => import("@/components/Carousel/Carousel").then(mod => mod.Carousel), {
  loading: () => <div className="h-64 animate-pulse bg-surface-deep/30 rounded-3xl" />,
  ssr: false,
});

// Swiper imports for banner carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HomePage() {
  const {
    products,
    categories,
    homePageSettings,
    homeBanners,
    homeStories,
    homeFeaturedProducts,
    homeBestSellers,
    locale
  } = useApp();

  // Active Banners selection
  const activeBanners = useMemo(() => {
    return homeBanners
      .filter((b) => b.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [homeBanners]);

  // Featured Products curation lookup
  const featuredProducts = useMemo(() => {
    const activeCurated = homeFeaturedProducts
      .filter((cp) => cp.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    if (activeCurated.length > 0) {
      return activeCurated
        .map((cp) => products.find((p) => p.id === cp.productId))
        .filter((p): p is typeof products[0] => !!p && p.visible);
    }
    return products.filter((p) => p.featured && p.visible).slice(0, 4);
  }, [products, homeFeaturedProducts]);

  // Bestsellers curation lookup
  const bestSellers = useMemo(() => {
    const activeCurated = homeBestSellers
      .filter((cp) => cp.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    if (activeCurated.length > 0) {
      return activeCurated
        .map((cp) => products.find((p) => p.id === cp.productId))
        .filter((p): p is typeof products[0] => !!p && p.visible);
    }
    return products.filter((p) => p.bestSeller && p.visible).slice(0, 4);
  }, [products, homeBestSellers]);

  // Stories curation lookup
  const activeStories = useMemo(() => {
    const activeList = homeStories
      .filter((s) => s.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    if (activeList.length > 0) {
      return activeList.map((s) => ({
        id: s.id,
        title: s.title,
        imageUrl: s.image,
        imageAlt: s.title,
        description: s.description,
        link: s.link,
      }));
    }
    if (homeStories.length === 0) {
      return fallbackCarouselData;
    }
    return [];
  }, [homeStories]);

  // Helper to render banner inner layout
  const renderBannerContent = (banner: HomeBanner) => {
    const isArabic = locale === "ar";

    // Check if the banner is a text-based mockup or a custom uploaded background image
    const isTextBased =
      banner.id === "default" ||
      banner.id.startsWith("default-banner") ||
      banner.image === "powder" ||
      banner.image === "capsule" ||
      banner.image === "liquid" ||
      !banner.image.includes("/") && !banner.image.includes(".");

    if (isTextBased) {
      const productType = (banner.image === "capsule" || banner.image === "liquid") ? banner.image : "powder";

      // Select premium colors based on the banner type to match the identity
      const primaryColor = banner.id.includes("2") || banner.title.toLowerCase().includes("creatine") ? "#D8C9C3" : "#FF8A75";
      const accentColor = banner.id.includes("2") || banner.title.toLowerCase().includes("creatine") ? "#8D7B73" : "#FF5226";

      return (
        <div
          className="w-full min-h-[480px] lg:min-h-[520px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-border-color/60 bg-gradient-to-br from-[#140b09]/95 via-[#1a110e]/60 to-[#111111]/95 backdrop-blur-xl p-8 md:p-12 lg:p-16 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)] relative group transition-all duration-500 hover:border-primary-coral/40"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* Ambient Inner Spotlight Glows */}
          <div className="absolute top-[-10%] right-[-10%] -z-10 w-[350px] h-[350px] rounded-full bg-primary-coral/10 blur-[100px] opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
          <div className="absolute bottom-[-10%] left-[-5%] -z-10 w-[300px] h-[300px] rounded-full bg-accent-orange/5 blur-[80px] opacity-50 group-hover:opacity-85 transition-all duration-700" />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 w-full h-full relative z-10">
            {/* Text Column */}
            <div className={`flex flex-col lg:col-span-7 ${isArabic ? "items-start text-right" : "items-start text-left"}`}>
              {/* Promo Badge */}
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-coral/30 bg-primary-coral/5 px-4 py-1.5 text-xs font-bold tracking-widest text-primary-coral uppercase">
                <span className="h-2 w-2 rounded-full bg-accent-orange animate-pulse" />
                {homePageSettings.promoBadge || (isArabic ? "مختبرات فالنز" : "VALENS LABS")}
              </span>

              {/* Title */}
              <h1 className="text-3.5xl font-black tracking-tight text-white sm:text-5xl lg:text-6.5xl uppercase leading-[1.08] font-sans">
                {banner.title.split(" ").map((word, idx) => {
                  // Colorize the last word to make it stand out
                  const isLast = idx === banner.title.split(" ").length - 1;
                  return (
                    <span
                      key={idx}
                      className={isLast ? "text-transparent bg-clip-text bg-gradient-to-r from-primary-coral via-accent-orange to-white block sm:inline" : "text-white"}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-muted-text font-medium max-w-xl">
                {banner.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
                <Link
                  href={banner.ctaLink}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary-coral px-8 py-4 text-xs font-black tracking-widest text-[#111111] transition-all duration-300 hover:bg-white hover:scale-[1.03] shadow-[0_6px_24px_rgba(255,138,117,0.3)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.4)]"
                >
                  {banner.ctaText}
                  <Icon name={isArabic ? "arrow-left" : "arrow-right"} size={16} />
                </Link>
                <Link
                  href="#science"
                  className="flex items-center justify-center gap-2 rounded-full border border-border-color/80 bg-surface-deep/40 px-8 py-4 text-xs font-black tracking-widest text-white transition-all duration-300 hover:border-primary-coral hover:bg-primary-coral/5 hover:scale-[1.03]"
                >
                  {isArabic ? "العلم والتطوير" : "THE SCIENCE"}
                </Link>
              </div>

              {/* Quick stats badges */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border-color/60 pt-8 w-full">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white bg-clip-text bg-gradient-to-b from-white to-[#8d7b73]">100%</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-text mt-1.5">
                    {isArabic ? "نقاوة معتمدة معملياً" : "Lab Certified Purity"}
                  </p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white bg-clip-text bg-gradient-to-b from-white to-[#8d7b73]">0g</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-text mt-1.5">
                    {isArabic ? "خلطات غير معلنة" : "Proprietary Blends"}
                  </p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-primary-coral">CLINICAL</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-text mt-1.5">
                    {isArabic ? "جرعات فعالة علمياً" : "Ingredient Dosages"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Product Display (stacked 3D bottles mockup) */}
            <div className="relative flex items-center justify-center lg:col-span-5 h-[320px] sm:h-[380px] lg:h-[480px]">
              {/* Ambient Spotlight Glows */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-primary-coral/10 blur-[80px]" />
                <div className="h-48 w-48 rounded-full bg-accent-orange/10 blur-[60px]" />
              </div>

              {/* Left Side Bottle Mockup */}
              <div className="absolute left-[8%] bottom-[12%] w-[150px] sm:w-[190px] lg:w-[210px] transition-all duration-500 hover:scale-105 hover:z-20 transform -rotate-12 filter brightness-[0.6] hover:brightness-[0.9]">
                <ProductImage color="#D8C9C3" type={productType} glow={false} className="h-56 sm:h-64 w-full" />
              </div>

              {/* Right Side Bottle Mockup */}
              <div className="absolute right-[8%] bottom-[12%] w-[150px] sm:w-[190px] lg:w-[210px] transition-all duration-500 hover:scale-105 hover:z-20 transform rotate-12 filter brightness-[0.6] hover:brightness-[0.9]">
                <ProductImage color="#FF5226" type={productType} glow={false} className="h-56 sm:h-64 w-full" />
              </div>

              {/* Center Active Preset Bottle */}
              <div className="absolute bottom-[5%] w-[180px] sm:w-[220px] lg:w-[250px] z-10 transition-all duration-500 hover:scale-110 transform hover:rotate-1 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
                <ProductImage color={primaryColor} type={productType} glow={true} className="h-68 sm:h-76 lg:h-80 w-full" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. Custom uploaded image banner: render as full-bleed clickable image link with premium styling and overlays
    return (
      <Link href={banner.ctaLink} className="block w-full relative group">
        {/* Desktop full banner (hidden on mobile, shown on SM up) */}
        <div className="hidden sm:block w-full h-[400px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden border border-border-color/60 bg-surface-deep shadow-xl hover:shadow-2xl hover:border-primary-coral/45 transition-all duration-500 relative">
          <img
            src={banner.image}
            alt={banner.altText || "Hero Banner"}
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />
          {/* Subtle overlay vignette to blend white banners with the dark theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

          {/* Banner content overlay on desktop */}
          {banner.title && (
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center items-start text-left p-12 max-w-xl" dir={isArabic ? "rtl" : "ltr"}>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase leading-tight drop-shadow-md">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="mt-4 text-sm md:text-base text-gray-200 font-medium drop-shadow-sm">
                  {banner.subtitle}
                </p>
              )}
              {banner.ctaText && (
                <span className="mt-8 flex items-center justify-center gap-2 rounded-full bg-primary-coral px-8 py-3 text-xs font-black tracking-widest text-[#111111] transition-all duration-300 group-hover:bg-white group-hover:scale-105 shadow-[0_4px_15px_rgba(255,138,117,0.3)]">
                  {banner.ctaText}
                  <Icon name={isArabic ? "arrow-left" : "arrow-right"} size={14} />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mobile full banner (shown on mobile, hidden on SM up) */}
        <div className="block sm:hidden w-full h-[350px] rounded-2xl overflow-hidden border border-border-color bg-surface-deep shadow-md relative">
          <img
            src={banner.mobileImage || banner.image}
            alt={banner.altText || "Hero Banner Mobile"}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none z-10" />

          {banner.title && (
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end items-start text-left p-6" dir={isArabic ? "rtl" : "ltr"}>
              <h2 className="text-xl font-extrabold text-white uppercase leading-tight">
                {banner.title}
              </h2>
              {banner.ctaText && (
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-coral px-4 py-2 text-3xs font-black tracking-widest text-[#111111]">
                  {banner.ctaText}
                  <Icon name={isArabic ? "arrow-left" : "arrow-right"} size={10} />
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="relative w-full overflow-hidden bg-main-bg">
      {/* Decorative background ambient lighting */}
      <div className="absolute top-[10%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary-coral/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-[40%] right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-accent-orange/5 blur-[150px]" />

      {/* 1. Hero Slider Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
        {activeBanners.length === 0 ? (
          /* Render current default fallback if empty */
          renderBannerContent({
            id: "default",
            title: homePageSettings.heroTitle || "YOUR PREMIUM ENERGY STACK",
            subtitle: homePageSettings.heroSubtitle || "Clinically dosed ingredients to elevate performance.",
            image: "powder",
            ctaText: homePageSettings.heroCtaText || "SHOP PERFORMANCE",
            ctaLink: homePageSettings.heroCtaLink || "/products",
            isActive: true,
            displayOrder: 1
          })
        ) : activeBanners.length === 1 ? (
          /* Render single banner layout statically without swiper wrappers */
          renderBannerContent(activeBanners[0])
        ) : (
          /* Render Swiper carousel for multiple banners */
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            className="w-full"
          >
            {activeBanners.map((banner) => (
              <SwiperSlide key={banner.id} className="pb-10">
                {renderBannerContent(banner)}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      <ValensBrandCarousel />

      {/* 2. Categories Grid */}
      <section className="bg-surface-deep/40 py-16 border-y border-border-color shadow-[inset_0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">
              {locale === "ar" ? "تصفح الفئات" : "Browse Catalog"}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
              {locale === "ar" ? "مصممة حسب هدفك البدني" : "DESIGNED BY TARGET GOAL"}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.filter(c => c.visible).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative flex flex-col items-center rounded-2xl border border-border-color bg-card-bg p-6 text-center transition-luxury hover:border-primary-coral/30 hover:bg-surface-sec shadow-sm hover:shadow-md"
              >
                {/* Glow indicator line on hover */}
                <div
                  className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full opacity-0 transition-luxury group-hover:opacity-100 blur-[1px]"
                  style={{ backgroundColor: cat.imageColor }}
                />

                {/* Icon box */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-white group-hover:text-gray-800 transition-luxury"
                  style={{ boxShadow: `0 0 10px rgba(0,0,0,0.3)` }}
                >
                  <Icon name="category" size={24} style={{ color: cat.imageColor }} />
                </div>
                <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-white group-hover:text-primary-coral transition-luxury">
                  {cat.name}
                </h3>
                <p className="mt-2 text-2xs text-muted-text">
                  Optimize your {cat.name.toLowerCase()} targets.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row border-b border-border-color/30 pb-4">
          <div>
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">
              {locale === "ar" ? "تركيبات متميزة" : "Formulated Excellence"}
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
              {locale === "ar" ? "التركيبات المميزة" : "FEATURED FORMULAS"}
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-coral hover:text-gray-800 transition-luxury"
          >
            {locale === "ar" ? "عرض جميع المكملات" : "VIEW ALL SUPPLEMENTS"}
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Science Pillar Showcase */}
      <section id="science" className="relative border-y border-border-color bg-surface-deep/20 py-20 overflow-hidden">
        {/* Ambient spotlight glow */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-coral/5 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

            {/* Left Graphics info boxes */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-4 order-last lg:order-first">
              <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel glow-coral-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary-coral/10 p-2.5 text-primary-coral">
                    <Icon name="check" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">100% Transparent Label</h4>
                    <p className="mt-1 text-xs text-muted-text">No hidden proprietary blends. We list every single milligram.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent-orange/10 p-2.5 text-accent-orange">
                    <Icon name="star" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Clinical Efficacy Dosages</h4>
                    <p className="mt-1 text-xs text-muted-text">Ingredients dosed at quantities scientifically proven to yield results.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-[#10D981]/10 p-2.5 text-[#10D981]">
                    <Icon name="box" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Third-Party Lab Tested</h4>
                    <p className="mt-1 text-xs text-muted-text">Each batch is verified by independent labs for purity and heavy metals.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right science narrative column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">Purity & Potency</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                {homePageSettings.firstBannerTitle}
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-white">
                {homePageSettings.firstBannerSubtitle}
              </p>
              <div className="mt-8 w-full">
                <blockquote className="border-l-2 border-primary-coral pl-4 text-xs italic text-muted-text">
                  "We created Valens because we were tired of under-dosed formulas, synthetic dyes, and sketchy claims. Every gram we formulate serves a biological purpose."
                  <span className="block mt-2 font-bold not-italic text-white">— Dr. Marcus Vance, Chief Science Officer</span>
                </blockquote>
              </div>
              <div className="mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-coral bg-primary-coral/10 px-6 py-3 text-xs font-black tracking-widest text-primary-coral hover:bg-primary-coral hover:text-main-bg transition-luxury"
                >
                  {homePageSettings.firstBannerCtaText}
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Stories Swiper Carousel */}
      <Carousel
        items={activeStories}
        title={locale === "ar" ? "قصص الأداء والأبحاث المعملية" : "Performance Stories & Lab Notes"}
        eyebrow={locale === "ar" ? "داخل مختبرات فالنز" : "Inside Valens"}
        description={locale === "ar" ? "استكشف تقارير التقدم، مجلات الرياضيين وتحديثات المجموعات المعملية." : "Explore clinical progress, athletic journals, and batch release logs direct from our development team."}
      />

      {/* 5. Best Sellers Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-10 border-b border-border-color/30 pb-4">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
            {locale === "ar" ? "المفضلة لدى الرياضيين" : "Athlete Favorites"}
          </span>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
            {locale === "ar" ? "التركيبات الأكثر مبيعاً" : "BEST SELLING FORMULAS"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section id="about" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-color bg-surface-deep p-8 md:p-12 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary-coral/5 blur-[50px] pointer-events-none" />

          <div className="text-center">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">Community Feedback</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white uppercase">TRUSTED BY ELITE ATHLETES</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-card-bg border border-border-color p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-primary-coral gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={12} />
                ))}
              </div>
              <p className="text-xs italic leading-relaxed text-white">
                "ISO-WHEY mixes completely clear with no chalkiness. My muscle recovery has improved noticeably and there is absolutely no stomach bloat. Highly recommend the Chocolate flavor!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs">
                  C
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Chris E., IFBB Pro</span>
                  <span className="text-3xs text-muted-text uppercase">Bodybuilder</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card-bg border border-border-color p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-primary-coral gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={12} />
                ))}
              </div>
              <p className="text-xs italic leading-relaxed text-white">
                "The pre-workout energy is clean, focused and sustained. I don't feel any post-workout crash or racing heartbeat. Tastes great and mixes instantly."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs">
                  S
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Sarah M., Ultra Runner</span>
                  <span className="text-3xs text-muted-text uppercase">Endurance Athlete</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card-bg border border-border-color p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-primary-coral gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={12} />
                ))}
              </div>
              <p className="text-xs italic leading-relaxed text-white">
                "Third-party laboratory testing is what won me over. Valens lists every compound down to the milligram. Cleanest strength stack on the Egyptian market."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs">
                  Y
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Youssef A., Powerlifter</span>
                  <span className="text-3xs text-muted-text uppercase">Strength Athlete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
