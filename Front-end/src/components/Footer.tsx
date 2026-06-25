"use client";

import React from "react";
import Link from "next/link";
import { useApp, Category } from "@/context/AppContext";

export const Footer: React.FC = () => {
  const { storeSettings, categories } = useApp();

  return (
    <footer className="w-full border-t border-border-color bg-surface-deep text-soft-text">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <span className="text-glow text-xl font-black tracking-widest text-primary-coral">
              {storeSettings.logoText}
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-muted-text">
              Formulating clinical-strength athletic supplements. Complete label transparency, lab-tested purity, and raw efficacy.
            </p>
            <div className="mt-2 flex gap-4 text-xs font-semibold text-soft-text">
              <a
                href={`https://instagram.com/${storeSettings.socialInstagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-coral transition-luxury"
              >
                Instagram
              </a>
              <a
                href={`https://twitter.com/${storeSettings.socialTwitter.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-coral transition-luxury"
              >
                Twitter
              </a>
              <a
                href={`https://facebook.com/${storeSettings.socialFacebook}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-coral transition-luxury"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">SHOP</h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              {categories.filter((c: Category) => c.visible).map((cat: Category) => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`} className="hover:text-primary-coral transition-luxury">
                    {cat.name} Formulas
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="hover:text-primary-coral transition-luxury font-semibold text-primary-coral">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">SCIENCE & BRAND</h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              <li>
                <Link href="/#science" className="hover:text-primary-coral transition-luxury">
                  The Valens Science
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-coral transition-luxury">
                  About Our Team
                </Link>
              </li>
              <li>
                <a href="#careers" className="hover:text-primary-coral transition-luxury">
                  Careers (Elite Lab)
                </a>
              </li>
              <li>
                <a href="#lab-test" className="hover:text-primary-coral transition-luxury">
                  Lab Test Certificates
                </a>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">ATHLETE SUPPORT</h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-primary-coral transition-luxury">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#shipping" className="hover:text-primary-coral transition-luxury">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-primary-coral transition-luxury">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary-coral transition-luxury">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border-color pt-8 md:flex-row text-3xs text-muted-text uppercase tracking-wider">
          <div>
            &copy; {new Date().getFullYear()} VALENS ELITE PERFORMANCE NUTRITION INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-luxury cursor-pointer">Created By Yahia Mohamed </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
