"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";

export default function AdminCategoriesPage() {
  const {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
  } = useApp();

  // Category modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Form states - Categories
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#FF8A75");
  const [catVisible, setCatVisible] = useState(true);

  // Category Form Submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    if (editingCategoryId) {
      editCategory(editingCategoryId, { name: catName, imageColor: catColor, visible: catVisible });
      setEditingCategoryId(null);
    } else {
      addCategory({ name: catName, imageColor: catColor, visible: catVisible });
    }
    setCatName("");
    setCategoryModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border-color pb-4">
        <span className="text-xs font-bold text-soft-text uppercase font-semibold">Goal Sectors</span>
        <button
          onClick={() => {
            setEditingCategoryId(null);
            setCatName("");
            setCatColor("#FF8A75");
            setCatVisible(true);
            setCategoryModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
        >
          <Icon name="plus" size={14} />
          CREATE CATEGORY
        </button>
      </div>

      {/* Grid categories panel */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center border border-border-color"
                  style={{ backgroundColor: `${cat.imageColor}10` }}
                >
                  <Icon name="category" size={18} style={{ color: cat.imageColor }} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">{cat.name}</h3>
                  <span className="text-4xs font-mono text-muted-text">SLUG: {cat.slug}</span>
                </div>
              </div>

              <span className={`inline-block px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase ${cat.visible ? "bg-success-green/10 text-success-green" : "bg-muted-text/10 text-muted-text"
                }`}>
                {cat.visible ? "ACTIVE" : "HIDDEN"}
              </span>
            </div>

            <div className="mt-6 flex gap-2 justify-end border-t border-border-color pt-4">
              <button
                onClick={() => editCategory(cat.id, { visible: !cat.visible })}
                className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-soft-text hover:text-white"
              >
                {cat.visible ? "Hide from Shop" : "Show in Shop"}
              </button>
              <button
                onClick={() => {
                  setEditingCategoryId(cat.id);
                  setCatName(cat.name);
                  setCatColor(cat.imageColor);
                  setCatVisible(cat.visible);
                  setCategoryModalOpen(true);
                }}
                className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-soft-text hover:text-primary-coral hover:border-primary-coral"
              >
                <Icon name="edit" size={14} />
              </button>
              <button
                onClick={() => showConfirmToast(`Confirm deletion of ${cat.name}?`, () => deleteCategory(cat.id))}
                className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-muted-text hover:text-accent-orange"
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORY ADD / EDIT MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingCategoryId ? "Edit Goal Category" : "Add Goal Category"}
            </h2>

            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Endurance, Power"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Accent Theme Color</label>
                <input
                  type="color"
                  value={catColor}
                  onChange={(e) => setCatColor(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border-color bg-surface-deep px-2 py-1 cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text mt-2">
                <input
                  type="checkbox"
                  checked={catVisible}
                  onChange={(e) => setCatVisible(e.target.checked)}
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                />
                Show Category in Shop Menu
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-4"
              >
                SAVE CATEGORY
                <Icon name="check" size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
