"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const { locale, showToast } = useApp();

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin creation states
  const [adminEmail, setAdminEmail] = useState("");
  const [adminFullName, setAdminFullName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // Localization
  const labels = {
    title: locale === "ar" ? "إعدادات الأمان وحماية الحساب" : "Security & Account Protection",
    subtitle: locale === "ar" ? "تحديث كلمة المرور الخاصة بحساب المدير" : "Update administrator password credentials",
    oldPassword: locale === "ar" ? "كلمة المرور الحالية" : "Current Old Password",
    newPassword: locale === "ar" ? "كلمة المرور الجديدة" : "New Password Key",
    confirmPassword: locale === "ar" ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password Key",
    submitBtn: locale === "ar" ? "تحديث كلمة المرور" : "CHANGE PASSWORD KEY",
    updatingBtn: locale === "ar" ? "جاري التحديث..." : "UPDATING PASSWORD...",
    successMsg: locale === "ar" ? "تم تحديث كلمة المرور بنجاح!" : "Password updated successfully!",
    mismatchMsg: locale === "ar" ? "كلمات المرور غير متطابقة!" : "Passwords do not match!",
    fillMsg: locale === "ar" ? "يرجى ملء جميع الحقول!" : "Please fill in all fields!",
    // Admin creation labels
    createAdminTitle: locale === "ar" ? "إنشاء حساب مدير جديد" : "Create New Admin Account",
    createAdminSubtitle: locale === "ar" ? "أضف مدير جديد للوحة التحكم" : "Add a new administrator to the dashboard",
    adminEmail: locale === "ar" ? "البريد الإلكتروني" : "Email Address",
    adminFullName: locale === "ar" ? "الاسم الكامل" : "Full Name",
    adminPhone: locale === "ar" ? "رقم الهاتف" : "Phone Number",
    adminPassword: locale === "ar" ? "كلمة المرور" : "Password",
    adminConfirmPassword: locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password",
    createAdminBtn: locale === "ar" ? "إنشاء حساب المدير" : "CREATE ADMIN ACCOUNT",
    creatingAdminBtn: locale === "ar" ? "جاري الإنشاء..." : "CREATING ACCOUNT...",
    adminCreatedMsg: locale === "ar" ? "تم إنشاء حساب المدير بنجاح!" : "Admin account created successfully!",
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast(labels.fillMsg, "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(labels.mismatchMsg, "error");
      return;
    }

    setLoading(true);
    try {
      await api.auth.changeAdminPassword({
        oldPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      showToast(labels.successMsg, "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to update password", "error");
      } else {
        showToast("Failed to update password", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminEmail || !adminFullName || !adminPhone || !adminPassword || !adminConfirmPassword) {
      showToast(labels.fillMsg, "error");
      return;
    }

    if (adminPassword !== adminConfirmPassword) {
      showToast(labels.mismatchMsg, "error");
      return;
    }

    setCreatingAdmin(true);
    try {
      await api.settings.createAdminAccount({
        email: adminEmail,
        fullName: adminFullName,
        phone: adminPhone,
        password: adminPassword,
      });

      showToast(labels.adminCreatedMsg, "success");
      setAdminEmail("");
      setAdminFullName("");
      setAdminPhone("");
      setAdminPassword("");
      setAdminConfirmPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to create admin account", "error");
      } else {
        showToast("Failed to create admin account", "error");
      }
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      <div className="border-b border-border-color pb-4">
        <span className="text-xs font-semibold text-white uppercase">
          {locale === "ar" ? "إعدادات المدير" : "Admin Account Settings"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Password Change Card */}
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full lg:max-w-lg rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4"
        >
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              {labels.title}
            </h3>
            <p className="text-3xs text-muted-text uppercase tracking-wider mt-1">
              {labels.subtitle}
            </p>
          </div>

          <div className="border-t border-border-color/30 pt-4 flex flex-col gap-4 mt-2">
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.oldPassword}
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>

            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.newPassword}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>

            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.confirmPassword}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="  cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-gray-600 transition-luxury shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? labels.updatingBtn : labels.submitBtn}
          </button>
        </form>

        {/* Create Admin Account Card */}
        <form
          onSubmit={handleCreateAdmin}
          className="w-full lg:max-w-lg rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4"
        >
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              {labels.createAdminTitle}
            </h3>
            <p className="text-3xs text-muted-text uppercase tracking-wider mt-1">
              {labels.createAdminSubtitle}
            </p>
          </div>

          <div className="border-t border-border-color/30 pt-4 flex flex-col gap-4 mt-2">
            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.adminFullName}
              </label>
              <input
                type="text"
                required
                value={adminFullName}
                onChange={(e) => setAdminFullName(e.target.value)}
                placeholder={locale === "ar" ? "أحمد محمد" : "Ahmed Mohamed"}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>

            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.adminEmail}
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@valens.com"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>

            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.adminPhone}
              </label>
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>

            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.adminPassword}
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>

            <div>
              <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                {labels.adminConfirmPassword}
              </label>
              <input
                type="password"
                required
                value={adminConfirmPassword}
                onChange={(e) => setAdminConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/30 focus:border-primary-coral focus:outline-none transition-luxury"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creatingAdmin}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-emerald-400 transition-luxury shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingAdmin ? labels.creatingAdminBtn : labels.createAdminBtn}
          </button>
        </form>
      </div>
    </div>
  );
}