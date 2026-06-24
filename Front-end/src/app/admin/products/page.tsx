"use client";

import React, { useState } from "react";
import { useApp, Product } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";
import { showConfirmToast } from "@/lib/toast";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    addProduct,
    editProduct,
    deleteProduct,
    showToast,
  } = useApp();

  // Modal / Form triggers
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states - Products
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("Protein");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDiscountPrice, setProdDiscountPrice] = useState("");
  const [prodSize, setProdSize] = useState("");
  const [prodVariants, setProdVariants] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodIngredients, setProdIngredients] = useState("");
  const [prodUsage, setProdUsage] = useState("");
  const [prodBenefits, setProdBenefits] = useState("");
  const [prodImgColor, setProdImgColor] = useState("#FF8A75");
  const [prodImgType, setProdImgType] = useState<"powder" | "capsule" | "liquid">("powder");
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(false);
  const [prodVisible, setProdVisible] = useState(true);

  // Product modal open handler (reset or pre-fill)
  const openProductForm = (prod: Product | null = null) => {
    if (prod) {
      setEditingProductId(prod.id);
      setProdName(prod.name);
      setProdCategory(prod.category);
      setProdPrice(prod.price.toString());
      setProdDiscountPrice(prod.discountPrice?.toString() || "");
      setProdSize(prod.size);
      setProdVariants(prod.variants.join(", "));
      setProdStock(prod.stock.toString());
      setProdSku(prod.sku);
      setProdDesc(prod.description);
      setProdIngredients(prod.ingredients.join(", "));
      setProdUsage(prod.usage);
      setProdBenefits(prod.benefits.join("\n"));
      setProdImgColor(prod.imageColor);
      setProdImgType(prod.imageType);
      setProdFeatured(prod.featured);
      setProdBestSeller(prod.bestSeller);
      setProdNewArrival(prod.newArrival);
      setProdVisible(prod.visible);
    } else {
      setEditingProductId(null);
      setProdName("");
      setProdCategory(categories[0]?.name || "Protein");
      setProdPrice("");
      setProdDiscountPrice("");
      setProdSize("");
      setProdVariants("");
      setProdStock("");
      setProdSku("");
      setProdDesc("");
      setProdIngredients("");
      setProdUsage("");
      setProdBenefits("");
      setProdImgColor("#FF8A75");
      setProdImgType("powder");
      setProdFeatured(false);
      setProdBestSeller(false);
      setProdNewArrival(false);
      setProdVisible(true);
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock || !prodSku) {
      showToast("Please fill in core product requirements.", "error");
      return;
    }

    const payload = {
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice),
      discountPrice: prodDiscountPrice ? parseFloat(prodDiscountPrice) : undefined,
      size: prodSize || "1 Tub",
      variants: prodVariants.split(",").map((v) => v.trim()).filter(Boolean),
      stock: parseInt(prodStock),
      stockStatus: parseInt(prodStock) === 0 ? "Out of Stock" : parseInt(prodStock) <= 10 ? "Low Stock" : "In Stock" as any,
      sku: prodSku,
      description: prodDesc,
      ingredients: prodIngredients.split(",").map((i) => i.trim()).filter(Boolean),
      usage: prodUsage,
      benefits: prodBenefits.split("\n").map((b) => b.trim()).filter(Boolean),
      imageColor: prodImgColor,
      imageType: prodImgType,
      featured: prodFeatured,
      bestSeller: prodBestSeller,
      newArrival: prodNewArrival,
      visible: prodVisible,
      rating: 5.0
    };

    if (editingProductId) {
      editProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }
    setProductModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border-color pb-4">
        <span className="text-xs font-bold text-soft-text uppercase">Inventory Database</span>
        <button
          onClick={() => openProductForm(null)}
          className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
        >
          <Icon name="plus" size={14} />
          ADD FORMULATION
        </button>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">Formulation</th>
                <th className="pb-3 font-extrabold">Category</th>
                <th className="pb-3 font-extrabold">SKU</th>
                <th className="pb-3 font-extrabold">Base Price</th>
                <th className="pb-3 font-extrabold">Stock Count</th>
                <th className="pb-3 font-extrabold">Status</th>
                <th className="pb-3 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                  <td className="py-3.5 flex items-center gap-3">
                    <div className="h-10 w-8 bg-surface-deep border border-border-color rounded p-0.5 flex items-center justify-center shrink-0">
                      <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-8 w-full" />
                    </div>
                    <div>
                      <span className="block font-bold text-white">{prod.name}</span>
                      <span className="text-3xs text-muted-text font-bold uppercase">{prod.size}</span>
                    </div>
                  </td>
                  <td className="py-3.5 uppercase">{prod.category}</td>
                  <td className="py-3.5 font-mono text-3xs text-muted-text">{prod.sku}</td>
                  <td className="py-3.5 text-primary-coral font-bold">${prod.price.toFixed(2)}</td>
                  <td className="py-3.5">{prod.stock}</td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${prod.stockStatus === "In Stock"
                        ? "bg-success-green/10 text-success-green border border-success-green/20"
                        : prod.stockStatus === "Low Stock"
                          ? "bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                      {prod.stockStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right flex justify-end gap-3.5">
                    <button
                      onClick={() => editProduct(prod.id, { visible: !prod.visible })}
                      className={`p-1.5 rounded-lg border ${prod.visible
                          ? "border-success-green/20 bg-success-green/5 text-success-green hover:bg-success-green/10"
                          : "border-border-color bg-surface-deep text-muted-text hover:text-white"
                        }`}
                      title={prod.visible ? "Deactivate Visibility" : "Activate Visibility"}
                    >
                      <Icon name="power" size={14} />
                    </button>
                    <button
                      onClick={() => openProductForm(prod)}
                      className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-soft-text hover:text-primary-coral hover:border-primary-coral transition-luxury"
                      title="Edit product details"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      onClick={() => showConfirmToast(`Confirm deletion of ${prod.name}?`, () => deleteProduct(prod.id))}
                      className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-muted-text hover:text-accent-orange hover:border-accent-orange/40 transition-luxury"
                      title="Delete product"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel max-h-[90vh] overflow-y-auto animate-slide-in relative">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingProductId ? "Modify Formulation Specifications" : "Create New Supplement Formulation"}
            </h2>

            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Supplement Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Category Sector *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none uppercase"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-1">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-1">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Serving weight *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 2kg, 400g, 120 Caps"
                    value={prodSize}
                    onChange={(e) => setProdSize(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="VL-WH-2KG"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Flavors (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="Gourmet Chocolate, Rich Vanilla"
                  value={prodVariants}
                  onChange={(e) => setProdVariants(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Initial Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Product Description *</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full h-20 rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Active Ingredients (comma separated)</label>
                <input
                  type="text"
                  placeholder="Whey Isolate, Stevia, Cocoa"
                  value={prodIngredients}
                  onChange={(e) => setProdIngredients(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Suggested Usage instructions</label>
                <input
                  type="text"
                  value={prodUsage}
                  onChange={(e) => setProdUsage(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Formulation Benefits (one per line)</label>
                <textarea
                  value={prodBenefits}
                  onChange={(e) => setProdBenefits(e.target.value)}
                  className="w-full h-20 rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-1">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Cap Render Color</label>
                  <input
                    type="color"
                    value={prodImgColor}
                    onChange={(e) => setProdImgColor(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border-color bg-surface-deep px-2 py-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Render Type</label>
                  <select
                    value={prodImgType}
                    onChange={(e) => setProdImgType(e.target.value as any)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="powder">Powder</option>
                    <option value="capsule">Capsules</option>
                    <option value="liquid">Liquid</option>
                  </select>
                </div>
              </div>

              {/* Status toggles grid */}
              <div className="grid grid-cols-2 gap-3 col-span-1 justify-center py-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodBestSeller}
                    onChange={(e) => setProdBestSeller(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodNewArrival}
                    onChange={(e) => setProdNewArrival(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodVisible}
                    onChange={(e) => setProdVisible(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  Visible
                </label>
              </div>

              <div className="sm:col-span-2 mt-4">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
                >
                  SAVE SPECIFICATIONS
                  <Icon name="check" size={14} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
