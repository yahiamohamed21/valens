"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";

export default function AdminSettingsPage() {
  const { storeSettings, updateStoreSettings, showToast } = useApp();

  // Form states - Store Settings
  const [setContactEmail, setSetContactEmail] = useState(storeSettings.contactEmail);
  const [setContactPhone, setSetContactPhone] = useState(storeSettings.contactPhone);
  const [setAddress, setSetAddress] = useState(storeSettings.address);
  const [setShipping, setSetShipping] = useState(storeSettings.shippingCost.toString());
  const [setTax, setSetTax] = useState(storeSettings.taxRate.toString());

  // Global settings submit
  const handleGlobalSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      brandName: storeSettings.brandName,
      logoText: storeSettings.logoText,
      contactEmail: setContactEmail,
      contactPhone: setContactPhone,
      address: setAddress,
      shippingCost: parseFloat(setShipping) || 0,
      taxRate: parseFloat(setTax) || 0,
      socialInstagram: storeSettings.socialInstagram,
      socialTwitter: storeSettings.socialTwitter,
      socialFacebook: storeSettings.socialFacebook
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border-color pb-4">
        <span className="text-xs font-bold text-soft-text uppercase font-semibold">Store configurations</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Store variables settings */}
        <form onSubmit={handleGlobalSettingsSubmit} className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Operational Taxes & Delivery fees</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Base Shipping Cost (EGP)</label>
              <input
                type="number"
                value={setShipping}
                onChange={(e) => setSetShipping(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">State Tax Rate (%)</label>
              <input
                type="number"
                value={setTax}
                onChange={(e) => setSetTax(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="border-t border-border-color/30 pt-4 mt-2 flex flex-col gap-4">
            <h4 className="text-2xs font-black uppercase tracking-widest text-white">Support Channels Contact</h4>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Customer Service Email</label>
              <input
                type="email"
                value={setContactEmail}
                onChange={(e) => setSetContactEmail(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Support Helpline Phone</label>
              <input
                type="text"
                value={setContactPhone}
                onChange={(e) => setSetContactPhone(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Office Address</label>
              <input
                type="text"
                value={setAddress}
                onChange={(e) => setSetAddress(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-4"
          >
            SYNC OPERATION VARIABLES
            <Icon name="check" size={14} />
          </button>
        </form>

        {/* Profile credentials configurations */}
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Admin Profile Credentials</h3>

          <div>
            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Registered Admin Email</label>
            <input
              type="email"
              disabled
              value="admin@valens.com"
              className="w-full rounded-xl border border-border-color bg-surface-deep/40 px-4 py-2.5 text-xs text-muted-text cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">New Password Key</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Confirm New Password Key</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            onClick={() => showToast("Admin profile credentials saved", "success")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-auto"
          >
            SAVE PROFILE CREDENTIALS
            <Icon name="check" size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
