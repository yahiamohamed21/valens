"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ProductCard, ProductImage } from "@/components/ProductCard";
import { Icon } from "@/components/SvgIcons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { products, categories, homePageSettings } = useApp();

  // Filter products for homepage sections
  const featuredProducts = products.filter((p) => p.featured && p.visible).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller && p.visible).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-white">
      <Navbar />
      <main className="flex-1 relative w-full overflow-hidden bg-main-bg">
        {/* Decorative background glows */}
        <div className="absolute top-[10%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary-coral/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[40%] right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-accent-orange/5 blur-[150px]" />

        {/* 1. Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Text Column */}
            <div className="flex flex-col items-start text-left lg:col-span-6">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-coral/30 bg-primary-coral/5 px-4 py-1.5 text-xs font-bold tracking-widest text-primary-coral uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-orange animate-ping" />
                {homePageSettings.promoBadge}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl uppercase leading-[1.1]">
                {homePageSettings.heroTitle}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-soft-text sm:text-lg">
                {homePageSettings.heroSubtitle}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={homePageSettings.heroCtaLink}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary-coral px-8 py-4 text-sm font-black tracking-widest text-main-bg transition-luxury hover:bg-white hover:scale-105 shadow-[0_4px_20px_rgba(255,138,117,0.3)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)]"
                >
                  {homePageSettings.heroCtaText}
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link
                  href="#science"
                  className="flex items-center justify-center gap-2 rounded-full border border-border-color bg-surface-deep/40 px-8 py-4 text-sm font-black tracking-widest text-white transition-luxury hover:border-primary-coral hover:bg-primary-coral/5"
                >
                  THE SCIENCE
                </Link>
              </div>
              {/* Quick stats badges */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border-color pt-8 w-full">
                <div>
                  <span className="text-2xl font-black text-white">100%</span>
                  <p className="text-3xs font-bold uppercase tracking-widest text-muted-text mt-1">Lab Certified Purity</p>
                </div>
                <div>
                  <span className="text-2xl font-black text-white">0g</span>
                  <p className="text-3xs font-bold uppercase tracking-widest text-muted-text mt-1">Proprietary Blends</p>
                </div>
                <div>
                  <span className="text-2xl font-black text-white">CLINICAL</span>
                  <p className="text-3xs font-bold uppercase tracking-widest text-muted-text mt-1">Ingredient Dosages</p>
                </div>
              </div>
            </div>

            {/* Right Product Display */}
            <div className="relative flex items-center justify-center lg:col-span-6 h-[400px] lg:h-[500px]">
              {/* Ambient Coral Spotlights */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-primary-coral/10 blur-[80px]" />
                <div className="h-48 w-48 rounded-full bg-accent-orange/10 blur-[60px]" />
              </div>

              {/* Left Bottle */}
              <div className="absolute left-[5%] bottom-[10%] w-[180px] sm:w-[220px] transition-luxury hover:scale-105 hover:z-20 transform -rotate-6 filter brightness-75">
                <ProductImage color="#D8C9C3" type="powder" glow={false} className="h-64 w-full" />
              </div>

              {/* Right Bottle */}
              <div className="absolute right-[5%] bottom-[10%] w-[180px] sm:w-[220px] transition-luxury hover:scale-105 hover:z-20 transform rotate-6 filter brightness-75">
                <ProductImage color="#FF5226" type="powder" glow={false} className="h-64 w-full" />
              </div>

              {/* Center Main Bottle */}
              <div className="absolute bottom-[5%] w-[220px] sm:w-[260px] z-10 transition-luxury hover:scale-110 shadow-2xl">
                <ProductImage color="#FF8A75" type="powder" glow={true} className="h-80 w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Categories Grid */}
        <section className="bg-surface-deep/40 py-16 border-t border-b border-border-color">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">Browse Catalog</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                DESIGNED BY TARGET GOAL
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.filter(c => c.visible).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col items-center rounded-2xl border border-border-color bg-card-bg p-6 text-center transition-luxury hover:border-primary-coral/30 hover:bg-[#1a110f]"
                >
                  <div
                    className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full opacity-0 transition-luxury group-hover:opacity-100 blur-[1px]"
                    style={{ backgroundColor: cat.imageColor }}
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-soft-text group-hover:text-white transition-luxury">
                    <Icon name="category" size={24} style={{ color: cat.imageColor }} />
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-white group-hover:text-primary-coral transition-luxury">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-2xs text-muted-text font-bold">
                    Optimize your {cat.name.toLowerCase()} targets.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Featured Products */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">Formulated Excellence</span>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
                FEATURED FORMULAS
              </h2>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-coral hover:text-white transition-luxury"
            >
              VIEW ALL SUPPLEMENTS
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
        <section id="science" className="relative border-t border-b border-border-color bg-surface-deep/20 py-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-coral/5 blur-[100px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

              {/* Left Graphics */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-4 order-last lg:order-first">
                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel glow-coral-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary-coral/10 p-2.5 text-primary-coral">
                      <Icon name="check" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">100% Transparent Label</h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">No hidden proprietary blends. We list every single milligram.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-accent-orange/10 p-2.5 text-accent-orange">
                      <Icon name="star" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Clinical Efficacy Dosages</h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">Ingredients dosed at quantities scientifically proven to yield results.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-[#10D981]/10 p-2.5 text-[#10D981]">
                      <Icon name="box" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Third-Party Lab Tested</h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">Each batch is verified by independent labs for purity and heavy metals.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Texts */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">Purity & Potency</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                  {homePageSettings.firstBannerTitle}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-soft-text">
                  {homePageSettings.firstBannerSubtitle}
                </p>
                <div className="mt-8">
                  <blockquote className="border-l-2 border-primary-coral pl-4 text-xs italic text-muted-text">
                    \"We created Valens because we were tired of under-dosed formulas, synthetic dyes, and sketchy claims. Every gram we formulate serves a biological purpose.\"
                    <span className="block mt-2 font-bold not-italic text-soft-text">— Dr. Marcus Vance, Chief Science Officer</span>
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

        {/* 5. Best Sellers Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">Athlete Favorites</span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
              BEST SELLING FORMULAS
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
          <div className="rounded-3xl border border-border-color bg-surface-deep p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary-coral/5 blur-[50px] pointer-events-none" />

            <div className="text-center">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">Community Feedback</span>
              <h2 className="mt-1 text-2xl font-extrabold text-white uppercase">TRUSTED BY ELITE ATHLETES</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-card-bg border border-border-color p-6">
                <div className="flex text-primary-coral gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" size={12} />
                  ))}
                </div>
                <p className="text-xs italic leading-relaxed text-soft-text font-bold">
                  \"ISO-WHEY mixes completely clear with no chalkiness. My muscle recovery has improved noticeably and there is absolutely no stomach bloat. Highly recommend the Chocolate flavor!\"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs">
                    C
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Chris E., IFBB Pro</span>
                    <span className="text-3xs text-muted-text uppercase font-bold">Bodybuilder</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-card-bg border border-border-color p-6">
                <div className="flex text-primary-coral gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" size={12} />
                  ))}
                </div>
                <p className="text-xs italic leading-relaxed text-soft-text font-bold">
                  \"The PRE-CHARGE Elite provides the cleanest surge of power I've ever felt. No jittery skin, just total, locked-in concentration for my three-hour training blocks. Unrivaled.\"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs">
                    A
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Amanda L.</span>
                    <span className="text-3xs text-muted-text uppercase font-bold">CrossFit Competitor</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-card-bg border border-border-color p-6">
                <div className="flex text-primary-coral gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" size={12} />
                  ))}
                </div>
                <p className="text-xs italic leading-relaxed text-soft-text font-bold">
                  \"Deep Sleep & Recover has changed the game for me. I sleep deeper, track more REM on my watch, and wake up without that heavy groggy feeling. An absolute staple.\"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs">
                    M
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Marcus P.</span>
                    <span className="text-3xs text-muted-text uppercase font-bold">Marathon Runner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
