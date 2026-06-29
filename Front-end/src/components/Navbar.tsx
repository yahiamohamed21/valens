"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, CartItem } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { Icon } from "./SvgIcons";

export const Navbar: React.FC = () => {
  const { cart, homePageSettings, currentUserEmail, currentUserRole, locale, t } = useApp();
  const { setIsPanelOpen } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const totalItems = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-color bg-main-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-glow text-2xl font-black tracking-widest text-primary-coral transition-luxury group-hover:text-white">
              {homePageSettings.logoText}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral transition-luxury"
            >
              {t("storefront.navbar.products")}
            </Link>
            <Link
              href="/#science"
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral transition-luxury"
            >
              {locale === "ar" ? "الأبحاث العلمية" : "Science"}
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral transition-luxury"
            >
              {locale === "ar" ? "عن Valens" : "About"}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral transition-luxury"
            >
              {t("storefront.navbar.contact")}
            </Link>
           </nav>
        </div>

        {/* Search, Cart & Account */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("storefront.navbar.search")}
              className={`w-56 rounded-full border border-border-color bg-surface-deep px-4 py-2 text-xs text-white placeholder-muted-text focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/30 transition-luxury ${
                locale === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
              }`}
            />
            <Icon
              name="search"
              size={14}
              className={`absolute top-1/2 -translate-y-1/2 text-muted-text ${
                locale === "ar" ? "right-3.5" : "left-3.5"
              }`}
            />
          </form>



          {/* Account */}
          <Link
            href={
              currentUserEmail
                ? currentUserRole === "Admin"
                  ? "/admin"
                  : "/dashboard"
                : "/login"
            }
            className={`flex items-center justify-center hover:text-primary-coral transition-luxury ${
              currentUserEmail ? "text-primary-coral" : "text-soft-text"
            }`}
            title={
              currentUserEmail
                ? currentUserRole === "Admin"
                  ? "Admin Dashboard"
                  : "Athlete Dashboard"
                : "Account"
            }
          >
            <Icon name="user" size={20} />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center text-soft-text hover:text-primary-coral transition-luxury"
            title="Shopping Cart"
          >
            <Icon name="cart" size={20} />
            {totalItems > 0 && (
              <span className={`absolute -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-orange text-3xs font-extrabold text-white shadow-[0_0_8px_#FF5226] ${
                locale === "ar" ? "-left-2.5" : "-right-2.5"
              }`}>
                {totalItems}
              </span>
            )}
          </Link>

        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">


          <Link href="/cart" className="relative flex items-center justify-center text-soft-text">
            <Icon name="cart" size={20} />
            {totalItems > 0 && (
              <span className={`absolute -top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-orange text-4xs font-extrabold text-white ${
                locale === "ar" ? "-left-2" : "-right-2"
              }`}>
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center text-soft-text"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-border-color bg-main-bg px-4 py-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("storefront.navbar.search")}
              className={`w-full rounded-full border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text focus:border-primary-coral focus:outline-none ${
                locale === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
              }`}
            />
            <Icon
              name="search"
              size={14}
              className={`absolute top-1/2 -translate-y-1/2 text-muted-text ${
                locale === "ar" ? "right-3.5" : "left-3.5"
              }`}
            />
          </form>

          <nav className="flex flex-col gap-4 px-2">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral"
            >
              {t("storefront.navbar.products")}
            </Link>
            <Link
              href="/#science"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral"
            >
              {locale === "ar" ? "الأبحاث العلمية" : "Science"}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral"
            >
              {locale === "ar" ? "عن Valens" : "About"}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-soft-text hover:text-primary-coral"
            >
              {t("storefront.navbar.contact")}
            </Link>
            <Link
              href={
                currentUserEmail
                  ? currentUserRole === "Admin"
                    ? "/admin"
                    : "/dashboard"
                  : "/login"
              }
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold tracking-wide hover:text-primary-coral ${
                currentUserEmail ? "text-primary-coral" : "text-soft-text"
              }`}
            >
              {currentUserEmail ? (
                currentUserRole === "Admin"
                  ? (locale === "ar" ? "لوحة التحكم للمسؤول" : "Admin Dashboard")
                  : (locale === "ar" ? "لوحة التحكم للرياضيين" : "Athlete Dashboard")
              ) : t("storefront.navbar.login")}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block rounded-xl border border-primary-coral/20 bg-primary-coral/5 py-2 text-center text-xs font-bold tracking-wider text-primary-coral"
            >
              {t("storefront.navbar.admin")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
