"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Icon } from "./SvgIcons";

const TOTAL_FRAMES = 200;

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;
  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgRatio > canvasRatio) {
    sWidth = img.height * canvasRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / canvasRatio;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
}

export const HeroScrollAnimation: React.FC = () => {
  const { homePageSettings, locale } = useApp();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadeOutLoading, setFadeOutLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameIndexRef = useRef<number>(-1);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const handleLoad = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setProgress(percent);

      if (loadedCount === TOTAL_FRAMES) {
        // Fade out overlay first, then remove from DOM
        setFadeOutLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/frames/frame_${frameNum}.jpg`;
      img.onload = handleLoad;
      img.onerror = handleLoad; // Skip bad frames but keep progress moving
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = imagesRef.current[index];
    if (!ctx || !img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImageCover(ctx, img, canvas.width, canvas.height);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const frameIdx = lastFrameIndexRef.current >= 0 ? lastFrameIndexRef.current : 0;
    drawFrame(frameIdx);
  }, [drawFrame]);

  const updateFrame = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const scrollRange = container.scrollHeight - window.innerHeight;
    if (scrollRange <= 0) return;

    const scrollTop = -rect.top;
    const progressVal = Math.max(0, Math.min(1, scrollTop / scrollRange));
    const frameIndex = Math.floor(progressVal * (TOTAL_FRAMES - 1));

    if (frameIndex !== lastFrameIndexRef.current) {
      lastFrameIndexRef.current = frameIndex;
      drawFrame(frameIndex);
    }
  }, [drawFrame]);

  // Initial resize and frame render
  useEffect(() => {
    if (loading) return;
    resizeCanvas();
    updateFrame();
  }, [loading, resizeCanvas, updateFrame]);

  // Scroll and resize listeners
  useEffect(() => {
    if (loading) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleScroll = () => {
      if (!isVisible) return;
      requestAnimationFrame(updateFrame);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [loading, resizeCanvas, updateFrame]);

  const heroTitleText =
    locale === "ar" && homePageSettings.heroTitle_ar
      ? homePageSettings.heroTitle_ar
      : homePageSettings.heroTitle;
  const heroSubtitleText =
    locale === "ar" && homePageSettings.heroSubtitle_ar
      ? homePageSettings.heroSubtitle_ar
      : homePageSettings.heroSubtitle;
  const heroCtaTextVal =
    locale === "ar" && homePageSettings.heroCtaText_ar
      ? homePageSettings.heroCtaText_ar
      : homePageSettings.heroCtaText;
  const promoBadgeText =
    locale === "ar" && homePageSettings.promoBadge_ar
      ? homePageSettings.promoBadge_ar
      : homePageSettings.promoBadge;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-main-bg"
      style={{ height: "450vh" }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-main-bg transition-opacity duration-500 ease-in-out ${fadeOutLoading ? "opacity-0" : "opacity-100"
            }`}
        >
          {/* Sci-fi theme loader panel */}
          <div className="flex flex-col items-center max-w-xs w-full px-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-coral animate-pulse mb-3">
              Initializing Experience
            </span>
            <div className="text-4xl font-black text-white font-mono tracking-wider mb-6">
              {progress}%
            </div>
            {/* Loading progress bar */}
            <div className="relative h-1 w-full bg-surface-deep/60 rounded-full overflow-hidden border border-border-color/40 shadow-inner">
              <div
                className="absolute inset-y-0 left-0 bg-primary-coral transition-all duration-300 ease-out shadow-[0_0_12px_#FF8A75]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full object-cover"
        />

        {/* Ambient Dark Overlay to ensure layout readability */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none z-10" />

        {/* Content Panel (Hero Text / Interactive Buttons) */}
        <div className="absolute inset-0 z-20 flex items-center justify-start pointer-events-none">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto">
            <div className="max-w-xl flex flex-col items-start text-left">
              {/* Promo Badge */}
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-coral/30 bg-primary-coral/5 px-4 py-1.5 text-xs font-bold tracking-widest text-primary-coral uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-orange animate-ping" />
                {promoBadgeText || "VALENS LABS"}
              </span>

              {/* Title */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl uppercase leading-[1.1] drop-shadow-md">
                {heroTitleText || "YOUR PREMIUM ENERGY STACK"}
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base leading-relaxed text-gray-200 sm:text-lg drop-shadow-sm font-medium">
                {heroSubtitleText || "Clinically dosed ingredients to elevate performance."}
              </p>

              {/* Action buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
                <Link
                  href={homePageSettings.heroCtaLink || "/products"}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary-coral px-8 py-4 text-sm font-black tracking-widest text-main-bg transition-luxury hover:bg-white hover:scale-105 shadow-[0_4px_20px_rgba(255,138,117,0.3)]"
                >
                  {heroCtaTextVal || "SHOP PERFORMANCE"}
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link
                  href="#science"
                  className="flex items-center justify-center gap-2 rounded-full border border-border-color bg-surface-deep/45 px-8 py-4 text-sm font-black tracking-widest text-white transition-luxury hover:border-primary-coral hover:bg-primary-coral/10 hover:scale-105"
                >
                  {locale === "ar" ? "الجانب العلمي" : "THE SCIENCE"}
                </Link>
              </div>

              {/* Stats overlay */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border-color/60 pt-8 w-full">
                <div>
                  <span className="text-2xl font-black text-white drop-shadow-sm">100%</span>
                  <p className="text-3xs font-bold uppercase tracking-widest text-muted-text mt-1">
                    {locale === "ar" ? "نقاء معتمد معملياً" : "Lab Certified Purity"}
                  </p>
                </div>
                <div>
                  <span className="text-2xl font-black text-white drop-shadow-sm">0g</span>
                  <p className="text-3xs font-bold uppercase tracking-widest text-muted-text mt-1">
                    {locale === "ar" ? "خلطات سرية مبهمة" : "Proprietary Blends"}
                  </p>
                </div>
                <div>
                  <span className="text-2xl font-black text-white drop-shadow-sm">CLINICAL</span>
                  <p className="text-3xs font-bold uppercase tracking-widest text-muted-text mt-1">
                    {locale === "ar" ? "جرعات مكونات فاعلة" : "Ingredient Dosages"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};