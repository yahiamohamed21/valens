"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { showToast } from "@/lib/toast";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const {
    cart,
    activeCoupon,
    storeSettings,
    placeOrder,
    currentUserEmail,
    customers,
    locale,
  } = useApp();
  const router = useRouter();

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [governorates, setGovernorates] = useState<{ id: string; governorateName: string; shippingCost: number }[]>([]);

  // Fetch Governorates on mount
  useEffect(() => {
    const loadGovs = async () => {
      try {
        const data = await api.settings.governorates();
        setGovernorates(data || []);
      } catch (err) {
        console.error("Failed to load governorates for checkout dropdown", err);
      }
    };
    loadGovs();
  }, []);

  // Get logged-in user profile if exists
  const currentCustomer = useMemo(() => {
    return customers.find(
      (c) => c.email.toLowerCase() === (currentUserEmail || "").toLowerCase()
    );
  }, [customers, currentUserEmail]);

  // Autofill fields if customer is logged in
  useEffect(() => {
    if (currentCustomer) {
      if (currentCustomer.name) {
        const parts = currentCustomer.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (currentCustomer.phone) setPhone(currentCustomer.phone);
      if (currentCustomer.email) setEmail(currentCustomer.email);
      if (currentCustomer.address) setAddress(currentCustomer.address);
      if (currentCustomer.city) setCity(currentCustomer.city);
    }
  }, [currentCustomer]);

  // Options
  const [shippingMethod, setShippingMethod] = useState("Standard Express");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // Credit Card mock inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Success Modal State
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.selectedVariantPrice !== undefined ? item.selectedVariantPrice : (item.product.discountPrice || item.product.price);
    return acc + price * item.quantity;
  }, 0);

  // Discount
  let discountAmount = 0;
  if (activeCoupon && subtotal >= activeCoupon.minOrderAmount) {
    if (activeCoupon.discountType === "percentage") {
      discountAmount = (subtotal * activeCoupon.discountValue) / 100;
    } else {
      discountAmount = activeCoupon.discountValue;
    }
  }

  // Shipping Fee
  const selectedGov = governorates.find(g => g.governorateName.toLowerCase() === city.toLowerCase());
  const shippingCost = selectedGov ? selectedGov.shippingCost : storeSettings.shippingCost;

  // Tax
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * storeSettings.taxRate) / 100;

  // Grand Total
  const finalTotal = taxableAmount + shippingCost + taxAmount;

  // Form submit handler
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone || !email || !address || !city) {
      showToast("Please fill in all required shipping details.", "error");
      return;
    }

    if (paymentMethod === "Credit Card" && (!cardNumber || !cardExpiry || !cardCvc)) {
      showToast("Please enter credit card credentials.", "error");
      return;
    }

    const orderPayload = {
      customerName: `${firstName} ${lastName}`,
      customerPhone: phone,
      customerEmail: email,
      customerAddress: address,
      customerCity: city,
      notes: notes || undefined,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.selectedVariantPrice !== undefined ? item.selectedVariantPrice : (item.product.discountPrice || item.product.price),
        quantity: item.quantity,
        size: item.selectedSize || "",
        variant: item.selectedVariant || "",
        imageColor: item.product.imageColor,
        imageType: item.product.imageType,
        image: item.image || item.product.mainImage || undefined
      })),
      totalPrice: finalTotal,
      paymentMethod,
      shippingMethod,
      shippingCost,
      discountAmount,
      couponCode: activeCoupon?.code || undefined
    };

    try {
      const newOrder = await placeOrder(orderPayload);
      setPlacedOrder(newOrder);
    } catch (err) {
      // Errors are handled inside placeOrder with a toast
    }
  };

  // If cart is empty and order hasn't been placed, redirect to products
  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="flex min-h-screen flex-col bg-main-bg text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-bold uppercase tracking-wider">Checkout is Empty</h2>
          <p className="mt-2 text-xs text-muted-text max-w-xs">
            No stack is prepared for checkout. Add supplements first.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-coral px-6 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white"
          >
            CATALOG SHOP
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-white">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
        <h1 className="text-3xl font-black uppercase tracking-wider text-white border-b border-border-color pb-4 mb-8">
          SECURE CHECKOUT
        </h1>

        <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* Shipping and Payment Forms (Left Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Shipping Info Container */}
            <div className="rounded-2xl border border-border-color bg-card-bg p-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-coral text-4xs font-bold text-main-bg">1</span>
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">City / Area *</label>
                  <div className="relative">
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral appearance-none cursor-pointer pr-10"
                    >
                      <option value="" disabled>{locale === "ar" ? "اختر المحافظة" : "Select Governorate"}</option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.governorateName}>
                          {gov.governorateName} ({gov.shippingCost} EGP)
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-text">
                      <Icon name="chevron-down" size={14} />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Full Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Delivery codes, specific drop-off details..."
                    className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Container */}
            <div className="rounded-2xl border border-border-color bg-card-bg p-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-coral text-4xs font-bold text-main-bg">2</span>
                Payment Method
              </h2>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {["Cash on Delivery"].map((method) => (
                    <label
                      key={method}
                      className={`flex-1 flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-luxury uppercase ${paymentMethod === method
                        ? "border-primary-coral bg-primary-coral/5 text-primary-coral font-bold"
                        : "border-border-color bg-surface-deep text-soft-text font-semibold"
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                      />
                      <span className="text-2xs">{method}</span>
                    </label>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* Checkout review drawer (Right Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 glass-panel">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-4 mb-4">
                ORDER REVIEW
              </h2>

              {/* Items List */}
              <div className="flex flex-col gap-3 mb-6 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const itemPrice = item.selectedVariantPrice !== undefined ? item.selectedVariantPrice : (item.product.discountPrice || item.product.price);
                  return (
                    <div key={`${item.product.id}-${item.selectedSize || ""}-${item.selectedVariant || ""}`} className="flex items-center justify-between gap-4 py-2 border-b border-border-color/30">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 bg-surface-deep border border-border-color rounded-lg p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.product.name} className="h-full w-full object-contain" />
                          ) : (
                            <ProductImage color={item.product.imageColor} type={item.product.imageType} glow={false} className="h-8 w-full" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-2xs font-bold text-white truncate max-w-[150px]">{item.product.name}</span>
                          <span className="block text-4xs text-muted-text uppercase font-semibold">
                            Qty: {item.quantity}
                            {item.selectedSize && ` • ${item.selectedSize}`}
                            {item.selectedVariant && ` • ${item.selectedVariant}`}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-soft-text">
                        {(itemPrice * item.quantity).toLocaleString()} EGP
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* pricing recap */}
              <div className="flex justify-between items-center text-2xs text-soft-text mb-2.5">
                <span>Items Subtotal</span>
                <span className="font-bold text-white">{subtotal.toLocaleString()} EGP</span>
              </div>
              {activeCoupon && (
                <div className="flex justify-between items-center text-2xs text-success-green mb-2.5 font-semibold">
                  <span>Coupon Applied ({activeCoupon.code})</span>
                  <span>-{discountAmount.toLocaleString()} EGP</span>
                </div>
              )}
              <div className="flex justify-between items-center text-2xs text-soft-text mb-2.5">
                <span>Shipping Fee</span>
                <span>{shippingCost === 0 ? "FREE" : `${shippingCost.toLocaleString()} EGP`}</span>
              </div>
              <div className="flex justify-between items-center text-2xs text-soft-text mb-4">
                <span>Sales Tax ({storeSettings.taxRate}%)</span>
                <span className="font-bold text-white">{taxAmount.toLocaleString()} EGP</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t border-border-color pt-4 text-sm font-black text-white uppercase mb-6 tracking-wider">
                <span>Grand Total</span>
                <span className="text-base text-primary-coral font-black">{finalTotal.toLocaleString()} EGP</span>
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-4 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg shadow-primary-coral/10"
              >
                PLACE SECURE ORDER
                <Icon name="check" size={14} />
              </button>
            </div>
          </div>

        </form>

        {/* Order success notification overlay */}
        {placedOrder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-main-bg/95 backdrop-blur-md p-4">
            <div className="w-full max-w-xl rounded-3xl border border-border-color bg-card-bg p-8 text-center shadow-2xl glass-panel relative overflow-hidden animate-slide-in">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary-coral/5 blur-[50px] pointer-events-none" />

              {/* Checkmark icon box */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-green/10 border-2 border-success-green text-success-green mb-6 shadow-[0_0_15px_rgba(16,217,129,0.3)] animate-pulse">
                <Icon name="check" size={36} />
              </div>

              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">Order Finalized</span>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-wider text-white">ATHLETE Stack REGISTERED</h2>
              <p className="mt-4 text-xs text-soft-text max-w-md mx-auto leading-relaxed">
                Thank you, your order <span className="text-white font-bold">{placedOrder.orderName || placedOrder.id}</span> has been processed successfully. A confirmation email has been dispatched to {placedOrder.customerEmail}.
              </p>

              {/* Details box */}
              <div className="rounded-2xl border border-border-color bg-surface-deep/80 p-5 text-left text-xs text-soft-text my-6 flex flex-col gap-2.5">
                <div className="flex justify-between border-b border-border-color/30 pb-2">
                  <span>Customer Name</span>
                  <span className="font-extrabold text-white">{placedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-border-color/30 pb-2">
                  <span>Delivery Address</span>
                  <span className="font-extrabold text-white">{placedOrder.customerAddress}, {placedOrder.customerCity}</span>
                </div>
                <div className="flex justify-between border-b border-border-color/30 pb-2">
                  <span>Payment Gateway</span>
                  <span className="font-extrabold text-white uppercase">{placedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Charges Paid</span>
                  <span className="font-extrabold text-primary-coral">{placedOrder.totalPrice.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="flex items-center gap-3 justify-center text-2xs text-muted-text font-bold uppercase mb-8">
                <Icon name="clock" size={14} className="text-primary-coral" />
                <span>Estimated dispatch: 12-24 hours • Delivery in 1-4 business days</span>
              </div>

              {/* Navigation paths */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    router.push("/dashboard");
                  }}
                  className="rounded-full bg-primary-coral px-8 py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury cursor-pointer"
                >
                  GO TO MY DASHBOARD
                </button>
                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    router.push("/products");
                  }}
                  className="rounded-full border border-border-color bg-surface-deep/60 px-8 py-3.5 text-xs font-black tracking-widest text-white hover:border-primary-coral transition-luxury cursor-pointer"
                >
                  CONTINUE SHOPPING
                </button>
                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    router.push("/admin"); // Redirects to admin to see the order immediately!
                  }}
                  className="rounded-full border border-border-color bg-surface-deep/30 px-8 py-3.5 text-xs font-black tracking-widest text-soft-text hover:text-white hover:border-primary-coral transition-luxury cursor-pointer"
                >
                  VIEW ADMIN PANEL
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
