"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { showToast } from "@/lib/toast";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";

export default function CheckoutPage() {
  const { cart, activeCoupon, storeSettings, placeOrder } = useApp();
  const router = useRouter();

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

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
    const price = item.product.discountPrice || item.product.price;
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
  const isFreeShipping = subtotal > 150;
  const baseShippingFee = isFreeShipping ? 0 : storeSettings.shippingCost;
  const shippingCost = shippingMethod === "Priority Air" ? baseShippingFee + 5 : baseShippingFee;

  // Tax
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * storeSettings.taxRate) / 100;

  // Grand Total
  const finalTotal = taxableAmount + shippingCost + taxAmount;

  // Form submit handler
  const handleConfirmOrder = (e: React.FormEvent) => {
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
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        variant: item.selectedVariant,
        imageColor: item.product.imageColor,
        imageType: item.product.imageType
      })),
      totalPrice: finalTotal,
      paymentMethod,
      shippingMethod,
      shippingCost,
      discountAmount,
      couponCode: activeCoupon?.code || undefined
    };

    const newOrder = placeOrder(orderPayload);
    setPlacedOrder(newOrder);
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
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                  />
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

            {/* Shipping Rates Container */}
            <div className="rounded-2xl border border-border-color bg-card-bg p-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-coral text-4xs font-bold text-main-bg">2</span>
                Shipping Courier Method
              </h2>
              
              <div className="flex flex-col gap-3">
                <label className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-luxury ${
                  shippingMethod === "Standard Express"
                    ? "border-primary-coral bg-primary-coral/5"
                    : "border-border-color bg-surface-deep"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={shippingMethod === "Standard Express"}
                      onChange={() => setShippingMethod("Standard Express")}
                      className="text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white uppercase">Standard Express</span>
                      <span className="text-3xs text-muted-text uppercase font-semibold">Delivered in 3-5 Business Days</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-primary-coral">
                    {isFreeShipping ? "FREE" : `$${storeSettings.shippingCost}`}
                  </span>
                </label>

                <label className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-luxury ${
                  shippingMethod === "Priority Air"
                    ? "border-primary-coral bg-primary-coral/5"
                    : "border-border-color bg-surface-deep"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={shippingMethod === "Priority Air"}
                      onChange={() => setShippingMethod("Priority Air")}
                      className="text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white uppercase">Priority Air Cargo</span>
                      <span className="text-3xs text-muted-text uppercase font-semibold">Delivered in 1-2 Business Days</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-primary-coral">
                    ${(isFreeShipping ? 5 : storeSettings.shippingCost + 5).toFixed(2)}
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Method Container */}
            <div className="rounded-2xl border border-border-color bg-card-bg p-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-coral text-4xs font-bold text-main-bg">3</span>
                Payment Method
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {["Credit Card", "PayPal", "Cash on Delivery"].map((method) => (
                    <label
                      key={method}
                      className={`flex-1 flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-luxury uppercase ${
                        paymentMethod === method
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

                {/* Credit Card inputs sub-drawer */}
                {paymentMethod === "Credit Card" && (
                  <div className="rounded-xl border border-border-color bg-surface-deep p-4 grid grid-cols-3 gap-4 mt-2">
                    <div className="col-span-3">
                      <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Card Number *</label>
                      <input
                        type="text"
                        required={paymentMethod === "Credit Card"}
                        placeholder="4000 1234 5678 9010"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-main-bg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-coral"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expiration Date *</label>
                      <input
                        type="text"
                        required={paymentMethod === "Credit Card"}
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-main-bg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-coral"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">CVC *</label>
                      <input
                        type="text"
                        required={paymentMethod === "Credit Card"}
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-main-bg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-coral"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal panel */}
                {paymentMethod === "PayPal" && (
                  <div className="rounded-xl border border-border-color bg-surface-deep p-4 text-center text-xs text-muted-text font-bold uppercase mt-2">
                    Redirect to PayPal payment gateway upon clicking confirm.
                  </div>
                )}
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
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedVariant}`} className="flex items-center justify-between gap-4 py-2 border-b border-border-color/30">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 bg-surface-deep border border-border-color rounded-lg p-0.5 flex items-center justify-center shrink-0">
                        <ProductImage color={item.product.imageColor} type={item.product.imageType} glow={false} className="h-8 w-full" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-2xs font-bold text-white truncate max-w-[150px]">{item.product.name}</span>
                        <span className="block text-4xs text-muted-text uppercase font-semibold">Qty: {item.quantity} • {item.selectedVariant}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-soft-text">
                      ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* pricing recap */}
              <div className="flex justify-between items-center text-2xs text-soft-text mb-2.5">
                <span>Items Subtotal</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              {activeCoupon && (
                <div className="flex justify-between items-center text-2xs text-success-green mb-2.5 font-semibold">
                  <span>Coupon Applied ({activeCoupon.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-2xs text-soft-text mb-2.5">
                <span>Shipping Fee</span>
                <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center text-2xs text-soft-text mb-4">
                <span>Sales Tax ({storeSettings.taxRate}%)</span>
                <span className="font-bold text-white">${taxAmount.toFixed(2)}</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center border-t border-border-color pt-4 text-sm font-black text-white uppercase mb-6 tracking-wider">
                <span>Grand Total</span>
                <span className="text-base text-primary-coral font-black">${finalTotal.toFixed(2)}</span>
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
                Thank you, your order <span className="text-white font-bold">{placedOrder.id}</span> has been processed successfully. A confirmation email has been dispatched to {placedOrder.customerEmail}.
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
                  <span className="font-extrabold text-primary-coral">${placedOrder.totalPrice.toFixed(2)}</span>
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
                    router.push("/products");
                  }}
                  className="rounded-full bg-primary-coral px-8 py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury"
                >
                  CONTINUE SHOPPING
                </button>
                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    router.push("/admin"); // Redirects to admin to see the order immediately!
                  }}
                  className="rounded-full border border-border-color bg-surface-deep/60 px-8 py-3.5 text-xs font-black tracking-widest text-white hover:border-primary-coral transition-luxury"
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
