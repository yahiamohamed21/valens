"use client";

import { useId, useMemo } from "react";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { CarouselItem as CarouselItemType } from "@/data/mockCarouselData";
import { Icon } from "@/components/SvgIcons";
import { CarouselItem } from "./CarouselItem";
import styles from "./carousel.module.css";

const CAROUSEL_BREAKPOINTS: SwiperOptions["breakpoints"] = {
  0: {
    slidesPerView: 1,
    spaceBetween: 16,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
  1280: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
};

const createCarouselConfig = (
  navigationId: string,
  enableAutoplay: boolean,
): SwiperOptions => ({
  modules: [A11y, Autoplay, Keyboard, Navigation, Pagination],
  loop: true,
  speed: 650,
  grabCursor: true,
  keyboard: {
    enabled: true,
  },
  pagination: {
    clickable: true,
  },
  navigation: {
    prevEl: `.carousel-prev-${navigationId}`,
    nextEl: `.carousel-next-${navigationId}`,
  },
  autoplay: enableAutoplay
    ? {
        delay: 3200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }
    : true,
  breakpoints: CAROUSEL_BREAKPOINTS,
  a11y: {
    enabled: true,
    prevSlideMessage: "Previous carousel slide",
    nextSlideMessage: "Next carousel slide",
    paginationBulletMessage: "Go to carousel slide {{index}}",
  },
});

type CarouselProps = {
  items: CarouselItemType[];
  title?: string;
  eyebrow?: string;
  description?: string;
  autoplay?: boolean;
};

export function Carousel({
  items,
  title = "Featured Performance Stories",
  eyebrow = "Temporary Showcase",
  description = "A responsive image carousel backed by mock content until the media API is ready.",
  autoplay = true,
}: CarouselProps) {
  const reactId = useId();
  const navigationId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const swiperConfig = useMemo(
    () => createCarouselConfig(navigationId, autoplay),
    [autoplay, navigationId],
  );

  if (!items.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="homepage-carousel-title"
      className="relative border-y border-border-color bg-surface-deep/30 py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">
              {eyebrow}
            </p>
            <h2
              id="homepage-carousel-title"
              className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-white sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Show previous carousel slide"
              className={`carousel-prev-${navigationId} flex h-11 w-11 items-center justify-center rounded-full border border-border-color bg-card-bg text-white transition-luxury hover:border-primary-coral hover:bg-primary-coral hover:text-main-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-coral`}
            >
              <Icon name="chevron-left" size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Show next carousel slide"
              className={`carousel-next-${navigationId} flex h-11 w-11 items-center justify-center rounded-full border border-border-color bg-card-bg text-white transition-luxury hover:border-primary-coral hover:bg-primary-coral hover:text-main-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-coral`}
            >
              <Icon name="chevron-right" size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.carousel}>
          <Swiper {...swiperConfig}>
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <CarouselItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
