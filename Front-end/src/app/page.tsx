"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ProductCard, ProductImage } from "@/components/ProductCard";
import { Icon } from "@/components/SvgIcons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ValensBrandCarousel } from "@/components/ValensBrandCarousel";
import { Carousel } from "@/components/Carousel/Carousel";
import { mockCarouselData } from "@/data/mockCarouselData";
import { HeroScrollAnimation } from "@/components/HeroScrollAnimation";


export default function Home() {
  const { products, categories, homePageSettings, locale, t } = useApp();

  const getCategoryName = (catName: string) => {
    if (locale !== "ar") return catName;
    switch (catName.toLowerCase()) {
      case "protein": return "البروتينات";
      case "pre-workout": return "طاقة وتحفيز (Pre-Workout)";
      case "amino acids":
      case "aminos": return "أحماض أمينية (Aminos)";
      case "recovery": return "استشفاء وعضلات (Recovery)";
      default: return catName;
    }
  };

  // Filter products for homepage sections
  const featuredProducts = products.filter((p) => p.featured && p.visible).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller && p.visible).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-white">
      <Navbar />
      {/*
        NO `overflow-hidden` on <main>. `overflow-hidden` on any ancestor of
        a `position: sticky` element breaks the stickiness — that was the
        exact cause of HeroScrollAnimation only playing the first bit of
        frames and then leaving blank space instead of continuing to scrub
        through the full scroll distance. Decorative glows that need
        clipping now live in their own small overflow-hidden wrapper below,
        scoped only to themselves — not wrapping HeroScrollAnimation.
      */}
      <main className="relative w-full flex-1 bg-main-bg">
        <HeroScrollAnimation />

        {/* Decorative background glows — clipped locally, not on <main> */}
        <div className="pointer-events-none relative w-full overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary-coral/5 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-[40%] right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-accent-orange/5 blur-[150px]" />
        </div>

        <ValensBrandCarousel />

        {/* 2. Categories Grid */}
        <section className="bg-surface-deep/40 py-16 border-t border-b border-border-color">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
                {locale === "ar" ? "تصفح الأقسام" : "Browse Catalog"}
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
                  className="group relative flex flex-col items-center rounded-2xl border border-border-color bg-card-bg p-6 text-center transition-luxury hover:border-primary-coral/30 hover:bg-surface-sec"
                >
                  <div
                    className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full opacity-0 transition-luxury group-hover:opacity-100 blur-[1px]"
                    style={{ backgroundColor: cat.imageColor }}
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-white group-hover:text-gray-800 transition-luxury">
                    <Icon name="category" size={24} style={{ color: cat.imageColor }} />
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-white group-hover:text-primary-coral transition-luxury">
                    {getCategoryName(cat.name)}
                  </h3>
                  <p className="mt-2 text-2xs text-muted-text font-bold">
                    {locale === "ar"
                      ? `حسّن مستويات وأهداف ${getCategoryName(cat.name)} الخاصة بك.`
                      : `Optimize your ${cat.name.toLowerCase()} targets.`
                    }
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Featured Products */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className={locale === "ar" ? "text-right" : "text-left"}>
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
                {locale === "ar" ? "التميز في الصياغة" : "Formulated Excellence"}
              </span>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
                {locale === "ar" ? "المنتجات المميزة" : "FEATURED FORMULAS"}
              </h2>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-coral hover:text-gray-800 transition-luxury"
            >
              {locale === "ar" ? "عرض جميع المكملات" : "VIEW ALL SUPPLEMENTS"}
              <Icon name="arrow-right" size={14} className={locale === "ar" ? "rotate-180" : ""} />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* 4. Science Pillar Showcase */}
        <section id="science" className="relative border-t border-b border-border-color bg-surface-deep/20 py-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-coral/5 blur-[100px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

              {/* Left Graphics */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-4 order-last lg:order-first">
                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel glow-coral-sm">
                  <div className={`flex items-center gap-4 ${locale === "ar" ? "text-right" : "text-left"}`}>
                    <div className="rounded-lg bg-primary-coral/10 p-2.5 text-primary-coral shrink-0">
                      <Icon name="check" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {locale === "ar" ? "بطاقة شفافية 100%" : "100% Transparent Label"}
                      </h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">
                        {locale === "ar" ? "لا خلطات سرية أو مخفية. ندرج كل ملليغرام بالكامل." : "No hidden proprietary blends. We list every single milligram."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel">
                  <div className={`flex items-center gap-4 ${locale === "ar" ? "text-right" : "text-left"}`}>
                    <div className="rounded-lg bg-accent-orange/10 p-2.5 text-accent-orange shrink-0">
                      <Icon name="star" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {locale === "ar" ? "جرعات سريرية فعالة" : "Clinical Efficacy Dosages"}
                      </h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">
                        {locale === "ar" ? "مكونات مصاغة بالكميات المثبتة علمياً لتحقيق النتائج الرياضية." : "Ingredients dosed at quantities scientifically proven to yield results."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel">
                  <div className={`flex items-center gap-4 ${locale === "ar" ? "text-right" : "text-left"}`}>
                    <div className="rounded-lg bg-[#10D981]/10 p-2.5 text-[#10D981] shrink-0">
                      <Icon name="box" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {locale === "ar" ? "مختبرة ومعتمدة معملياً" : "Third-Party Lab Tested"}
                      </h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">
                        {locale === "ar" ? "يتم التحقق من كل تشغيلة بواسطة مختبرات مستقلة للتأكد من النقاء." : "Each batch is verified by independent labs for purity and heavy metals."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Texts */}
              <div className={`lg:col-span-7 flex flex-col items-start ${locale === "ar" ? "text-right items-end" : "text-left"}`}>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
                  {locale === "ar" ? "النقاء والفاعلية القوية" : "Purity & Potency"}
                </span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                  {locale === "ar" && homePageSettings.firstBannerTitle_ar ? homePageSettings.firstBannerTitle_ar : homePageSettings.firstBannerTitle}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-white">
                  {locale === "ar" && homePageSettings.firstBannerSubtitle_ar ? homePageSettings.firstBannerSubtitle_ar : homePageSettings.firstBannerSubtitle}
                </p>
                <div className="mt-8 w-full">
                  <blockquote className={`border-primary-coral text-xs italic text-muted-text ${locale === "ar" ? "border-r-2 pr-4 text-right" : "border-l-2 pl-4 text-left"
                    }`}>
                    {locale === "ar"
                      ? "\"لقد أنشأنا Valens لأننا سئمنا من التركيبات ضعيفة الجرعات، والألوان الاصطناعية، والادعاءات المشكوك فيها. كل غرام نصيغه يخدم غرضًا بيولوجيًا حقيقيًا.\""
                      : "\"We created Valens because we were tired of under-dosed formulas, synthetic dyes, and sketchy claims. Every gram we formulate serves a biological purpose.\""
                    }
                    <span className="block mt-2 font-bold not-italic text-white">
                      {locale === "ar" ? "— د. ماركوس فانس، كبير المسؤولين العلميين" : "— Dr. Marcus Vance, Chief Science Officer"}
                    </span>
                  </blockquote>
                </div>
                <div className="mt-8">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full border border-primary-coral bg-primary-coral/10 px-6 py-3 text-xs font-black tracking-widest text-primary-coral hover:bg-primary-coral hover:text-main-bg transition-luxury"
                  >
                    {locale === "ar" && homePageSettings.firstBannerCtaText_ar ? homePageSettings.firstBannerCtaText_ar : homePageSettings.firstBannerCtaText}
                    <Icon name="arrow-right" size={14} className={locale === "ar" ? "rotate-180" : ""} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Brand Stories Swiper Carousel */}
        <Carousel
          items={mockCarouselData.map(item => ({
            ...item,
            title: locale === "ar" && item.title_ar ? item.title_ar : item.title,
            category: locale === "ar" && item.category_ar ? item.category_ar : item.category,
            description: locale === "ar" && item.description_ar ? item.description_ar : item.description
          }))}
          title={locale === "ar" ? "قصص الأداء وملاحظات المختبر" : "Performance Stories & Lab Notes"}
          eyebrow={locale === "ar" ? "داخل Valens" : "Inside Valens"}
          description={locale === "ar" ? "استكشف التطور السريري، المجلات الرياضية، وسجلات إطلاق الدفعات مباشرة من فريق التطوير." : "Explore clinical progress, athletic journals, and batch release logs direct from our development team."}
        />

        {/* 5. Best Sellers Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
              {locale === "ar" ? "المفضلة لدى الرياضيين" : "Athlete Favorites"}
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
              {locale === "ar" ? "المنتجات الأكثر مبيعاً" : "BEST SELLING FORMULAS"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}