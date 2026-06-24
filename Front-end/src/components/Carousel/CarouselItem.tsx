"use client";

import Image from "next/image";
import { memo } from "react";
import type { CarouselItem as CarouselItemType } from "@/data/mockCarouselData";

type CarouselItemProps = {
  item: CarouselItemType;
};

function CarouselItemComponent({ item }: CarouselItemProps) {
  return (
    <figure className="group h-full overflow-hidden rounded-2xl border border-border-color bg-card-bg shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-luxury hover:border-primary-coral/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-deep">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 25vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-main-bg/80 via-main-bg/10 to-transparent" />
      </div>

      <figcaption className="space-y-3 p-5">
        <h3 className="text-lg font-black uppercase tracking-wide text-white">
          {item.title}
        </h3>
        {item.description ? (
          <p className="text-sm leading-6 text-soft-text">{item.description}</p>
        ) : null}
      </figcaption>
    </figure>
  );
}

export const CarouselItem = memo(CarouselItemComponent);
