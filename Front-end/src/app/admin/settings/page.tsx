"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";

type StoreSettings = {
  brandName: string;
  logoText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  shippingCost: number;
  taxRate: number;
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;
};

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:outline-none focus:border-primary-coral/60 focus:ring-2 focus:ring-primary-coral/15 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed";

const labelClass =
  "block text-[11px] font-bold uppercase tracking-[0.14em] text-white/50 mb-2";

const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = [
  "bg-white/10",
  "bg-red-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
];

export default function AdminSettingsPage() {
  const appContext = useApp();
  const storeSettings: StoreSettings = appContext?.storeSettings ?? {
    brandName: "",
    logoText: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    shippingCost: 0,
    taxRate: 0,
    socialInstagram: "",
    socialTwitter: "",
    socialFacebook: "",
  };
  const updateStoreSettings = appContext?.updateStoreSettings ?? (() => {});
  const showToast = appContext?.showToast ?? (() => {});

  const [contactEmail, setContactEmail] = useState(storeSettings.contactEmail);
  const [contactPhone, setContactPhone] = useState(storeSettings.contactPhone);
  const [address, setAddress] = useState(storeSettings.address);
  const [shipping, setShipping] = useState(storeSettings.shippingCost.toString());
  const [tax, setTax] = useState(storeSettings.taxRate.toString());

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOpsSubmitting, setIsOpsSubmitting] = useState(false);
  const [isCredSubmitting, setIsCredSubmitting] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  }, [newPassword]);

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmitCredentials = newPassword.length >= 8 && passwordsMatch;

  const handleOperationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpsSubmitting(true);
    updateStoreSettings({
      brandName: storeSettings.brandName,
      logoText: storeSettings.logoText,
      contactEmail,
      contactPhone,
      address,
      shippingCost: parseFloat(shipping) || 0,
      taxRate: parseFloat(tax) || 0,
      socialInstagram: storeSettings.socialInstagram,
      socialTwitter: storeSettings.socialTwitter,
      socialFacebook: storeSettings.socialFacebook,
    });
    setTimeout(() => setIsOpsSubmitting(false), 500);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitCredentials) {
      showToast("Please fix the password requirements first", "error");
      return;
    }
    setIsCredSubmitting(true);
    setTimeout(() => {
      showToast("Admin credentials updated successfully", "success");
      setNewPassword("");
      setConfirmPassword("");
      setIsCredSubmitting(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40"
      >
        <span>Admin</span>
        <span className="text-white/20">/</span>
        <span className="text-primary-coral">Settings</span>
      </nav>

      {/* Page Header */}
      <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary-coral/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-coral/5 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Store Settings
          </h1>
          <p className="text-sm text-white/50 max-w-2xl">
            Manage your store&apos;s operational variables, support channels, and admin account credentials from a single control center.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Operations Settings */}
        <section
          aria-labelledby="ops-settings-heading"
          className="group relative rounded-2xl border border-white/10 bg-card-bg/80 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-coral/50 to-transparent" aria-hidden="true" />
          <form onSubmit={handleOperationsSubmit} className="p-6 sm:p-7 flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div>
                <h2 id="ops-settings-heading" className="text-sm font-black text-white">
                  Taxes &amp; Delivery
                </h2>
                <p className="text-[11px] text-white/40 mt-0.5">Operational financial variables</p>
              </div>
            </div>

            {/* Financial inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="shipping-cost" className={labelClass}>
                  Base Shipping
                </label>
                <div className="relative">
                  <input
                    id="shipping-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    className={inputBase}
                    placeholder="0.00"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    EGP
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="tax-rate" className={labelClass}>
                  Tax Rate
                </label>
                <div className="relative">
                  <input
                    id="tax-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    className={inputBase}
                    placeholder="0.00"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Support Channels */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                  Support Channels
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Customer Service Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={inputBase}
                    placeholder="support@store.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass}>
                    Support Helpline
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={inputBase}
                    placeholder="+20 1X XXX XXXX"
                  />
                </div>
                <div>
                  <label htmlFor="office-address" className={labelClass}>
                    Office Address
                  </label>
                  <input
                    id="office-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={inputBase}
                    placeholder="Street, City, Country"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isOpsSubmitting}
              className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-coral py-3.5 text-xs font-black tracking-[0.14em] text-main-bg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-coral/20 disabled:opacity-60 disabled:active:scale-100"
            >
              {isOpsSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-main-bg/40 border-t-main-bg" />
                  SYNCING...
                </>
              ) : (
                <>
                  SYNC OPERATIONS
                  <Icon name="check" size={14} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Admin Credentials */}
        <section
          aria-labelledby="credentials-heading"
          className="group relative rounded-2xl border border-white/10 bg-card-bg/80 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-coral/50 to-transparent" aria-hidden="true" />
          <form onSubmit={handleCredentialsSubmit} className="p-6 sm:p-7 flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div>
                <h2 id="credentials-heading" className="text-sm font-black text-white">
                  Admin Credentials
                </h2>
                <p className="text-[11px] text-white/40 mt-0.5">Account security &amp; access</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            <div>
              <label htmlFor="admin-email" className={labelClass}>
                Registered Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                disabled
                value="admin@valens.com"
                className={inputBase}
                readOnly
              />
              <p className="mt-2 text-[10px] text-white/30">Email cannot be modified</p>
            </div>

            <div>
              <label htmlFor="new-password" className={labelClass}>
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className={`${inputBase} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength meter */}
              {newPassword && (
                <div className="mt-3 flex flex-col gap-1.5">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength ? strengthColors[passwordStrength] : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-medium text-white/40">
                    Strength:{" "}
                    <span className="text-white/70">{strengthLabels[passwordStrength]}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className={labelClass}>
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className={`${inputBase} ${
                  passwordsMismatch ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/15" : ""
                } ${passwordsMatch ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/15" : ""}`}
              />
              {passwordsMismatch && (
                <p className="mt-2 text-[10px] font-medium text-red-400">
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="mt-2 text-[10px] font-medium text-emerald-400">
                  Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmitCredentials || isCredSubmitting}
              className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-coral py-3.5 text-xs font-black tracking-[0.14em] text-main-bg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-coral/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isCredSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-main-bg/40 border-t-main-bg" />
                  UPDATING...
                </>
              ) : (
                <>
                  UPDATE CREDENTIALS
                  <Icon name="check" size={14} />
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}