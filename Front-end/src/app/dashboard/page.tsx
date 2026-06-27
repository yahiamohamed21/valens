"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import { showToast } from "@/lib/toast";

export default function UserDashboard() {
  const {
    currentUserEmail,
    customers,
    orders,
    updateCustomer,
    cancelOrder,
    logoutUser,
  } = useApp();
  const router = useRouter();

  // Find customer record
  const currentCustomer = customers.find(
    (c) => c.email.toLowerCase() === (currentUserEmail || "").toLowerCase()
  );

  // Edit details form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Sync state with customer details when currentCustomer loads
  useEffect(() => {
    if (currentCustomer) {
      setName(currentCustomer.name);
      setPhone(currentCustomer.phone);
      setAddress(currentCustomer.address);
      setCity(currentCustomer.city);
    }
  }, [currentCustomer]);

  // If not logged in, show access prompt
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("valens_current_user");
    if (!currentUserEmail && !storedUser) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUserEmail, router]);

  if (!currentUserEmail) {
    return (
      <div className="flex min-h-screen flex-col bg-main-bg text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-coral border-r-2 mb-4"></div>
          <h2 className="text-xl font-bold uppercase tracking-wider">Accessing Profile</h2>
          <p className="mt-2 text-xs text-muted-text max-w-xs">
            Verifying athletic session credentials. Please wait or log in.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-coral px-6 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white"
          >
            LOG IN PAGE
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter orders for current user
  const userOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === currentUserEmail.toLowerCase()
  );

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Full Name is required.", "error");
      return;
    }
    updateCustomer(currentUserEmail, { name, phone, address, city });
    setIsEditing(false);
    showToast("Profile details updated successfully!", "success");
  };

  const handleLogout = () => {
    logoutUser();
    showToast("Session terminated.", "info");
    router.push("/login");
  };

  // Helper to format dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Helpers to render status badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "New Order":
        return "border-amber-500/20 bg-amber-500/5 text-amber-500";
      case "Confirmed":
        return "border-blue-500/20 bg-blue-500/5 text-blue-400";
      case "Preparing":
        return "border-purple-500/20 bg-purple-500/5 text-purple-400";
      case "Shipped / Out for Delivery":
        return "border-violet-500/20 bg-violet-500/5 text-violet-400";
      case "Delivered":
        return "border-success-green/20 bg-success-green/5 text-success-green";
      case "Cancelled":
      case "Rejected":
      case "Returned":
        return "border-rose-500/20 bg-rose-500/5 text-rose-500";
      default:
        return "border-border-color bg-surface-deep text-soft-text";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-white font-sans relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Glow ambient background */}
        <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary-coral/5 blur-[130px] pointer-events-none" />

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border-color pb-6 mb-8 gap-4">
          <div>
            <span className="text-glow text-3xs font-extrabold uppercase tracking-widest text-primary-coral">
              VALENS ATHLETE DASHBOARD
            </span>
            <h1 className="text-3xl font-black uppercase tracking-wider text-white mt-1">
              Welcome Back, {currentCustomer?.name || currentUserEmail.split("@")[0]}
            </h1>
            {currentCustomer && (
              <p className="text-3xs text-muted-text mt-1 font-semibold uppercase tracking-wider">
                Joined club: {currentCustomer.joinDate} • Tier: {currentCustomer.totalSpent > 200 ? "PRO ELITE" : "MEMBER"}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="self-start md:self-auto flex items-center gap-2 rounded-full border border-border-color bg-surface-deep px-5 py-2.5 text-2xs font-extrabold tracking-widest text-soft-text hover:text-white hover:border-rose-500/40 hover:bg-rose-500/5 transition-all duration-300 cursor-pointer"
          >
            LOGOUT PROFILE
            <Icon name="logout" size={14} />
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile & Registered Info Form (Left Panel) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 relative overflow-hidden backdrop-blur-md bg-opacity-70">
              <div className="flex justify-between items-center border-b border-border-color pb-3 mb-5">
                <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Icon name="user" size={18} className="text-primary-coral" />
                  Athlete Profile Details
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-4xs font-black uppercase tracking-widest text-primary-coral hover:underline cursor-pointer"
                  >
                    Edit
                    <Icon name="edit" size={10} />
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      Full Name
                    </span>
                    <span className="font-bold text-white text-sm">
                      {currentCustomer?.name || "Not registered"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      Email Address
                    </span>
                    <span className="font-bold text-white uppercase">
                      {currentUserEmail}
                    </span>
                  </div>
                  <div>
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      Phone Number
                    </span>
                    <span className="font-bold text-white">
                      {currentCustomer?.phone || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      City / Area
                    </span>
                    <span className="font-bold text-white">
                      {currentCustomer?.city || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      Full Delivery Address
                    </span>
                    <span className="font-bold text-white leading-relaxed">
                      {currentCustomer?.address || "Not provided"}
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveDetails} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUserEmail}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-muted-text cursor-not-allowed opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1.5">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1.5">
                      Full Delivery Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-20 rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral resize-none"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-primary-coral py-2.5 text-3xs font-black tracking-widest text-main-bg hover:bg-white transition-all duration-300 uppercase cursor-pointer"
                    >
                      SAVE PROFILE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset inputs to saved customer state
                        if (currentCustomer) {
                          setName(currentCustomer.name);
                          setPhone(currentCustomer.phone);
                          setAddress(currentCustomer.address);
                          setCity(currentCustomer.city);
                        }
                      }}
                      className="flex-1 rounded-full border border-border-color bg-surface-deep/60 py-2.5 text-3xs font-black tracking-widest text-white hover:border-primary-coral transition-all duration-300 uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Performance Stats panel */}
            {currentCustomer && (
              <div className="rounded-2xl border border-border-color bg-card-bg p-6 relative overflow-hidden backdrop-blur-md bg-opacity-70 flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-2 flex items-center gap-2">
                  <Icon name="report" size={16} className="text-primary-coral" />
                  Athlete Club Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border-color/30 bg-surface-deep/45 p-4 text-center">
                    <span className="block text-4xs font-bold text-muted-text uppercase tracking-wider">
                      Orders Count
                    </span>
                    <span className="block text-xl font-black text-white mt-1">
                      {currentCustomer.orderCount}
                    </span>
                  </div>
                  <div className="rounded-xl border border-border-color/30 bg-surface-deep/45 p-4 text-center">
                    <span className="block text-4xs font-bold text-muted-text uppercase tracking-wider">
                      Total Invested
                    </span>
                    <span className="block text-xl font-black text-primary-coral mt-1">
                      {Math.round(currentCustomer.totalSpent).toLocaleString()} EGP
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Orders Tracking Details (Right Panel) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 relative overflow-hidden backdrop-blur-md bg-opacity-70">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 flex items-center gap-2">
                <Icon name="orders" size={18} className="text-primary-coral" />
                Athlete Orders & Tracking Status
              </h2>

              {userOrders.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-surface-deep border border-border-color flex items-center justify-center text-muted-text mb-4">
                    <Icon name="box" size={24} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    No active stacks ordered
                  </h3>
                  <p className="mt-2 text-3xs text-muted-text max-w-xs mx-auto uppercase">
                    You have not placed any orders yet. Prepare your formula in catalog.
                  </p>
                  <button
                    onClick={() => router.push("/products")}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-coral px-6 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white cursor-pointer"
                  >
                    SHOP SUPPLEMENTS
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-border-color/50 bg-surface-deep/40 hover:border-border-color transition-all duration-300 p-5 flex flex-col gap-4 relative overflow-hidden"
                    >
                      {/* Order main parameters */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-color/30 pb-4">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-xs font-black text-white tracking-wide uppercase">
                            Order {order.id}
                          </span>
                          <span className="text-3xs font-semibold text-muted-text">
                            {formatDate(order.orderDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* status badge */}
                          <span
                            className={`rounded-full border px-3 py-1 text-4xs font-black uppercase tracking-widest shadow-[0_0_8px_rgba(0,0,0,0.2)] ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                          {/* cancel button */}
                          {order.status === "New Order" && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to cancel order ${order.id}?`
                                  )
                                ) {
                                  cancelOrder(order.id);
                                  showToast(`Order ${order.id} cancelled.`, "info");
                                }
                              }}
                              className="rounded-full border border-rose-500/20 bg-rose-500/5 px-2.5 py-1 text-4xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items list detail */}
                      <div className="flex flex-col gap-3">
                        {order.items.map((item, index) => (
                          <div
                            key={`${item.productId}-${index}`}
                            className="flex items-center justify-between text-2xs gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.imageColor || "#FF5226" }} />
                              <div>
                                <span className="font-bold text-white">{item.productName}</span>
                                <span className="text-3xs text-muted-text uppercase font-semibold block sm:inline sm:ml-2">
                                  {item.size} • {item.variant}
                                </span>
                              </div>
                            </div>
                            <span className="font-semibold text-soft-text text-right shrink-0">
                              {item.quantity} x {Math.round(item.price).toLocaleString()} EGP
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Cost recap summary footer */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-color/30 pt-4 mt-2 text-2xs">
                        <div className="text-3xs text-muted-text font-bold uppercase flex gap-4">
                          <span>Pay: {order.paymentMethod}</span>
                          <span>Ship: {order.shippingMethod}</span>
                        </div>
                        <div className="font-black text-white uppercase tracking-wider">
                          Grand Total:{" "}
                          <span className="text-primary-coral text-xs ml-1">
                            {Math.round(order.totalPrice).toLocaleString()} EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
