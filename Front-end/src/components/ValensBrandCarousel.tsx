const brandSlides = Array.from({ length: 10 }, (_, index) => ({
  id: `valens-brand-${index}`,
  label: "VALENS",
}));

export function ValensBrandCarousel() {
  return (
    <section
      aria-label="Valens brand motion banner"
      className="relative overflow-hidden border-y border-border-color bg-[#130d0b] py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-main-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-main-bg to-transparent" />

      <div className="valens-marquee flex w-max items-center gap-8" aria-hidden="true">
        {[...brandSlides, ...brandSlides].map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-8 text-primary-coral"
          >
            <span className="font-display text-5xl font-semibold tracking-normal text-glow sm:text-6xl lg:text-7xl">
              {item.label}
            </span>
            <span className="h-2 w-2 rounded-full bg-accent-orange shadow-[0_0_18px_rgba(255,82,38,0.8)]" />
          </div>
        ))}
      </div>
    </section>
  );
}
