"use client";

import React from "react";
import Link from "next/link";
import { useApp, Category } from "@/context/AppContext";

export const Footer: React.FC = () => {
  const { storeSettings, categories, locale } = useApp();

  const getCategoryName = (catName: string) => {
    if (locale !== "ar") return catName;
    switch (catName.toLowerCase()) {
      case "protein": return "البروتينات";
      case "pre-workout": return "الطاقة والتحفيز";
      case "amino acids":
      case "aminos": return "الأحماض الأمينية";
      case "recovery": return "الاستشفاء والعضلات";
      default: return catName;
    }
  };

  return (
    <footer className="w-full border-t border-border-color bg-surface-deep text-soft-text">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className={`grid grid-cols-1 gap-8 md:grid-cols-4 ${locale === "ar" ? "text-right" : "text-left"}`}>
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <span className="text-glow text-xl font-black tracking-widest text-primary-coral">
              {storeSettings.logoText}
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-muted-text">
              {locale === "ar" 
                ? "صياغة مكملات رياضية ذات قوة سريرية. شفافية كاملة للبطاقات، نقاء مختبر معملياً، وفعالية خام." 
                : "Formulating clinical-strength athletic supplements. Complete label transparency, lab-tested purity, and raw efficacy."
              }
            </p>
            <div className={`mt-2 flex gap-4 text-xs font-semibold text-soft-text ${locale === "ar" ? "justify-start flex-row-reverse" : "justify-start"}`}>
              {storeSettings?.socialInstagram && (
                <a
                  href={`https://instagram.com/${storeSettings.socialInstagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-coral transition-luxury"
                >
                  Instagram
                </a>
              )}
              {storeSettings?.socialTwitter && (
                <a
                  href={`https://twitter.com/${storeSettings.socialTwitter.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-coral transition-luxury"
                >
                  Twitter
                </a>
              )}
              {storeSettings?.socialFacebook && (
                <a
                  href={`https://facebook.com/${storeSettings.socialFacebook}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-coral transition-luxury"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              {locale === "ar" ? "تسوق" : "SHOP"}
            </h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              {categories.filter((c: Category) => c.visible).map((cat: Category) => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`} className="hover:text-primary-coral transition-luxury">
                    {locale === "ar" ? `تركيبات ${getCategoryName(cat.name)}` : `${cat.name} Formulas`}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="hover:text-primary-coral transition-luxury font-semibold text-primary-coral">
                  {locale === "ar" ? "جميع المنتجات" : "All Products"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              {locale === "ar" ? "العلم والعلامة التجارية" : "SCIENCE & BRAND"}
            </h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              <li>
                <Link href="/#science" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "العلم وراء Valens" : "The Valens Science"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "من نحن (فريقنا)" : "About Our Team"}
                </Link>
              </li>
              <li>
                <a href="#careers" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "وظائف (مختبر النخبة)" : "Careers (Elite Lab)"}
                </a>
              </li>
              <li>
                <a href="#lab-test" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "شهادات الفحص المعملي" : "Lab Test Certificates"}
                </a>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              {locale === "ar" ? "دعم الرياضيين" : "ATHLETE SUPPORT"}
            </h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "اتصل بنا" : "Contact Us"}
                </Link>
              </li>
              <li>
                <a href="#shipping" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "معلومات الشحن" : "Shipping Info"}
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "المرتجعات والاسترداد" : "Returns & Refunds"}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "الأسئلة الشائعة" : "FAQs"}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border-color pt-8 md:flex-row text-3xs text-muted-text uppercase tracking-wider">
          <div className="text-center md:text-left">
            {locale === "ar" 
              ? `حقوق الطبع والنشر © ${new Date().getFullYear()} شركة VALENS لتغذية الأداء المتميز. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} VALENS ELITE PERFORMANCE NUTRITION INC. ALL RIGHTS RESERVED.`
            }
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-luxury cursor-pointer">
              {locale === "ar" ? "تم التطوير بواسطة يحيى محمد" : "Created By Yahia Mohamed"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
