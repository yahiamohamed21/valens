"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";

export default function AboutPage() {
  const { homePageSettings } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-white">
      <Navbar />

      <main className="flex-1 relative w-full overflow-hidden bg-main-bg">
        {/* Decorative background glows */}
        <div className="absolute top-[5%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary-coral/5 blur-[130px] animate-pulse" />
        <div className="absolute top-[35%] right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-accent-orange/5 blur-[150px]" />
        <div className="absolute bottom-[10%] left-[20%] -z-10 h-[500px] w-[500px] rounded-full bg-primary-coral/[0.03] blur-[120px]" />

        {/* 1. Hero / Manifesto Header */}
        <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-coral/30 bg-primary-coral/5 px-4 py-1.5 text-xs font-bold tracking-widest text-primary-coral uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-orange animate-ping" />
              The Valens Standard
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl uppercase leading-tight drop-shadow-[0_0_30px_rgb(var(--rt-primary)/0.3)]">
              THE VALENS MANIFESTO
            </h1>
            <p className="mt-6 text-base leading-relaxed text-soft-text sm:text-lg">
              We did not build Valens to join the supplement industry. We built it to escape it. In a market flooded with proprietary blends, artificial fillers, and deceptive under-dosed formulas, we stand for pure, clinical performance.
            </p>
          </div>
        </section>

        {/* 2. Core Pillars - What makes us unique */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-color">
          <div className="text-center mb-16">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-coral">UNCOMPROMISING PRINCIPLES</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
              WHY WE STAND ALONE
            </h2>
            <p className="mt-4 text-xs text-muted-text max-w-md mx-auto leading-relaxed">
              Every supplement we design is anchored by three clinical promises that represent our commitment to elite athletic progress.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-border-color bg-card-bg/60 p-8 backdrop-blur-sm hover:border-primary-coral/40 transition-all duration-500 ease-out group hover:-translate-y-1 hover:shadow-[0_0_40px_rgb(var(--rt-primary)/0.1)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-border-color border border-border-color text-primary-coral mb-6 group-hover:bg-primary-coral group-hover:text-main-bg transition-all duration-500">
                <Icon name="check" size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white group-hover:text-primary-coral transition-colors duration-500">
                100% LABEL TRANSPARENCY
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-soft-text font-bold">
                No hidden proprietary blends, no mystery matrices, and no magic formulas. We list the exact milligram count of every single ingredient on the label. You deserve to know exactly what is going into your body, and in what dose.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-border-color bg-card-bg/60 p-8 backdrop-blur-sm hover:border-primary-coral/40 transition-all duration-500 ease-out group hover:-translate-y-1 hover:shadow-[0_0_40px_rgb(var(--rt-primary)/0.1)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-border-color border border-border-color text-accent-orange mb-6 group-hover:bg-accent-orange group-hover:text-main-bg transition-all duration-500">
                <Icon name="star" size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white group-hover:text-accent-orange transition-colors duration-500">
                CLINICAL EFFICACY DOSAGES
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-soft-text font-bold">
                We formulate our products using dosages proven by independent clinical trials. When peer-reviewed science shows that a compound yields performance boosts at 6,000mg, we provide exactly 6,000mg—not a token dusting for label marketing.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-border-color bg-card-bg/60 p-8 backdrop-blur-sm hover:border-primary-coral/40 transition-all duration-500 ease-out group hover:-translate-y-1 hover:shadow-[0_0_40px_rgb(var(--rt-primary)/0.1)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-border-color border border-border-color text-success-green mb-6 group-hover:bg-success-green group-hover:text-main-bg transition-all duration-500">
                <Icon name="box" size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white group-hover:text-success-green transition-colors duration-500">
                THIRD-PARTY LAB TESTED
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-soft-text font-bold">
                Raw ingredients enter our facility, and pure performance leaves. Every batch undergoes strict independent testing for heavy metals, purity, micro-toxins, and profile accuracy. The Certificates of Analysis (COAs) are made fully public.
              </p>
            </div>
          </div>
        </section>

        {/* 3. The Comparison Grid */}
        <section className="bg-surface-deep/40 py-20 border-t border-b border-border-color">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-coral">CRITICAL ANALYSIS</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                HOW WE COMPARE
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border-color bg-card-bg/40 backdrop-blur-sm">
              <table className="min-w-full divide-y divide-border-color text-left">
                <thead>
                  <tr className="bg-surface-deep/80 text-white font-black uppercase tracking-wider text-xs">
                    <th scope="col" className="px-6 py-4">Core Feature</th>
                    <th scope="col" className="px-6 py-4 text-primary-coral">Valens Standards</th>
                    <th scope="col" className="px-6 py-4 text-muted-text">Standard Supplements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color text-xs text-soft-text font-bold">
                  <tr className="hover:bg-border-color/30 transition-colors">
                    <td className="px-6 py-4 text-white uppercase font-black">Proprietary Blends</td>
                    <td className="px-6 py-4 text-success-green">0% — Zero Proprietary Formulas</td>
                    <td className="px-6 py-4">High — Hides active ingredient dosages</td>
                  </tr>
                  <tr className="hover:bg-border-color/30 transition-colors">
                    <td className="px-6 py-4 text-white uppercase font-black">Active Dosages</td>
                    <td className="px-6 py-4 text-success-green">Full clinical dosages based on literature</td>
                    <td className="px-6 py-4">Under-dosed (Dusting for marketing)</td>
                  </tr>
                  <tr className="hover:bg-border-color/30 transition-colors">
                    <td className="px-6 py-4 text-white uppercase font-black">Lab Verification</td>
                    <td className="px-6 py-4 text-success-green">Third-party lab tested per individual batch</td>
                    <td className="px-6 py-4">Rarely done, or hidden from consumer</td>
                  </tr>
                  <tr className="hover:bg-border-color/30 transition-colors">
                    <td className="px-6 py-4 text-white uppercase font-black">Fillers & Dyes</td>
                    <td className="px-6 py-4 text-success-green">Zero artificial colors, dyes, or cheap fillers</td>
                    <td className="px-6 py-4">Heavy use of FD&C colors, silica, and talc</td>
                  </tr>
                  <tr className="hover:bg-border-color/30 transition-colors">
                    <td className="px-6 py-4 text-white uppercase font-black">Sweeteners</td>
                    <td className="px-6 py-4 text-success-green">Stevia/Erythritol or minimum clean taste agents</td>
                    <td className="px-6 py-4">Heavy doses of Sucralose and Aspartame</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4. Team & Science Philosophy */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Image Mock */}
            <div className="lg:col-span-5 relative flex items-center justify-center h-[350px] rounded-3xl border border-border-color bg-card-bg/30 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-main-bg to-transparent z-10" />
              <div className="z-20 text-center p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-coral/10 border border-primary-coral text-primary-coral mb-4">
                  <Icon name="settings" size={28} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white">THE VALENS LAB</span>
                <p className="text-[10px] text-muted-text font-bold uppercase mt-2 tracking-widest">GMP CERTIFIED FACILITY • BOSTON, MA</p>
              </div>
            </div>

            {/* Right Story */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-coral">FOUNDED BY RESEARCH</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                ENGINEERED FOR ELITE RESULTS
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-soft-text font-bold">
                Valens was born in the lab. Founded by clinical researchers and professional strength coaches, we set out to build products that we could confidently prescribe to our elite competitors. We do not design for margins or mass-market shelves; we design for metabolic optimization, biological recovery, and raw power.
              </p>
              <div className="mt-8 border-l-2 border-primary-coral pl-6 italic text-muted-text text-sm leading-relaxed">
                &ldquo;Our athletes are pushing their bodies to absolute extremes. If we give them formulas packed with proprietary fillers or under-dosed ingredients, we aren&apos;t just failing their training; we are failing their health. Valens is our answer.&rdquo;
                <span className="block mt-2 font-bold not-italic text-soft-text text-xs">— Dr. Marcus Vance, Chief Science Officer</span>
              </div>
              <div className="mt-10">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 rounded-full bg-primary-coral px-8 py-4 text-xs font-black tracking-widest text-main-bg hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_4px_25px_rgb(var(--rt-primary)/0.25)]"
                >
                  EXPLORE THE CATALOG
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}