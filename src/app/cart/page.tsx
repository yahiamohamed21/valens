"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ProductImage } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    storeSettings
  } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState("");

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      await applyCoupon(couponCodeInput.trim());
      setCouponCodeInput("");
    }
  };

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.selectedVariantPrice !== undefined ? item.selectedVariantPrice : (item.product.discountPrice || item.product.price);
    return acc + price * item.quantity;
  }, 0);

  // Discount calculation
  let discountAmount = 0;
  if (activeCoupon && subtotal >= activeCoupon.minOrderAmount) {
    if (activeCoupon.discountType === "percentage") {
      discountAmount = (subtotal * activeCoupon.discountValue) / 100;
    } else {
      discountAmount = activeCoupon.discountValue;
    }
  }
  // Shipping cost
  const shippingCost = Number(storeSettings?.shippingCost) || 0;

  // Tax calculation
  const taxRate = Number(storeSettings?.taxRate) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxRate) / 100;

  // Final Total
  const finalTotal = taxableAmount + shippingCost + taxAmount;

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black uppercase tracking-wider text-white border-b border-border-color pb-4 mb-8">
          SHOPPING CART
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cart.map((item, index) => {
                const itemPrice = item.selectedVariantPrice !== undefined ? item.selectedVariantPrice : (item.product.discountPrice || item.product.price);
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize || ""}-${item.selectedVariant || ""}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-border-color bg-card-bg p-5"
                  >
                    {/* Image & Title Info */}
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-16 bg-surface-deep border border-border-color rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.product.name}
                            width={64}
                            height={80}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ProductImage color={item.product.imageColor} type={item.product.imageType} glow={false} className="h-16 w-full" />
                        )}
                      </div>
                      <div>
                        <span className="text-4xs font-extrabold uppercase tracking-widest text-primary-coral">
                          {item.product.category}
                        </span>
                        <h3 className="text-sm font-bold text-white hover:text-primary-coral transition-luxury leading-snug">
                          <Link href={`/products/${item.product.id}`}>{item.product.name}</Link>
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-2 text-3xs font-bold text-muted-text uppercase">
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          {item.selectedSize && item.selectedVariant && <span>•</span>}
                          {item.selectedVariant && <span>Option: {item.selectedVariant}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Pricing Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-8">
                      {/* Quantity Toggles */}
                      <div className="flex items-center justify-between rounded-full border border-border-color bg-surface-deep p-1 w-28">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface-sec text-white hover:text-gray-800"
                        >
                          <Icon className="cursor-pointer" name="minus" size={10} />
                        </button>
                        <span className="text-xs font-black text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface-sec text-white hover:text-gray-800"
                        >
                          <Icon className="cursor-pointer" name="plus" size={10} />
                        </button>
                      </div>

                      {/* Pricing Info */}
                      <div className="flex flex-col text-right min-w-20">
                        <span className="text-sm font-black text-white">
                          {(itemPrice * item.quantity).toLocaleString()} EGP
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-4xs text-muted-text">({itemPrice.toLocaleString()} EGP each)</span>
                        )}
                      </div>

                      {/* Delete Trigger */}
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-muted-text hover:text-accent-orange p-1 transition-luxury"
                        title="Remove product"
                      >
                        <Icon className="cursor-pointer" name="trash" size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-2xl border border-border-color bg-card-bg p-6 glass-panel">
                <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-4 mb-4">
                  ORDER SUMMARY
                </h2>

                {/* Subtotal */}
                <div className="flex justify-between items-center text-xs text-white mb-3">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-white">{subtotal.toLocaleString()} EGP</span>
                </div>

                {/* Coupon Code Panel */}
                <div className="border-t border-b border-border-color/30 py-4 my-4">
                  {activeCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-success-green/10 border border-success-green/20 px-3 py-2 text-xs font-bold text-success-green">
                      <span className="flex items-center gap-1.5 uppercase">
                        <Icon name="tag" size={12} />
                        Code Applied: {activeCoupon.code}
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-muted-text hover:text-gray-800 transition-luxury p-1"
                        title="Remove discount"
                      >
                        <Icon name="close" size={12} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="ENTER COUPON CODE"
                        className="flex-1 rounded-xl border border-border-color bg-surface-deep px-3 py-2.5 text-2xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral uppercase"
                      />
                      <button
                        type="submit"
                        className="cursor-pointer rounded-xl border border-primary-coral bg-primary-coral/10 px-4 text-2xs font-extrabold text-primary-coral hover:bg-primary-coral hover:text-[#180f0d] transition-luxury"
                      >
                        APPLY
                      </button>
                    </form>
                  )}
                  {activeCoupon && (
                    <div className="flex justify-between items-center text-xs text-white mt-3">
                      <span>Discount ({activeCoupon.discountType === "percentage" ? `${activeCoupon.discountValue}%` : "Fixed"})</span>
                      <span className="font-bold text-success-green">-{discountAmount.toLocaleString()} EGP</span>
                    </div>
                  )}
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-xs text-white mb-3">
                  <span>Shipping & Handling</span>
                  <span className="font-bold text-white">{shippingCost.toLocaleString()} EGP</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center text-xs text-white mb-4">
                  <span>Sales Tax ({storeSettings?.taxRate || 0}%)</span>
                  <span className="font-bold text-white">{taxAmount.toLocaleString()} EGP</span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-center border-t border-border-color pt-4 text-sm font-black text-white uppercase tracking-wider mb-6">
                  <span>Grand Total</span>
                  <span className="text-lg text-primary-coral font-black">{finalTotal.toLocaleString()} EGP</span>
                </div>

                {/* Proceed Checkout Button */}
                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-4 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-luxury shadow-lg shadow-primary-coral/10 hover:scale-102 hover:shadow-[0_0_20px_rgba(255,255,255,0.45)] cursor-pointer"
                >
                  PROCEED TO CHECKOUT
                  <Icon name="arrow-right" size={14} />
                </Link>


              </div>
            </div>

          </div>
        ) : (
          /* Empty Cart State */
          <div className="rounded-3xl border border-border-color border-dashed bg-card-bg/20 py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-muted-text mb-4">
              <Icon name="cart" size={28} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Your Shopping Cart is Empty</h3>
            <p className="mt-2 text-xs text-muted-text max-w-xs mx-auto">
              You haven&apos;t added any elite supplement formulations to your stack yet. Browse our catalog to get started.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-coral px-8 py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] hover:scale-102 transition-luxury cursor-pointer"
            >
              BROWSE SUPPLEMENTS
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
