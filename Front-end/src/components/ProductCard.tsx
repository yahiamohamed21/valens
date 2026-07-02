"use client";

import React, { useRef, useState, useEffect } from "react";
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

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { addToCart, locale, t } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockStatus === "Out of Stock" || isAdding) return;

    setIsAdding(true);

    // Choose default variant/size details safely
    const defaultSize = product.variants?.[0]?.size || product.size || "";
    const defaultFlavor = product.variants?.[0]?.flavor || "";
    const defaultPrice = product.variants?.[0]?.price !== undefined ? product.variants[0].price : (product.discountPrice || product.price);
    const defaultSku = product.variants?.[0]?.sku || product.sku;
    const defaultImage = product.variants?.[0]?.image || product.mainImage || undefined;

    setTimeout(() => {
      addToCart(
        product,
        1,
        defaultSize || undefined,
        defaultFlavor || undefined,
        defaultPrice,
        defaultSku,
        defaultImage
      );
      setIsAdding(false);
    }, 400); // 400ms visual micro-animation
  };

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const w = dimensions.width || 280;
  const h = dimensions.height || 470;

  // Custom sci-fi panel path with corner chamfers and side notch steps
  const pathData = `M 16,0 
    L ${w - 16},0 
    L ${w},16 
    L ${w},${h / 2 - 12} 
    L ${w - 4},${h / 2 - 8} 
    L ${w - 4},${h / 2 + 8} 
    L ${w},${h / 2 + 12} 
    L ${w},${h - 16} 
    L ${w - 16},${h} 
    L 16,${h} 
    L 0,${h - 16} 
    L 0,${h / 2 + 12} 
    L 4,${h / 2 + 8} 
    L 4,${h / 2 - 8} 
    L 0,${h / 2 - 12} 
    L 0,16 
    Z`;

  // Bracket highlight lines
  const topLeftBracket = `M 0,28 L 0,16 L 16,0 L 28,0`;
  const topLeftBracketInner = `M 4,28 L 4,18 L 18,4 L 28,4`;

  const topRightBracket = `M ${w - 28},0 L ${w - 16},0 L ${w},16 L ${w},28`;
  const topRightBracketInner = `M ${w - 28},4 L ${w - 18},4 L ${w - 4},18 L ${w - 4},28`;

  const bottomRightBracket = `M ${w},${h - 28} L ${w},${h - 16} L ${w - 16},${h} L ${w - 28},${h}`;
  const bottomRightBracketInner = `M ${w - 4},${h - 28} L ${w - 4},${h - 18} L ${w - 18},${h - 4} L ${w - 28},${h - 4}`;

  const bottomLeftBracket = `M 28,${h} L 16,${h} L 0,${h - 16} L 0,${h - 28}`;
  const bottomLeftBracketInner = `M 28,${h - 4} L 18,${h - 4} L 4,${h - 18} L 4,${h - 28}`;

  return (
    <Link href={`/products/${product.id}`} className="group block relative">
      <div
        ref={containerRef}
        className="relative overflow-visible p-5 flex flex-col h-full min-h-[470px] transition-all duration-500"
      >
        {/* Cyberpunk SVG Frame Background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`cardGrad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--rt-card-bg))" stopOpacity="0.95" />
              <stop offset="100%" stopColor="rgb(var(--rt-surface-sec))" stopOpacity="0.98" />
            </linearGradient>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.06" />
            </filter>
          </defs>

          {/* Main Card Shape Fill & Border */}
          <path
            d={pathData}
            fill={`url(#cardGrad-${product.id})`}
            className="stroke-border-color group-hover:stroke-primary-coral/45 transition-all duration-500"
            strokeWidth="1.5"
            filter="url(#card-shadow)"
          />

          {/* Glowing Corner Brackets */}
          {/* Top-Left */}
          <path
            d={topLeftBracket}
            fill="none"
            className="stroke-primary-coral/55 group-hover:stroke-primary-coral transition-all duration-500"
            strokeWidth="2"
            filter="url(#neon-glow)"
          />
          <path
            d={topLeftBracketInner}
            fill="none"
            className="stroke-accent-orange/25 group-hover:stroke-accent-orange/55 transition-all duration-500"
            strokeWidth="1"
          />

          {/* Top-Right */}
          <path
            d={topRightBracket}
            fill="none"
            className="stroke-primary-coral/55 group-hover:stroke-primary-coral transition-all duration-500"
            strokeWidth="2"
            filter="url(#neon-glow)"
          />
          <path
            d={topRightBracketInner}
            fill="none"
            className="stroke-accent-orange/25 group-hover:stroke-accent-orange/55 transition-all duration-500"
            strokeWidth="1"
          />

          {/* Bottom-Right */}
          <path
            d={bottomRightBracket}
            fill="none"
            className="stroke-primary-coral/55 group-hover:stroke-primary-coral transition-all duration-500"
            strokeWidth="2"
            filter="url(#neon-glow)"
          />
          <path
            d={bottomRightBracketInner}
            fill="none"
            className="stroke-accent-orange/25 group-hover:stroke-accent-orange/55 transition-all duration-500"
            strokeWidth="1"
          />

          {/* Bottom-Left */}
          <path
            d={bottomLeftBracket}
            fill="none"
            className="stroke-primary-coral/55 group-hover:stroke-primary-coral transition-all duration-500"
            strokeWidth="2"
            filter="url(#neon-glow)"
          />
          <path
            d={bottomLeftBracketInner}
            fill="none"
            className="stroke-accent-orange/25 group-hover:stroke-accent-orange/55 transition-all duration-500"
            strokeWidth="1"
          />

          {/* Additional visual accents on corners */}
          {/* Top-Left ticks */}
          <line x1="0" y1="16" x2="-4" y2="16" className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />
          <line x1="16" y1="0" x2="16" y2="-4" className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />
          
          {/* Top-Right ticks */}
          <line x1={w} y1="16" x2={w + 4} y2="16" className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />
          <line x1={w - 16} y1="0" x2={w - 16} y2="-4" className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />

          {/* Bottom-Right ticks */}
          <line x1={w} y1={h - 16} x2={w + 4} y2={h - 16} className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />
          <line x1={w - 16} y1={h} x2={w - 16} y2={h + 4} className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />

          {/* Bottom-Left ticks */}
          <line x1="0" y1={h - 16} x2="-4" y2={h - 16} className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />
          <line x1="16" y1={h} x2="16" y2={h + 4} className="stroke-primary-coral/40 group-hover:stroke-primary-coral transition-all duration-500" strokeWidth="1.5" />
        </svg>

        {/* Content Container (relative z-10 for layout stack) */}
        <div className="relative z-10 flex flex-col justify-between h-full flex-1">
          {/* Top Badges & Status */}
          <div className="flex justify-between items-start w-full">
            {/* Promo tags */}
            <div className="flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="self-start rounded bg-accent-orange/90 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-white uppercase shadow-sm">
                  {locale === "ar" ? `وفر ${discount}%` : `SAVE ${discount}%`}
                </span>
              )}
              {product.bestSeller && (
                <span className="self-start rounded bg-primary-coral px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-main-bg uppercase shadow-sm">
                  {locale === "ar" ? "شائع" : "HOT"}
                </span>
              )}
              {product.newArrival && (
                <span className="self-start rounded border border-primary-coral/30 bg-card-bg/95 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-primary-coral uppercase shadow-sm">
                  {locale === "ar" ? "جديد" : "NEW"}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                product.stockStatus === "In Stock"
                  ? "bg-success-green/10 text-success-green border border-success-green/20"
                  : product.stockStatus === "Low Stock"
                    ? "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              <span
                className={`h-1 w-1 rounded-full ${
                  product.stockStatus === "In Stock"
                     ? "bg-success-green"
                     : product.stockStatus === "Low Stock"
                       ? "bg-primary-coral"
                       : "bg-red-500"
                }`}
              />
              {product.stockStatus === "In Stock" 
                ? (locale === "ar" ? "متوفر" : "In Stock") 
                : product.stockStatus === "Low Stock"
                  ? (locale === "ar" ? "مخزون منخفض" : "Low Stock")
                  : (locale === "ar" ? "نفد من المخزون" : "Out of Stock")
              }
            </span>
          </div>

          {/* Supplement Bottle Image */}
          <div className="my-2 overflow-visible flex items-center justify-center flex-1 min-h-[170px] relative">
            {product.mainImage ? (
              <img
              src={product.mainImage}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-40 w-full object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-all duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100'%20height='100'%20fill='%231e1310'/%3E%3Ctext%20x='50'%20y='55'%20font-family='sans-serif'%20font-size='10'%20fill='%238d7b73'%20text-anchor='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";
              }}
            />
            ) : (
              <ProductImage color={product.imageColor} type={product.imageType} glow={true} className="h-44 w-full" />
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col gap-1.5 mt-auto">
            {/* Title and Price Row */}
            <div className={`flex justify-between items-start gap-2 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
              <h3 className={`text-base font-extrabold tracking-wide uppercase text-white group-hover:text-primary-coral transition-colors duration-300 line-clamp-2 ${locale === "ar" ? "text-right" : "text-left"}`}>
                {locale === "ar" && product.name_ar ? product.name_ar : product.name}
              </h3>
              <span className="text-base font-extrabold text-primary-coral whitespace-nowrap">
                {Math.round(product.discountPrice || product.price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>

            {/* Ratings and Reviews */}
            <div className={`flex items-center gap-1 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
              <div className="flex text-primary-coral">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Icon
                    key={idx}
                    name="star"
                    size={10}
                    className={idx < Math.floor(product.rating) ? "text-primary-coral fill-primary-coral" : "text-muted-text"}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-white ml-1">({product.reviews.length || 120} {locale === "ar" ? "تقييم" : "Reviews"})</span>
            </div>

            {/* Description */}
            <p className={`text-xs text-muted-text line-clamp-2 leading-relaxed min-h-[32px] ${locale === "ar" ? "text-right" : "text-left"}`}>
              {locale === "ar" && product.description_ar ? product.description_ar : product.description}
            </p>

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              disabled={product.stockStatus === "Out of Stock" || isAdding}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 mt-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                product.stockStatus === "Out of Stock"
                  ? "bg-border-color text-muted-text cursor-not-allowed"
                  : isAdding
                    ? "bg-[#10D981] text-white cursor-wait opacity-90 shadow-[0_0_15px_rgba(16,217,129,0.3)]"
                    : "bg-primary-coral text-[#180f0d] hover:bg-white hover:text-[#180f0d] hover:scale-102 active:scale-98 shadow-[0_0_15px_rgba(255,138,117,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] cursor-pointer"
              }`}
            >
              {isAdding ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  {locale === "ar" ? "جاري الإضافة..." : "Adding..."}
                </>
              ) : (
                <>
                  <Icon name="cart" size={14} />
                  {locale === "ar" ? "إضافة سريعة" : "Quick Add"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
});
