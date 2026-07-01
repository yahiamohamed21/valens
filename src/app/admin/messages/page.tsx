"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";

interface UserMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { locale, showToast, storeSettings, updateStoreSettings } = useApp();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Store Contact Info States
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  // Sync Contact Info states when storeSettings loads
  useEffect(() => {
    if (storeSettings) {
      setAddress(storeSettings.address || "");
      setContactEmail(storeSettings.contactEmail || "");
      setContactPhone(storeSettings.contactPhone || "");
      setSocialFacebook(storeSettings.socialFacebook || "");
      setSocialInstagram(storeSettings.socialInstagram || "");
    }
  }, [storeSettings]);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("valens_messages");
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load messages from localStorage:", err);
    }
  }, []);

  // Reset pagination page on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDeleteMessage = (id: string) => {
    try {
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      localStorage.setItem("valens_messages", JSON.stringify(updated));
      showToast(
        locale === "ar" ? "تم حذف الرسالة بنجاح." : "Message deleted successfully.",
        "success"
      );
    } catch (err) {
      showToast(
        locale === "ar" ? "فشل حذف الرسالة." : "Failed to delete message.",
        "error"
      );
    }
  };

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateStoreSettings({
        ...storeSettings,
        address: address.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        socialFacebook: socialFacebook.trim(),
        socialInstagram: socialInstagram.trim(),
      });
      showToast(
        locale === "ar" ? "تم تحديث معلومات الاتصال بالمتجر بنجاح!" : "Store contact information updated successfully!",
        "success"
      );
    } catch (err) {
      showToast(
        locale === "ar" ? "فشل تحديث معلومات الاتصال." : "Failed to update contact settings.",
        "error"
      );
    } finally {
      setSavingSettings(false);
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter((m) => {
    const term = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.phone.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getLabels = () => {
    if (locale === "ar") {
      return {
        title: "صندوق الرسائل الواردة",
        subtitle: "رسائل وتواصل العملاء",
        searchPlaceholder: "البحث بالاسم، البريد، الهاتف أو نص الرسالة...",
        sender: "المرسل",
        contactDetails: "معلومات الاتصال",
        messageText: "الرسالة",
        date: "التاريخ",
        actions: "الإجراءات",
        deleteConfirm: "تأكيد حذف هذه الرسالة نهائياً؟",
        emptyMessages: "لا توجد رسائل واردة حالياً.",
        viewDetail: "عرض التفاصيل",
        delete: "حذف",
        close: "إغلاق",
        reply: "الرد عبر البريد",
        phoneLabel: "الهاتف:",
        emailLabel: "البريد الإلكتروني:",
        nameLabel: "الاسم:",
        dateLabel: "أرسلت في:",
        // Contact Settings Panel Labels
        settingsTitle: "بيانات الاتصال بالصفحة الرئيسية",
        settingsSubtitle: "تعديل معلومات التواصل لصفحة Contact",
        headquartersInput: "العنوان الرئيسي (Headquarters) *",
        emailInput: "البريد الإلكتروني للدعم (Support Email) *",
        hotlineInput: "رقم الهاتف / الواتساب (WhatsApp & Hotline) *",
        facebookInput: "رابط صفحة الفيسبوك (Facebook Link)",
        instagramInput: "رابط صفحة الإنستغرام (Instagram Link)",
        saveBtn: "حفظ بيانات الاتصال",
        savingBtn: "جاري الحفظ...",
      };
    }
    return {
      title: "Inbox Messages",
      subtitle: "Customer contact form inquiries",
      searchPlaceholder: "Search by name, email, phone or content...",
      sender: "Sender",
      contactDetails: "Contact Info",
      messageText: "Message",
      date: "Date",
      actions: "Actions",
      deleteConfirm: "Confirm permanent deletion of this message?",
      emptyMessages: "No messages in inbox currently.",
      viewDetail: "View Details",
      delete: "Delete",
      close: "Close",
      reply: "Reply via Email",
      phoneLabel: "Phone:",
      emailLabel: "Email:",
      nameLabel: "Name:",
      dateLabel: "Received on:",
      // Contact Settings Panel Labels
      settingsTitle: "Contact Info Controls",
      settingsSubtitle: "Update front-end contact page details",
      headquartersInput: "Headquarters Address *",
      emailInput: "Support Email *",
      hotlineInput: "WhatsApp & Athlete Hotline *",
      facebookInput: "Facebook Link",
      instagramInput: "Instagram Link",
      saveBtn: "SAVE CONTACT SETTINGS",
      savingBtn: "SAVING SETTINGS...",
    };
  };

  const labels = getLabels();

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`} dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-border-color pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">
          {labels.subtitle}
        </span>
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">
          {labels.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List (Left Column) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          {/* Search bar */}
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 pl-10 text-xs text-white placeholder-muted-text/50 focus:border-primary-coral focus:outline-none transition-luxury"
            />
            <div className={`absolute ${locale === "ar" ? "right-3" : "left-3"} top-3.5 text-muted-text/50`}>
              <Icon name="search" size={14} />
            </div>
          </div>

          {filteredMessages.length > 0 ? (
            <div className="rounded-2xl border border-border-color bg-card-bg/25 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border-color bg-surface-deep/45 text-[10px] font-black uppercase tracking-wider text-muted-text">
                      <th className="px-6 py-4 text-start">{labels.sender}</th>
                      <th className="px-6 py-4 text-start">{labels.contactDetails}</th>
                      <th className="px-6 py-4 text-start">{labels.messageText}</th>
                      <th className="px-6 py-4 text-start">{labels.date}</th>
                      <th className={`px-6 py-4 ${locale === "ar" ? "text-start" : "text-end"}`}>{labels.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color/30 text-xs text-white font-bold">
                    {paginatedMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        className="hover:bg-surface-sec/15 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 font-black">
                          {msg.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5 font-normal">
                            <span className="font-semibold text-white">{msg.email}</span>
                            {msg.phone && (
                              <span className="text-4xs font-mono text-muted-text">
                                {msg.phone}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate font-medium text-muted-text" title={msg.message}>
                          {msg.message}
                        </td>
                        <td className="px-6 py-4 font-mono text-[10px] text-muted-text font-normal">
                          {new Date(msg.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex gap-2 ${locale === "ar" ? "justify-start" : "justify-end"}`}>
                            <button
                              onClick={() => setSelectedMessage(msg)}
                              className="rounded-lg border border-primary-coral/20 bg-primary-coral/10 text-primary-coral px-2.5 py-1 text-4xs font-extrabold uppercase transition-luxury hover:bg-primary-coral hover:text-[#180f0d] cursor-pointer"
                            >
                              {labels.viewDetail}
                            </button>
                            <button
                              onClick={() =>
                                showConfirmToast(labels.deleteConfirm, () =>
                                  handleDeleteMessage(msg.id)
                                )
                              }
                              className="rounded-lg border cursor-pointer border-border-color bg-surface-deep p-1.5 text-muted-text hover:text-accent-orange hover:border-accent-orange transition-luxury"
                              title={labels.delete}
                            >
                              <Icon name="trash" size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer Controls */}
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-border-color/30 bg-surface-deep/30 rounded-b-2xl ${
                locale === "ar" ? "sm:flex-row-reverse" : ""
              }`}>
                {/* Entries Info */}
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-text">
                  {locale === "ar"
                    ? `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${Math.min(currentPage * itemsPerPage, filteredMessages.length)} من أصل ${filteredMessages.length} رسالة`
                    : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredMessages.length)} of ${filteredMessages.length} messages`}
                </span>

                {/* Page Navigation */}
                <div className={`flex items-center gap-3.5 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-color bg-surface-deep/50 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-[#180f0d] hover:border-white transition-all duration-300 disabled:opacity-20 disabled:hover:bg-surface-deep/50 disabled:hover:text-white disabled:hover:border-border-color cursor-pointer shadow-sm"
                  >
                    <Icon name={locale === "ar" ? "chevron-right" : "chevron-left"} size={10} />
                    {locale === "ar" ? "السابق" : "PREV"}
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 rounded-xl border text-[11px] font-black transition-all duration-200 cursor-pointer flex items-center justify-center ${
                            currentPage === pageNum
                              ? "border-primary-coral bg-primary-coral text-[#180f0d] shadow-md shadow-primary-coral/15"
                              : "border-border-color bg-surface-deep/50 text-white hover:border-primary-coral/50 hover:text-primary-coral"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-color bg-surface-deep/50 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-[#180f0d] hover:border-white transition-all duration-300 disabled:opacity-20 disabled:hover:bg-surface-deep/50 disabled:hover:text-white disabled:hover:border-border-color cursor-pointer shadow-sm"
                  >
                    {locale === "ar" ? "التالي" : "NEXT"}
                    <Icon name={locale === "ar" ? "chevron-left" : "chevron-right"} size={10} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border-color border-dashed bg-card-bg/20 py-20 text-center text-xs text-muted-text">
              {labels.emptyMessages}
            </div>
          )}
        </div>

        {/* Contact Info Edit Form (Right Column) */}
        <div className="lg:col-span-4 w-full">
          <form
            onSubmit={handleSaveContactSettings}
            className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4 sticky top-6"
          >
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                <Icon name="settings" size={14} className="text-primary-coral" />
                {labels.settingsTitle}
              </h3>
              <p className="text-4xs text-muted-text uppercase tracking-wider mt-1">
                {labels.settingsSubtitle}
              </p>
            </div>

            <div className="border-t border-border-color/30 pt-4 flex flex-col gap-4 mt-2">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {labels.headquartersInput}
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral resize-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {labels.emailInput}
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {labels.hotlineInput}
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {labels.facebookInput}
                </label>
                <input
                  type="text"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {labels.instagramInput}
                </label>
                <input
                  type="text"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-luxury shadow-lg shadow-primary-coral/10 hover:scale-102 cursor-pointer"
              >
                {savingSettings ? labels.savingBtn : labels.saveBtn}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Message Modal Detail view */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel relative animate-slide-up">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute right-4 top-4 text-muted-text hover:text-primary-coral dark:hover:text-white cursor-pointer"
            >
              <Icon name="close" size={20} />
            </button>

            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 flex items-center gap-2">
              <Icon name="mail" size={18} className="text-primary-coral" />
              {locale === "ar" ? "تفاصيل الرسالة الواردة" : "Contact Inquiry Details"}
            </h2>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-surface-deep/40 p-4 rounded-2xl border border-border-color/30">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">{labels.nameLabel}</span>
                  <span className="text-white font-bold mt-1 text-sm">{selectedMessage.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">{labels.dateLabel}</span>
                  <span className="text-white font-mono mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
                  </span>
                </div>
                {selectedMessage.email && (
                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">{labels.emailLabel}</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary-coral font-bold mt-1 break-all hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                )}
                {selectedMessage.phone && (
                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">{labels.phoneLabel}</span>
                    <span className="text-white mt-1 font-mono font-bold">{selectedMessage.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">{labels.messageText}</span>
                <div className="bg-surface-deep border border-border-color rounded-2xl p-4 text-white text-sm font-medium whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto custom-scrollbar select-text">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border-color/30 pt-4 mt-6">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-full border border-border-color bg-surface-deep px-5 py-2.5 text-2xs font-extrabold tracking-widest text-white hover:text-primary-coral hover:border-primary-coral transition-luxury cursor-pointer"
                >
                  {labels.close}
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Valens Support Inquiry&body=Hi ${selectedMessage.name},%0D%0A%0D%0A`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-coral px-6 py-2.5 text-2xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-luxury cursor-pointer shadow-lg shadow-primary-coral/15"
                >
                  <Icon name="arrow-right" size={12} />
                  {labels.reply}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
