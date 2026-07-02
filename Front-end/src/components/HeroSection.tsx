// src/components/HeroSection.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Icon } from "./SvgIcons";
import { ProductImage } from "./ProductCard";

interface HeroProps {
  locale: string;
  promoBadgeText: string;
  heroTitleText: string;
  heroSubtitleText: string;
  heroCtaLink: string;
  heroCtaTextVal: string;
}

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const TOTAL_FRAMES = 240; // ⚠️ must match the exact number of frames in /public/frames
const FRAME_PATH = "/frames/";
const FRAME_EXT = "jpg";

// How many viewport-heights the user has to scroll through the pinned hero.
// 500vh felt "stuck" — 320vh (~3.2 screens) is enough to read as a cinematic
// scrub without feeling like the page is frozen.
const SCROLL_DISTANCE_VH = 320;

// Cap devicePixelRatio so we don't ask 3x/4x mobile screens to allocate a
// canvas 3–4x larger than necessary (kills perf, no visible quality gain
// past ~2x for this kind of content).
const MAX_DPR = 2;

// Source footage is now proper 16:9 (1920x1080) landscape, so no artificial
// zoom-out is needed anymore — 1.0 = normal "cover" crop, no blurred padding.
// If you ever swap in another portrait/mismatched-ratio video, drop this
// back down to ~0.75–0.85 to avoid the "لازق" edge-to-edge crop look.
const ZOOM_OUT = 1.0;

/**
 * Draws an image onto the canvas so it behaves like CSS `background-size: cover`,
 * then optionally shrinks it (ZOOM_OUT < 1) so the subject sits centered with
 * padding instead of bleeding off every edge. The padding is filled with a
 * heavily blurred, darkened copy of the same frame so there's no hard empty
 * bars — it reads as an intentional cinematic vignette, not a bug.
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  zoom: number = ZOOM_OUT,
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  const coverScale =
    canvasRatio > imgRatio
      ? canvasWidth / img.naturalWidth
      : canvasHeight / img.naturalHeight;

  ctx.imageSmoothingEnabled = true;

  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // --- Layer 1: blurred, darkened full-bleed backdrop (fills the padding) ---
  if (zoom < 1) {
    const bgWidth = img.naturalWidth * coverScale;
    const bgHeight = img.naturalHeight * coverScale;
    ctx.save();
    ctx.filter = "blur(36px) brightness(0.55) saturate(1.1)";
    ctx.drawImage(
      img,
      (canvasWidth - bgWidth) / 2,
      (canvasHeight - bgHeight) / 2,
      bgWidth,
      bgHeight,
    );
    ctx.restore();
  }

  // --- Layer 2: the crisp, centered, zoomed-out product frame ---
  const scale = coverScale * zoom;
  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;
  const x = (canvasWidth - width) / 2;
  const y = (canvasHeight - height) / 2;
  ctx.drawImage(img, x, y, width, height);
}

export default function HeroSection({
  locale,
  promoBadgeText,
  heroTitleText,
  heroSubtitleText,
  heroCtaLink,
  heroCtaTextVal,
}: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 -> 1, drives content fade

  // ---------------------------------------------------------------------
  // Preload all frames
  // ---------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const loadImage = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        const src = `${FRAME_PATH}frame_${String(index + 1).padStart(4, "0")}.${FRAME_EXT}`;
        img.decoding = "async";
        img.src = src;
        img.onload = () => {
          if (!cancelled) setLoadedCount((c) => c + 1);
          resolve();
        };
        img.onerror = () => {
          console.error(`[HeroSection] Failed to load frame: ${src}`);
          if (!cancelled) setLoadedCount((c) => c + 1);
          resolve();
        };
        imgs[index] = img;
      });

    const loadAll = async () => {
      await Promise.all(
        Array.from({ length: TOTAL_FRAMES }, (_, i) => loadImage(i)),
      );
      if (cancelled) return;
      imagesRef.current = imgs;
      setIsLoading(false);
      // Draw the very first frame as soon as everything is ready.
      drawCurrentFrame();
    };

    loadAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------
  // Canvas sizing (device-pixel-ratio aware, capped for perf)
  // ---------------------------------------------------------------------
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before re-scaling
      ctx.scale(dpr, dpr);
    }
    drawCurrentFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawCurrentFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[currentFrameRef.current];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    drawImageCover(ctx, img, canvas.width / dpr, canvas.height / dpr);
  }, []);

  useEffect(() => {
    resizeCanvas();
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 120); // debounce
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimeout);
    };
  }, [resizeCanvas]);

  // ---------------------------------------------------------------------
  // Scroll → frame index (rAF-batched, no React re-render per frame)
  // ---------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight - window.innerHeight;
      const progress =
        containerHeight > 0
          ? Math.min(Math.max((scrollTop - containerTop) / containerHeight, 0), 1)
          : 0;

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * (TOTAL_FRAMES - 1)),
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawCurrentFrame();
      }

      // Only trigger a React re-render for the progress-driven fade —
      // throttled naturally by rAF, cheap enough for opacity/transform.
      setScrollProgress(progress);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafRef.current = window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawCurrentFrame]);

  const loadProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // Fade the overlay content out during the first ~35% of the scrub so it
  // reads as an intentional cinematic reveal instead of "stuck" static text.
  const contentOpacity = Math.max(0, 1 - scrollProgress / 0.35);
  const contentTranslate = Math.min(scrollProgress / 0.35, 1) * -24; // px

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${SCROLL_DISTANCE_VH}vh` }}
    >
      {/* Sticky, full-viewport, clipped so nothing inside can visually
          escape the screen bounds while scrolling. */}
      <section className="sticky top-0 left-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          style={{ objectFit: "cover" }}
        />

        {/* Subtle gradient so text stays legible over any frame */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black text-sm font-bold uppercase tracking-widest text-white/80">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>{loadProgress}%</span>
            </div>
          </div>
        )}

        {/* Hero content — fades/lifts out as the user scrubs the video */}
        <div
          className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-12 lg:px-8"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentTranslate}px)`,
            transition: "opacity 0.05s linear, transform 0.05s linear",
          }}
        >
          {/* Left Text Column */}
          <div
            className={`flex flex-col items-start lg:col-span-6 ${locale === "ar" ? "text-right" : "text-left"
              }`}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-coral/30 bg-primary-coral/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-coral">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-accent-orange" />
              {promoBadgeText}
            </span>
            <h1 className="text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {heroTitleText}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white sm:text-lg">
              {heroSubtitleText}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={heroCtaLink}
                className="flex items-center justify-center gap-2 rounded-full bg-primary-coral px-8 py-4 text-sm font-black tracking-widest text-main-bg transition-luxury hover:scale-105 hover:bg-gray-600 shadow-[0_4px_20px_rgba(255,138,117,0.3)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)]"
              >
                {heroCtaTextVal}
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link
                href="#science"
                className="flex items-center justify-center gap-2 rounded-full border border-border-color bg-surface-deep/40 px-8 py-4 text-sm font-black tracking-widest text-white transition-luxury hover:border-primary-coral hover:bg-primary-coral/5"
              >
                {locale === "ar" ? "الجانب العلمي" : "THE SCIENCE"}
              </Link>
            </div>

            <div className="mt-12 grid w-full grid-cols-3 gap-6 border-t border-border-color pt-8">
              <div>
                <span className="text-2xl font-black text-white">100%</span>
                <p className="mt-1 text-3xs font-bold uppercase tracking-widest text-muted-text">
                  {locale === "ar" ? "نقاء معتمد معملياً" : "Lab Certified Purity"}
                </p>
              </div>
              <div>
                <span className="text-2xl font-black text-white">0g</span>
                <p className="mt-1 text-3xs font-bold uppercase tracking-widest text-muted-text">
                  {locale === "ar" ? "خلطات سرية مبهمة" : "Proprietary Blends"}
                </p>
              </div>
              <div>
                <span className="text-2xl font-black text-white">CLINICAL</span>
                <p className="mt-1 text-3xs font-bold uppercase tracking-widest text-muted-text">
                  {locale === "ar" ? "جرعات مكونات فاعلة" : "Ingredient Dosages"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Product Display — contained so nothing spills past the viewport */}
          <div className="relative hidden h-[400px] items-center justify-center overflow-hidden lg:col-span-6 lg:flex lg:h-[500px]">
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full bg-primary-coral/10 blur-[80px]" />
              <div className="h-48 w-48 rounded-full bg-accent-orange/10 blur-[60px]" />
            </div>

            <div className="absolute bottom-[10%] left-[8%] w-[160px] -rotate-6 transform brightness-75 transition-luxury hover:z-20 hover:scale-105 sm:w-[200px]">
              <ProductImage color="#D8C9C3" type="powder" glow={false} className="h-64 w-full" />
            </div>
            <div className="absolute bottom-[10%] right-[8%] w-[160px] rotate-6 transform brightness-75 transition-luxury hover:z-20 hover:scale-105 sm:w-[200px]">
              <ProductImage color="#FF5226" type="powder" glow={false} className="h-64 w-full" />
            </div>
            <div className="absolute bottom-[5%] z-10 w-[200px] shadow-2xl transition-luxury hover:scale-110 sm:w-[240px]">
              <ProductImage color="#FF8A75" type="powder" glow={true} className="h-80 w-full" />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 6) }}
        >
          <span className="text-3xs font-bold uppercase tracking-[0.3em]">
            {locale === "ar" ? "استمر بالتمرير" : "Scroll"}
          </span>
          <div className="h-8 w-[1px] animate-pulse bg-white/40" />
        </div>
      </section>
    </div>
  );
}