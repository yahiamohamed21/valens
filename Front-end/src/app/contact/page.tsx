"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";

export default function ContactPage() {
  const { storeSettings, showToast, locale } = useApp();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save to localStorage under valens_messages
    const newMessage = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem("valens_messages");
      const currentMessages = stored ? JSON.parse(stored) : [];
      localStorage.setItem("valens_messages", JSON.stringify([newMessage, ...currentMessages]));
    } catch (err) {
      console.error("Failed to save message to localStorage:", err);
    }

    setTimeout(() => {
      showToast(
        locale === "ar"
          ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً."
          : "Your support message has been dispatched. Our team will contact you shortly.",
        "success"
      );
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setLoading(false);
    }, 1000);
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
                  {storeSettings?.address || ""}
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
                  Support Email: <a href={`mailto:${storeSettings?.contactEmail || ""}`} className="text-primary-coral hover:underline">{storeSettings?.contactEmail || ""}</a>
                </p>
                <p className="mt-1 text-xs text-white">
                  Athlete Hotline: <span className="text-white font-bold">{storeSettings?.contactPhone || ""}</span>
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

            {/* Social Media Channels */}
            <div className="rounded-2xl border border-border-color bg-card-bg p-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color/30 pb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-coral" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {locale === "ar" ? "قنوات التواصل الاجتماعي" : "OFFICIAL SOCIAL CHANNELS"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {/* Facebook Link */}
                <a
                  href={storeSettings?.socialFacebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-deep/50 border border-border-color hover:border-[#1877F2]/80 hover:bg-[#1877F2]/5 transition-all duration-300 ease-out cursor-pointer hover:shadow-[0_0_20px_rgba(24,119,242,0.15)] text-center"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.5.5-1 1-1h2V2h-3a4 4 0 0 0-4 4v2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-white mt-3 group-hover:text-[#1877F2] transition-colors">
                    Facebook
                  </span>
                  <span className="text-[8px] text-muted-text uppercase tracking-widest mt-1">
                    {locale === "ar" ? "صفحتنا الرسمية" : "Official Page"}
                  </span>
                </a>

                {/* Instagram Link */}
                <a
                  href={storeSettings?.socialInstagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-deep/50 border border-border-color hover:border-[#ee2a7b]/80 hover:bg-[#ee2a7b]/5 transition-all duration-300 ease-out cursor-pointer hover:shadow-[0_0_20px_rgba(238,42,123,0.15)] text-center"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-[#f9ce34]/10 via-[#ee2a7b]/10 to-[#6228d7]/10 text-[#ee2a7b] group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-white mt-3 group-hover:text-[#ee2a7b] transition-colors">
                    Instagram
                  </span>
                  <span className="text-[8px] text-muted-text uppercase tracking-widest mt-1">
                    {locale === "ar" ? "تابعنا للمزيد" : "Follow Us"}
                  </span>
                </a>

                {/* WhatsApp Link */}
                <a
                  href={`https://wa.me/${(storeSettings?.contactPhone || "201000000000").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-deep/50 border border-border-color hover:border-[#25D366]/80 hover:bg-[#25D366]/5 transition-all duration-300 ease-out cursor-pointer hover:shadow-[0_0_20px_rgba(37,211,102,0.15)] text-center"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#25D366]/10 text-[#25D366] group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.967C16.58 1.921 14.112.899 11.485.9c-5.443 0-9.87 4.42-9.874 9.855-.001 1.758.465 3.479 1.348 5.025L1.815 20.89l5.344-1.401c1.554.847 3.12 1.272 4.412 1.272l.006-.008zM17.15 14.4c-.284-.141-1.68-.83-1.94-.925-.26-.095-.45-.141-.64.141-.19.283-.736.925-.903 1.114-.166.19-.333.213-.617.071-.284-.141-1.2-.442-2.286-1.411-.845-.754-1.417-1.685-1.583-1.968-.166-.283-.018-.437.124-.577.127-.126.284-.33.426-.495.143-.165.19-.283.285-.472.095-.19.047-.354-.024-.495-.071-.141-.64-1.543-.877-2.11-.23-.556-.464-.48-.64-.489-.166-.008-.356-.01-.546-.01-.19 0-.5.071-.76.354-.26.283-.997.974-.997 2.378 0 1.404 1.021 2.76 1.163 2.949.143.19 2.01 3.067 4.869 4.297.68.293 1.21.468 1.623.599.683.217 1.306.186 1.8.113.55-.082 1.68-.687 1.916-1.352.237-.665.237-1.235.166-1.352-.07-.118-.26-.188-.544-.33z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-white mt-3 group-hover:text-[#25D366] transition-colors">
                    WhatsApp
                  </span>
                  <span className="text-[8px] text-muted-text uppercase tracking-widest mt-1">
                    {locale === "ar" ? "دردشة مباشرة" : "Direct Chat"}
                  </span>
                </a>
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
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-4 text-xs font-black tracking-widest text-[#180f0d] hover:text-[#180f0d] hover:bg-white transition-luxury shadow-lg shadow-primary-coral/10 hover:scale-102 cursor-pointer"
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
