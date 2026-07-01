import React from "react";

const mainSlides = Array.from({ length: 12 }, (_, index) => ({
  id: `main-${index}`,
  label: "VALENS",
}));

const techSlides = [
  "CLINICAL DOSAGES",
  "100% LABEL TRANSPARENCY",
  "SCIENTIFICALLY FORMULATED",
  "ZERO PROPRIETARY BLENDS",
  "LAB TESTED FOR PURITY",
  "HIGH-PERFORMANCE SUPPLEMENTS",
];

export function ValensBrandCarousel() {
  const marqueeStyles = `
    @keyframes valens-marquee-left {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes valens-marquee-right {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
    .animate-marquee-left {
      animation: valens-marquee-left 60s linear infinite;
    }
    .animate-marquee-right {
      animation: valens-marquee-right 60s linear infinite;
    }
  `;

  return (
    <section
      dir="ltr"
      data-theme="dark"
      aria-label="Valens brand motion banner"
      className="relative flex flex-col overflow-hidden border-y border-border-color bg-[#090504]"
    >
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />

      {/* Decorative sci-fi grids & lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#ff5226_1px,transparent_0)] bg-[size:16px_16px]" />

      {/* Side gradients to fade content smoothly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#090504] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#090504] to-transparent" />

      {/* Top track: Technical specs (moving Right to Left) */}
      <div className="relative py-2.5 border-b border-border-color/30 bg-black/40 overflow-hidden flex">
        <div className="animate-marquee-right flex w-max items-center gap-16 whitespace-nowrap" aria-hidden="true">
          {Array.from({ length: 16 }).flatMap(() => techSlides).map((text, index) => (
            <div
              key={`tech-${index}`}
              className="flex items-center gap-4 text-[10px] tracking-[0.25em] font-mono uppercase"
              style={{ color: "rgba(216, 201, 195, 0.5)" }}
            >
              <span>{text}</span>
              <span style={{ color: "rgba(255, 138, 117, 0.4)" }}>//</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main track: Brand Title (moving Left to Right) */}
      <div className="relative py-4 overflow-hidden flex bg-gradient-to-b from-[#130d0b] to-[#090504]">
        {/* Top/bottom neon lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF8A75]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF8A75]/20 to-transparent" />

        <div className="animate-marquee-left flex w-max items-center gap-8 whitespace-nowrap" aria-hidden="true">
          {[...mainSlides, ...mainSlides, ...mainSlides, ...mainSlides].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-8"
            >
              {/* Alternate between filled glowing text and hollow stroke text */}
              {index % 2 === 0 ? (
                <span
                  className="text-3xl md:text-5xl font-extrabold tracking-[0.1em] uppercase italic drop-shadow-[0_0_10px_rgba(255,82,38,0.35)] select-none"
                  style={{ color: "#FF8A75" }}
                >
                  {item.label}
                </span>
              ) : (
                <span
                  className="text-3xl md:text-5xl font-extrabold tracking-[0.1em] uppercase italic text-transparent select-none"
                  style={{ WebkitTextStroke: "1px rgba(255, 138, 117, 0.45)" }}
                >
                  {item.label}
                </span>
              )}
              {/* Glowing diamond star separator */}
              <span
                className="text-lg md:text-xl drop-shadow-[0_0_6px_rgba(255,82,38,0.7)] animate-pulse"
                style={{ color: "#FF5226" }}
              >
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
