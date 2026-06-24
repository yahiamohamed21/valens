"use client";

import React from "react";
import Link from "next/link";
import { useApp, Product } from "@/context/AppContext";
import { Icon } from "./SvgIcons";

interface ProductCardProps {
  product: Product;
}

// Pure SVG high-end supplement bottle generator to act as premium mockup images
export const ProductImage: React.FC<{
  color: string;
  type: 'powder' | 'capsule' | 'liquid';
  className?: string;
  glow?: boolean;
}> = ({ color, type, className = "h-48 w-full", glow = true }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-visible ${className}`}>
      {/* Background radial glow */}
      {glow && (
        <div
          className="absolute -z-10 h-32 w-32 rounded-full blur-[40px] opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-60"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Supplement Bottle SVG */}
      <svg
        viewBox="0 0 200 280"
        className="h-full w-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-1"
      >
        <defs>
          {/* Bottle body gradient (dark obsidian glass) */}
          <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B0605" />
            <stop offset="25%" stopColor="#1E1310" />
            <stop offset="50%" stopColor="#281A16" />
            <stop offset="75%" stopColor="#120806" />
            <stop offset="100%" stopColor="#030100" />
          </linearGradient>

          {/* Label texture gradient */}
          <linearGradient id="labelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#151515" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>

          {/* Metallic highlight */}
          <linearGradient id="metalHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="65%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Cap gradient using the dynamic color input */}
          <linearGradient id={`capGrad-${color.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B0605" />
            <stop offset="30%" stopColor={color} />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor={color} />
            <stop offset="100%" stopColor="#030100" />
          </linearGradient>
        </defs>

        {/* Bottle Shadow */}
        <ellipse cx="100" cy="265" rx="55" ry="10" fill="black" opacity="0.55" filter="blur(4px)" />

        {/* Bottle Body */}
        <rect x="50" y="70" width="100" height="180" rx="16" fill="url(#bottleGrad)" stroke="#2A1E1A" strokeWidth="1" />

        {/* Bottle Neck */}
        <rect x="75" y="46" width="50" height="25" rx="4" fill="#0B0605" />
        <rect x="70" y="60" width="60" height="12" rx="3" fill="#1A0F0D" />

        {/* Cap (screw top) */}
        <rect x="72" y="24" width="56" height="24" rx="4" fill={`url(#capGrad-${color.replace("#", "")})`} />
        {/* Cap ridges */}
        <line x1="78" y1="24" x2="78" y2="48" stroke="#120806" strokeWidth="1.5" />
        <line x1="84" y1="24" x2="84" y2="48" stroke="#120806" strokeWidth="1.5" />
        <line x1="90" y1="24" x2="90" y2="48" stroke="#120806" strokeWidth="1.5" />
        <line x1="96" y1="24" x2="96" y2="48" stroke="#120806" strokeWidth="1.5" />
        <line x1="102" y1="24" x2="102" y2="48" stroke="#120806" strokeWidth="1.5" />
        <line x1="108" y1="24" x2="108" y2="48" stroke="#120806" strokeWidth="1.5" />
        <line x1="114" y1="24" x2="114" y2="48" stroke="#120806" strokeWidth="1.5" />
        <line x1="120" y1="24" x2="120" y2="48" stroke="#120806" strokeWidth="1.5" />

        {/* Label Background */}
        <rect x="52" y="90" width="96" height="135" rx="6" fill="url(#labelGrad)" stroke="#1A1A1A" strokeWidth="1" />

        {/* Label Content */}
        {/* Category Tag Header */}
        <rect x="62" y="102" width="76" height="12" rx="2" fill="rgba(255,255,255,0.05)" />
        <text
          x="100"
          y="110"
          fill={color}
          fontSize="7"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="1"
          textAnchor="middle"
        >
          {type.toUpperCase()} formula
        </text>

        {/* Brand Text */}
        <text
          x="100"
          y="136"
          fill="#FFFFFF"
          fontSize="18"
          fontFamily="sans-serif"
          fontWeight="900"
          letterSpacing="2.5"
          textAnchor="middle"
        >
          VALENS
        </text>

        {/* Accent Bar under Brand */}
        <rect x="80" y="144" width="40" height="1.5" fill={color} />

        {/* Core details */}
        <text
          x="100"
          y="166"
          fill="#D8C9C3"
          fontSize="7.5"
          fontFamily="sans-serif"
          fontWeight="bold"
          letterSpacing="0.5"
          textAnchor="middle"
        >
          CLINICAL DOSAGES
        </text>
        <text
          x="100"
          y="178"
          fill="#8D7B73"
          fontSize="6"
          fontFamily="sans-serif"
          letterSpacing="0.2"
          textAnchor="middle"
        >
          100% TRANSPARENT LABEL
        </text>

        {/* Premium Badge Design */}
        <circle cx="100" cy="204" r="10" fill="rgba(255,255,255,0.02)" stroke={color} strokeWidth="0.8" />
        {type === "powder" && (
          <path d="M96 206 C 96 201, 104 201, 104 206 Z" stroke={color} strokeWidth="1" fill="none" />
        )}
        {type === "capsule" && (
          <rect x="95" y="200" width="10" height="8" rx="4" stroke={color} strokeWidth="1" fill="none" transform="rotate(45 100 204)" />
        )}
        {type === "liquid" && (
          <path d="M100 198 C97 202, 97 208, 100 209 C103 208, 103 202, 100 198 Z" stroke={color} strokeWidth="1" fill="none" />
        )}

        {/* Gloss Overlay */}
        <rect x="50" y="70" width="100" height="180" rx="16" fill="url(#metalHighlight)" pointerEvents="none" />
      </svg>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockStatus === "Out of Stock") return;

    // Choose default variant/size
    const defaultSize = product.size;
    const defaultVariant = product.variants[0] || "Standard";
    addToCart(product, 1, defaultSize, defaultVariant);
  };

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      {/* Sci-Fi Frame Container — cut-corner card matching reference design exactly */}
      <div
        className="relative overflow-hidden bg-card-bg/60 backdrop-blur-sm transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgb(var(--rt-primary)/0.15)]"
        style={{
          borderRadius: "20px",
          clipPath:
            "polygon(18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0% calc(100% - 18px), 0% 18px)",
        }}
      >
        {/* Solid coral border drawn as an inset box-shadow so it follows the cut-corner clip path exactly */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: "inset 0 0 0 1.5px rgb(var(--rt-primary) / 0.6)",
          }}
        />

        {/* Top center tick mark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-primary-coral/80 rounded-full pointer-events-none z-20" />

        {/* Bottom center tick mark */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-primary-coral/80 rounded-full pointer-events-none z-20" />

        {/* Diagonal accent strokes sitting right on the cut corners */}
        <div className="absolute top-[3px] left-[-2px] w-[24px] h-[1.5px] bg-primary-coral/80 rotate-45 pointer-events-none z-20" />
        <div className="absolute top-[3px] right-[-2px] w-[24px] h-[1.5px] bg-primary-coral/80 -rotate-45 pointer-events-none z-20" />
        <div className="absolute bottom-[3px] left-[-2px] w-[24px] h-[1.5px] bg-primary-coral/80 -rotate-45 pointer-events-none z-20" />
        <div className="absolute bottom-[3px] right-[-2px] w-[24px] h-[1.5px] bg-primary-coral/80 rotate-45 pointer-events-none z-20" />

        {/* Card Content */}
        <div className="relative p-4 flex flex-col">

          {/* Badges container */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {discount > 0 && (
              <span className="rounded-full bg-accent-orange/80 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase">
                SAVE {discount}%
              </span>
            )}
            {product.bestSeller && (
              <span className="rounded-full bg-primary-coral px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-main-bg uppercase">
                Best Seller
              </span>
            )}
            {product.newArrival && (
              <span className="rounded-full border border-primary-coral/40 bg-card-bg/80 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-primary-coral uppercase">
                New
              </span>
            )}
          </div>

          {/* Stock status indicator badge */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${product.stockStatus === "In Stock"
                  ? "bg-success-green/10 text-success-green border border-success-green/20"
                  : product.stockStatus === "Low Stock"
                    ? "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${product.stockStatus === "In Stock"
                    ? "bg-success-green"
                    : product.stockStatus === "Low Stock"
                      ? "bg-primary-coral"
                      : "bg-red-500"
                  }`}
              />
              {product.stockStatus}
            </span>
          </div>

          {/* Supplement Bottle Image (Pure SVG) */}
          <div className="mb-4 mt-2 overflow-visible">
            <ProductImage color={product.imageColor} type={product.imageType} glow={true} />
          </div>

          {/* Ratings */}
          <div className="mb-1.5 flex items-center gap-1">
            <Icon name="star" size={12} className="text-primary-coral" />
            <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted-text">({product.reviews.length || 3} reviews)</span>
          </div>

          {/* Title & category */}
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-text">{product.category}</span>
            <h3 className="mt-0.5 text-base font-semibold leading-tight tracking-wide text-white group-hover:text-primary-coral transition-all duration-500 ease-out">
              {product.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-soft-text">
              {product.description}
            </p>
          </div>

          {/* Bottom price + quick add button */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-border-color">
            <div className="flex flex-col">
              {product.discountPrice ? (
                <>
                  <span className="text-[10px] text-muted-text line-through">${product.price.toFixed(2)}</span>
                  <span className="text-lg font-black text-primary-coral">${product.discountPrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-lg font-black text-white">${product.price.toFixed(2)}</span>
              )}
              <span className="text-[8px] text-muted-text uppercase tracking-wider">{product.size}</span>
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={product.stockStatus === "Out of Stock"}
              className={`flex items-center justify-center rounded-xl p-2.5 transition-all duration-500 ease-out ${product.stockStatus === "Out of Stock"
                  ? "bg-border-color text-muted-text cursor-not-allowed"
                  : "bg-border-color border border-border-color text-primary-coral hover:bg-primary-coral hover:text-main-bg hover:border-transparent"
                }`}
              title="Quick add to cart"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};