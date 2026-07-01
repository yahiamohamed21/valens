"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";

export default function ContactPage() {
  const { storeSettings, showToast } = useApp();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      showToast("Your support message has been dispatched. Our team will contact you shortly.", "success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center border-b border-border-color pb-6 mb-12">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">Get in touch</span>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wider text-white">
            ATHLETE SUPPORT DESK
          </h1>
          <p className="mt-2 text-xs text-white max-w-md mx-auto leading-relaxed">
            Have questions about dynamic ingredients, formulation dosages, order tracking, or bulk laboratory acquisitions? Submit your request.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Info Details Column (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Info Cards */}
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex items-start gap-4">
              <div className="rounded-xl bg-primary-coral/10 p-3 text-primary-coral shrink-0">
                <Icon name="user" size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">HEADQUARTERS</h4>
                <p className="mt-2 text-xs text-white leading-relaxed">
                  {storeSettings.address}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex items-start gap-4">
              <div className="rounded-xl bg-primary-coral/10 p-3 text-primary-coral shrink-0">
                <Icon name="orders" size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">DIRECT CHANNELS</h4>
                <p className="mt-2 text-xs text-white leading-relaxed">
                  Support Email: <a href={`mailto:${storeSettings.contactEmail}`} className="text-primary-coral hover:underline">{storeSettings.contactEmail}</a>
                </p>
                <p className="mt-1 text-xs text-white">
                  Athlete Hotline: <span className="text-white font-bold">{storeSettings.contactPhone}</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex items-start gap-4">
              <div className="rounded-xl bg-primary-coral/10 p-3 text-primary-coral shrink-0">
                <Icon name="clock" size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">LAB OPENING HOURS</h4>
                <p className="mt-2 text-xs text-white">
                  Monday – Friday: <span className="text-white">08:00 – 18:00 EST</span>
                </p>
                <p className="mt-1 text-xs text-white">
                  Saturday – Sunday: <span className="text-white">09:00 – 14:00 EST</span>
                </p>
              </div>
            </div>

            {/* Simulated map graphic */}
            <div className="rounded-2xl border border-border-color bg-surface-deep/30 p-4 h-48 flex items-center justify-center relative overflow-hidden glass-panel">
              <div className="absolute inset-0 bg-[radial-gradient(#2A1E1A_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              <div className="relative text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-coral/10 border border-primary-coral text-primary-coral mb-2">
                  <Icon name="settings" size={18} />
                </div>
                <span className="text-3xs font-extrabold uppercase tracking-widest text-white">Simulated GPS Coordinates</span>
                <span className="block text-4xs text-muted-text mt-1">{storeSettings.address.slice(0, 30)}...</span>
              </div>
            </div>

          </div>

          {/* Form message Column (Right) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 sm:p-8">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-6">
                DISPATCH SUPPORT INQUIRY
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">FullName *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                    />
                  </div>
                </div>

                <div>
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
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Message *</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="E.g. What are the specific test certificates on Iso-Whey? Or requests regarding shipment delays..."
                    className="w-full h-36 rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-4 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg shadow-primary-coral/10 hover:scale-102"
                >
                  {loading ? "SENDING..." : "DISPATCH MESSAGE"}
                  <Icon name="arrow-right" size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
