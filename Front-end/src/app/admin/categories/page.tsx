"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";

export default function AdminCategoriesPage() {
  const appContext = useApp();
  const categories = appContext?.categories ?? [];
  const addCategory = appContext?.addCategory ?? (() => {});
  const editCategory = appContext?.editCategory ?? (() => {});
  const deleteCategory = appContext?.deleteCategory ?? (() => {});

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#FF8A75");
  const [catVisible, setCatVisible] = useState(true);

  const openCreateModal = () => {
    setEditingCategoryId(null);
    setCatName("");
    setCatColor("#FF8A75");
    setCatVisible(true);
    setCategoryModalOpen(true);
  };

  const openEditModal = (cat: { id: string; name: string; imageColor: string; visible: boolean }) => {
    setEditingCategoryId(cat.id);
    setCatName(cat.name);
    setCatColor(cat.imageColor);
    setCatVisible(cat.visible);
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategoryId) {
      editCategory(editingCategoryId, { name: catName, imageColor: catColor, visible: catVisible });
      setEditingCategoryId(null);
    } else {
      addCategory({ name: catName, imageColor: catColor, visible: catVisible });
    }
    setCatName("");
    setCategoryModalOpen(false);
  };

  const activeCount = categories.filter((c) => c.visible).length;

  return (
    <>
      <div className="flex flex-col gap-8 min-h-screen">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-color">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Goal Sectors</h1>
            <p className="text-xs text-muted-text mt-1">
              {categories.length} total &middot; {activeCount} active
            </p>
          </div>
          <button
            onClick={openCreateModal}
            aria-label="Create new category"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-coral px-5 py-2.5 text-xs font-black tracking-widest text-main-bg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-md whitespace-nowrap"
          >
            <Icon name="plus" size={14} />
            CREATE CATEGORY
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total", value: categories.length, color: "text-white" },
            { label: "Active", value: activeCount, color: "text-green-400" },
            { label: "Hidden", value: categories.length - activeCount, color: "text-muted-text" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border-color bg-card-bg px-4 py-3 flex flex-col gap-1">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text">{stat.label}</span>
              <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <section aria-label="Product categories list">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <article
                  key={cat.id}
                  className="group rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col gap-4 hover:border-primary-coral/40 transition-all duration-200"
                >
                  {/* Top Row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-border-color"
                      style={{ backgroundColor: `${cat.imageColor}18` }}
                      aria-hidden="true"
                    >
                      <Icon name="category" size={18} style={{ color: cat.imageColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-black text-white truncate">{cat.name}</h2>
                      <p className="text-3xs font-mono text-muted-text truncate mt-0.5">{cat.slug}</p>
                    </div>
                    <span
                      className={`text-3xs font-extrabold uppercase px-2.5 py-1 rounded-full border flex-shrink-0 ${
                        cat.visible
                          ? "bg-green-500/10 text-green-400 border-green-500/20" :"bg-muted-text/10 text-muted-text border-muted-text/20"
                      }`}
                    >
                      {cat.visible ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {/* Color Swatch */}
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-md border border-border-color flex-shrink-0"
                      style={{ backgroundColor: cat.imageColor }}
                      aria-hidden="true"
                    />
                    <code className="text-3xs font-mono text-muted-text">{cat.imageColor}</code>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border-color">
                    <button
                      onClick={() => editCategory(cat.id, { visible: !cat.visible })}
                      className="flex-1 rounded-lg border border-border-color bg-surface-deep py-1.5 text-2xs font-bold text-soft-text hover:text-white hover:border-white/20 transition-all duration-150"
                      aria-label={cat.visible ? `Hide ${cat.name}` : `Show ${cat.name}`}
                    >
                      {cat.visible ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-soft-text hover:text-primary-coral hover:border-primary-coral/40 transition-all duration-150"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      onClick={() => showConfirmToast(`Delete "${cat.name}"?`, () => deleteCategory(cat.id))}
                      className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-muted-text hover:text-red-400 hover:border-red-400/40 transition-all duration-150"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-color bg-card-bg p-16 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary-coral/10 flex items-center justify-center">
                <Icon name="category" size={24} style={{ color: "#FF8A75" }} />
              </div>
              <p className="text-sm font-bold text-white">No categories yet</p>
              <p className="text-xs text-muted-text mt-1">Create your first category to organize products.</p>
              <button
                onClick={openCreateModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-coral px-5 py-2.5 text-xs font-black tracking-widest text-main-bg hover:opacity-90 transition-all"
              >
                <Icon name="plus" size={14} />
                CREATE CATEGORY
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {categoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cat-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-border-color bg-card-bg p-6 shadow-2xl relative">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-text hover:text-white hover:bg-surface-deep transition-all"
              aria-label="Close modal"
            >
              <Icon name="close" size={18} />
            </button>

            <h2 id="cat-modal-title" className="text-base font-black text-white mb-5 pb-4 border-b border-border-color">
              {editingCategoryId ? "Edit Category" : "New Category"}
            </h2>

            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="cat-name" className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Category Name <span className="text-primary-coral">*</span>
                </label>
                <input
                  id="cat-name"
                  type="text"
                  required
                  placeholder="e.g. Endurance, Power"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-sm text-white placeholder-muted-text/40 focus:outline-none focus:border-primary-coral/60 focus:ring-1 focus:ring-primary-coral/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="cat-color" className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="cat-color"
                    type="color"
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                    className="h-10 w-14 rounded-lg border border-border-color bg-surface-deep cursor-pointer"
                  />
                  <code className="text-xs font-mono text-muted-text">{catColor}</code>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border-color hover:bg-surface-deep/60 transition-all">
                <input
                  type="checkbox"
                  checked={catVisible}
                  onChange={(e) => setCatVisible(e.target.checked)}
                  className="h-4 w-4 rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-soft-text">Visible in shop menu</span>
              </label>

              <button
                type="submit"
                className="mt-1 w-full rounded-xl bg-primary-coral py-3 text-xs font-black tracking-widest text-main-bg hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
              >
                {editingCategoryId ? "SAVE CHANGES" : "CREATE CATEGORY"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
