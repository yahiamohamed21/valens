"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { HomeBanner, HomeStory, HomeCuratedProduct } from "@/types/store";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";
import { showToast } from "@/lib/toast";
import { api, resolveImageUrl } from "@/lib/api";

export default function AdminHomepageCmsPage() {
  const {
    homeBanners,
    setHomeBanners,
    homeStories,
    setHomeStories,
    homeFeaturedProducts,
    setHomeFeaturedProducts,
    homeBestSellers,
    setHomeBestSellers,
    products,
    locale
  } = useApp();

  // Active control section: "banners" | "featured" | "stories" | "bestsellers"
  const [activeTab, setActiveTab] = useState<"banners" | "featured" | "stories" | "bestsellers">("banners");

  // --- Modals state ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null);

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<HomeStory | null>(null);

  // --- Search states for product selectors ---
  const [featuredSearch, setFeaturedSearch] = useState("");
  const [bestsellerSearch, setBestsellerSearch] = useState("");

  // --- Form state: Banner ---
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState(""); // Desktop image URL/Base64
  const [bannerMobileImage, setBannerMobileImage] = useState(""); // Mobile image URL/Base64
  const [bannerCtaText, setBannerCtaText] = useState("");
  const [bannerCtaLink, setBannerCtaLink] = useState("/products");
  const [bannerIsActive, setBannerIsActive] = useState(true);

  // --- Form state: Story ---
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyImage, setStoryImage] = useState("https://picsum.photos/id/1048/1200/900");
  const [storyLink, setStoryLink] = useState("");
  const [storyIsActive, setStoryIsActive] = useState(true);

  // Open banner modal for Add
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerTitle("");
    setBannerSubtitle("");
    setBannerImage("");
    setBannerMobileImage("");
    setBannerCtaText("");
    setBannerCtaLink("/products");
    setBannerIsActive(true);
    setIsBannerModalOpen(true);
  };

  // Open banner modal for Edit
  const handleOpenEditBanner = (banner: HomeBanner) => {
    setEditingBanner(banner);
    setBannerTitle(banner.title);
    setBannerSubtitle(banner.subtitle);
    setBannerImage(banner.image);
    setBannerMobileImage(banner.mobileImage || "");
    setBannerCtaText(banner.ctaText);
    setBannerCtaLink(banner.ctaLink);
    setBannerIsActive(banner.isActive);
    setIsBannerModalOpen(true);
  };

  // ─── Banner Actions ────────────────────────────────────────────────────────
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImage || !bannerCtaLink) {
      showToast("Please upload desktop image and specify redirect link", "error");
      return;
    }

    try {
      if (editingBanner) {
        // Edit mode
        const res = await api.homeControl.banners.update(editingBanner.id, {
          title: bannerTitle,
          subtitle: bannerSubtitle,
          desktopImage: bannerImage,
          mobileImage: bannerMobileImage || "",
          ctaText: bannerCtaText,
          ctaLink: bannerCtaLink,
          altText: bannerTitle,
          isActive: bannerIsActive,
        });
        if (res && (res as any).success) {
          const updated = homeBanners.map(b => b.id === editingBanner.id ? {
            ...b,
            title: bannerTitle,
            subtitle: bannerSubtitle,
            image: bannerImage,
            mobileImage: bannerMobileImage || undefined,
            ctaText: bannerCtaText,
            ctaLink: bannerCtaLink,
            isActive: bannerIsActive
          } : b);
          setHomeBanners(updated);
          showToast("Banner details updated", "success");
        }
      } else {
        // Create mode
        const res = await api.homeControl.banners.create({
          title: bannerTitle,
          subtitle: bannerSubtitle,
          desktopImage: bannerImage,
          mobileImage: bannerMobileImage || "",
          ctaText: bannerCtaText,
          ctaLink: bannerCtaLink,
          altText: bannerTitle,
          isActive: bannerIsActive,
          displayOrder: homeBanners.length + 1
        });
        if (res && (res as any).success) {
          const newBanner: HomeBanner = {
            id: String((res as any).data.id),
            title: bannerTitle,
            subtitle: bannerSubtitle,
            image: bannerImage,
            mobileImage: bannerMobileImage || undefined,
            ctaText: bannerCtaText,
            ctaLink: bannerCtaLink,
            isActive: bannerIsActive,
            displayOrder: homeBanners.length + 1
          };
          setHomeBanners([...homeBanners, newBanner]);
          showToast("New banner added successfully", "success");
        }
      }
      setIsBannerModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save banner";
      showToast(msg, "error");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      const res = await api.homeControl.banners.delete(id);
      if (res && (res as any).success) {
        const updated = homeBanners.filter(b => b.id !== id);
        updated.forEach((b, i) => b.displayOrder = i + 1);
        setHomeBanners(updated);
        showToast("Banner deleted", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete banner";
      showToast(msg, "error");
    }
  };

  const saveBannersReorder = async (updatedBanners: HomeBanner[]) => {
    try {
      const reorderItems = updatedBanners.map((b, index) => ({ id: b.id, displayOrder: index + 1 }));
      await api.homeControl.banners.reorder(reorderItems);
    } catch (err) {
      console.error("Failed to save banners reorder in backend", err);
    }
  };

  const moveBannerUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeBanners];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((b, i) => b.displayOrder = i + 1);
    setHomeBanners(updated);
    await saveBannersReorder(updated);
  };

  const moveBannerDown = async (idx: number) => {
    if (idx === homeBanners.length - 1) return;
    const updated = [...homeBanners];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((b, i) => b.displayOrder = i + 1);
    setHomeBanners(updated);
    await saveBannersReorder(updated);
  };

  const handleToggleBannerActive = async (id: string, currentVal: boolean) => {
    try {
      const res = await api.homeControl.banners.toggle(id, !currentVal);
      if (res && (res as any).success) {
        const updated = homeBanners.map(b => b.id === id ? { ...b, isActive: !currentVal } : b);
        setHomeBanners(updated);
        showToast("Banner visibility updated", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to toggle banner visibility";
      showToast(msg, "error");
    }
  };

  // ─── Story Actions ─────────────────────────────────────────────────────────
  const handleOpenAddStory = () => {
    setEditingStory(null);
    setStoryTitle("");
    setStoryDescription("");
    setStoryImage("https://picsum.photos/id/1048/1200/900");
    setStoryLink("");
    setStoryIsActive(true);
    setIsStoryModalOpen(true);
  };

  const handleOpenEditStory = (story: HomeStory) => {
    setEditingStory(story);
    setStoryTitle(story.title);
    setStoryDescription(story.description);
    setStoryImage(story.image);
    setStoryLink(story.link || "");
    setStoryIsActive(story.isActive);
    setIsStoryModalOpen(true);
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storyDescription || !storyImage) {
      showToast("Title, description and image are required", "error");
      return;
    }

    try {
      if (editingStory) {
        const res = await api.homeControl.stories.update(editingStory.id, {
          title: storyTitle,
          description: storyDescription,
          image: storyImage,
          link: storyLink || "",
          altText: storyTitle,
          isActive: storyIsActive,
        });
        if (res && (res as any).success) {
          const updated = homeStories.map(s => s.id === editingStory.id ? {
            ...s,
            title: storyTitle,
            description: storyDescription,
            image: storyImage,
            link: storyLink || undefined,
            isActive: storyIsActive
          } : s);
          setHomeStories(updated);
          showToast("Story card updated", "success");
        }
      } else {
        const res = await api.homeControl.stories.create({
          title: storyTitle,
          description: storyDescription,
          image: storyImage,
          link: storyLink || "",
          altText: storyTitle,
          isActive: storyIsActive,
          displayOrder: homeStories.length + 1
        });
        if (res && (res as any).success) {
          const newStory: HomeStory = {
            id: String((res as any).data.id),
            title: storyTitle,
            description: storyDescription,
            image: storyImage,
            link: storyLink || undefined,
            isActive: storyIsActive,
            displayOrder: homeStories.length + 1
          };
          setHomeStories([...homeStories, newStory]);
          showToast("Story card added", "success");
        }
      }
      setIsStoryModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save story card";
      showToast(msg, "error");
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const res = await api.homeControl.stories.delete(id);
      if (res && (res as any).success) {
        const updated = homeStories.filter(s => s.id !== id);
        updated.forEach((s, i) => s.displayOrder = i + 1);
        setHomeStories(updated);
        showToast("Story deleted", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete story card";
      showToast(msg, "error");
    }
  };

  const saveStoriesReorder = async (updatedStories: HomeStory[]) => {
    try {
      const reorderItems = updatedStories.map((s, index) => ({ id: s.id, displayOrder: index + 1 }));
      await api.homeControl.stories.reorder(reorderItems);
    } catch (err) {
      console.error("Failed to save stories reorder in backend", err);
    }
  };

  const moveStoryUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeStories];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((s, i) => s.displayOrder = i + 1);
    setHomeStories(updated);
    await saveStoriesReorder(updated);
  };

  const moveStoryDown = async (idx: number) => {
    if (idx === homeStories.length - 1) return;
    const updated = [...homeStories];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((s, i) => s.displayOrder = i + 1);
    setHomeStories(updated);
    await saveStoriesReorder(updated);
  };

  const handleToggleStoryActive = async (id: string, currentVal: boolean) => {
    try {
      const res = await api.homeControl.stories.toggle(id, !currentVal);
      if (res && (res as any).success) {
        const updated = homeStories.map(s => s.id === id ? { ...s, isActive: !currentVal } : s);
        setHomeStories(updated);
        showToast("Story visibility updated", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to toggle story visibility";
      showToast(msg, "error");
    }
  };

  // ─── Featured Curator Actions ──────────────────────────────────────────────
  const handleAddFeaturedProduct = async (productId: string) => {
    if (homeFeaturedProducts.some(p => p.productId === productId)) {
      showToast("Product is already added to Featured Formulas", "error");
      return;
    }
    try {
      const res = await api.homeControl.sections.addProduct("featured_formulas", {
        productId,
        isActive: true,
        displayOrder: homeFeaturedProducts.length + 1
      });
      if (res && (res as any).success) {
        const newItem: HomeCuratedProduct = {
          id: String((res as any).data.id),
          productId,
          isActive: true,
          displayOrder: homeFeaturedProducts.length + 1
        };
        setHomeFeaturedProducts([...homeFeaturedProducts, newItem]);
        showToast("Product added to featured list", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add product";
      showToast(msg, "error");
    }
  };

  const handleRemoveFeaturedProduct = async (productId: string) => {
    const item = homeFeaturedProducts.find(p => p.productId === productId);
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.deleteProduct(item.id);
        if (res && (res as any).success) {
          const updated = homeFeaturedProducts.filter(p => p.productId !== productId);
          updated.forEach((p, i) => p.displayOrder = i + 1);
          setHomeFeaturedProducts(updated);
          showToast("Product removed from featured list", "info");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to remove product";
        showToast(msg, "error");
      }
    } else {
      const updated = homeFeaturedProducts.filter(p => p.productId !== productId);
      updated.forEach((p, i) => p.displayOrder = i + 1);
      setHomeFeaturedProducts(updated);
      showToast("Product removed from featured list", "info");
    }
  };

  const handleToggleFeaturedActive = async (productId: string, currentVal: boolean) => {
    const item = homeFeaturedProducts.find(p => p.productId === productId);
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.toggleProduct(item.id, !currentVal);
        if (res && (res as any).success) {
          const updated = homeFeaturedProducts.map(p => p.productId === productId ? { ...p, isActive: !currentVal } : p);
          setHomeFeaturedProducts(updated);
          showToast("Product visibility toggled", "success");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to toggle visibility";
        showToast(msg, "error");
      }
    } else {
      const updated = homeFeaturedProducts.map(p => p.productId === productId ? { ...p, isActive: !currentVal } : p);
      setHomeFeaturedProducts(updated);
      showToast("Product visibility toggled", "success");
    }
  };

  const saveFeaturedReorder = async (updatedFeatured: HomeCuratedProduct[]) => {
    try {
      const reorderItems = updatedFeatured
        .filter(p => !!p.id)
        .map((p, index) => ({ id: p.id!, displayOrder: index + 1 }));
      await api.homeControl.sections.reorder("featured_formulas", reorderItems);
    } catch (err) {
      console.error("Failed to save featured reorder in backend", err);
    }
  };

  const moveFeaturedUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeFeaturedProducts];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeFeaturedProducts(updated);
    await saveFeaturedReorder(updated);
  };

  const moveFeaturedDown = async (idx: number) => {
    if (idx === homeFeaturedProducts.length - 1) return;
    const updated = [...homeFeaturedProducts];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeFeaturedProducts(updated);
    await saveFeaturedReorder(updated);
  };

  // ─── Bestsellers Curator Actions ───────────────────────────────────────────
  const handleAddBestsellerProduct = async (productId: string) => {
    if (homeBestSellers.some(p => p.productId === productId)) {
      showToast("Product is already added to Bestselling Formulas", "error");
      return;
    }
    try {
      const res = await api.homeControl.sections.addProduct("best_selling_formulas", {
        productId,
        isActive: true,
        displayOrder: homeBestSellers.length + 1
      });
      if (res && (res as any).success) {
        const newItem: HomeCuratedProduct = {
          id: String((res as any).data.id),
          productId,
          isActive: true,
          displayOrder: homeBestSellers.length + 1
        };
        setHomeBestSellers([...homeBestSellers, newItem]);
        showToast("Product added to bestselling list", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add product";
      showToast(msg, "error");
    }
  };

  const handleRemoveBestsellerProduct = async (productId: string) => {
    const item = homeBestSellers.find(p => p.productId === productId);
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.deleteProduct(item.id);
        if (res && (res as any).success) {
          const updated = homeBestSellers.filter(p => p.productId !== productId);
          updated.forEach((p, i) => p.displayOrder = i + 1);
          setHomeBestSellers(updated);
          showToast("Product removed from bestselling list", "info");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to remove product";
        showToast(msg, "error");
      }
    } else {
      const updated = homeBestSellers.filter(p => p.productId !== productId);
      updated.forEach((p, i) => p.displayOrder = i + 1);
      setHomeBestSellers(updated);
      showToast("Product removed from bestselling list", "info");
    }
  };

  const handleToggleBestsellerActive = async (productId: string, currentVal: boolean) => {
    const item = homeBestSellers.find(p => p.productId === productId);
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.toggleProduct(item.id, !currentVal);
        if (res && (res as any).success) {
          const updated = homeBestSellers.map(p => p.productId === productId ? { ...p, isActive: !currentVal } : p);
          setHomeBestSellers(updated);
          showToast("Product visibility toggled", "success");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to toggle visibility";
        showToast(msg, "error");
      }
    } else {
      const updated = homeBestSellers.map(p => p.productId === productId ? { ...p, isActive: !currentVal } : p);
      setHomeBestSellers(updated);
      showToast("Product visibility toggled", "success");
    }
  };

  const saveBestsellerReorder = async (updatedBestsellers: HomeCuratedProduct[]) => {
    try {
      const reorderItems = updatedBestsellers
        .filter(p => !!p.id)
        .map((p, index) => ({ id: p.id!, displayOrder: index + 1 }));
      await api.homeControl.sections.reorder("best_selling_formulas", reorderItems);
    } catch (err) {
      console.error("Failed to save bestselling reorder in backend", err);
    }
  };

  const moveBestsellerUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeBestSellers];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeBestSellers(updated);
    await saveBestsellerReorder(updated);
  };

  const moveBestsellerDown = async (idx: number) => {
    if (idx === homeBestSellers.length - 1) return;
    const updated = [...homeBestSellers];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeBestSellers(updated);
    await saveBestsellerReorder(updated);
  };

  // Image upload helper (replaces local reader)
  const handleImageReader = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "home");
      
      showToast("Uploading image...", "info");
      const res = await api.uploads.uploadFile(formData);
      if (res && (res as any).success) {
        setter(resolveImageUrl((res as any).data.url));
        showToast("Image uploaded successfully", "success");
      } else {
        showToast("Failed to upload image", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      showToast(msg, "error");
    }
  };

  // Filter products for dropdown selectors
  const filteredFeaturedProducts = products.filter(p =>
    p.name.toLowerCase().includes(featuredSearch.toLowerCase()) &&
    !homeFeaturedProducts.some(hp => hp.productId === p.id)
  );

  const filteredBestsellerProducts = products.filter(p =>
    p.name.toLowerCase().includes(bestsellerSearch.toLowerCase()) &&
    !homeBestSellers.some(hp => hp.productId === p.id)
  );

  return (
    <div className={`flex flex-col gap-8 p-4 ${locale === "ar" ? "text-right" : "text-left"}`}>

      {/* CMS Header & Panel Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-color pb-6 gap-6">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider block">
            {locale === "ar" ? "لوحة التحكم التفاعلية بالصفحة الرئيسية" : "Homepage CMS & Curations Control"}
          </h1>
          <p className="text-xs text-muted-text uppercase font-semibold tracking-wider mt-1.5">
            Curate banners, featured lists, stories, and bestseller grids reactively
          </p>
        </div>

        {/* Tab Swappers */}
        <div className="flex flex-wrap rounded-2xl bg-surface-deep p-1.5 border border-border-color/30 gap-1.5 shadow-sm">
          {[
            { id: "banners", label: locale === "ar" ? "البانرات الإعلانية" : "Hero Banners" },
            { id: "featured", label: locale === "ar" ? "المميزة" : "Featured Formulas" },
            { id: "stories", label: locale === "ar" ? "المدونات والقصص" : "Stories & Lab Notes" },
            { id: "bestsellers", label: locale === "ar" ? "الأكثر مبيعاً" : "Best Selling" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeTab === tab.id
                  ? "bg-primary-coral text-main-bg shadow-md"
                  : "text-muted-text hover:text-foreground dark:hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Hero Banners */}
      {activeTab === "banners" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color/30 pb-5 gap-4">
            <div>
              <h3 className="text-base font-black uppercase text-white">{locale === "ar" ? "البانرات الإعلانية بالرئيسية" : "Homepage Hero Banners"}</h3>
              <p className="text-xs text-muted-text uppercase font-semibold mt-1">
                {locale === "ar"
                  ? "قم برفع صور البانرات الإعلانية الكاملة. سيتم إدراجها كشرائح متحركة."
                  : "Upload fully styled banner images. Multiple active banners will cycle as a dynamic carousel."
                }
              </p>
            </div>
            <button
              onClick={handleOpenAddBanner}
              className="rounded-xl bg-primary-coral px-5 py-3 text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-md text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg hover:scale-105 transition-all duration-300"
            >
              {locale === "ar" ? "إضافة بانر جديد" : "Add New Banner"}
              <Icon name="plus" size={14} />
            </button>
          </div>

          {homeBanners.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeBanners.sort((a, b) => a.displayOrder - b.displayOrder).map((banner, index) => (
                <div
                  key={banner.id}
                  className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    {/* Visual Preset / Upload indicator */}
                    <div className="h-20 w-32 bg-surface-deep rounded-2xl border border-border-color flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                      {["powder", "capsule", "liquid"].includes(banner.image) ? (
                        <ProductImage color="#FF8A75" type={banner.image as any} glow={false} className="h-16 w-full" />
                      ) : (
                        <img src={banner.image} alt="Banner" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block">
                        {locale === "ar" ? `شرائح البانر رقم ${index + 1}` : `Hero Banner Slide #${index + 1}`}
                      </span>
                      <span className="text-xs text-primary-coral font-bold mt-1.5 block">
                        {locale === "ar" ? "رابط التوجيه: " : "Redirect Link: "} {banner.ctaLink}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleBannerActive(banner.id, banner.isActive)}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${banner.isActive
                          ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                          : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                        }`}
                    >
                      {banner.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Disabled")}
                    </button>

                    {/* Reorders */}
                    <button
                      disabled={index === 0}
                      onClick={() => moveBannerUp(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      &uarr;
                    </button>
                    <button
                      disabled={index === homeBanners.length - 1}
                      onClick={() => moveBannerDown(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      &darr;
                    </button>

                    {/* Actions */}
                    <button
                      onClick={() => handleOpenEditBanner(banner)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all duration-200 cursor-pointer"
                      title="Edit Banner"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                      title="Delete Banner"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="eye" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">No Active Banners</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Add banners to get started.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Featured Formulas */}
      {activeTab === "featured" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div>
            <h3 className="text-base font-black uppercase text-white mb-1">Featured Formulas Showcase</h3>
            <p className="text-xs text-muted-text uppercase font-semibold">Choose which products display in the Homepage Featured grid.</p>
          </div>

          {/* Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border-color/30 pb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Search catalog to add formulas</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text pointer-events-none">
                  <Icon name="search" size={16} />
                </span>
                <input
                  type="text"
                  value={featuredSearch}
                  onChange={(e) => setFeaturedSearch(e.target.value)}
                  placeholder="Type product name..."
                  className="w-full rounded-xl border border-border-color bg-surface-deep pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary-coral transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Matching products</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddFeaturedProduct(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-sm text-white uppercase focus:outline-none cursor-pointer"
              >
                <option value="">-- Choose product to add --</option>
                {filteredFeaturedProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Curated list */}
          {homeFeaturedProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeFeaturedProducts.sort((a, b) => a.displayOrder - b.displayOrder).map((item, index) => {
                const prod = products.find(p => p.id === item.productId);
                if (!prod) return null;
                return (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="h-16 w-14 bg-card-bg border border-border-color/30 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {prod.mainImage ? (
                          <img src={prod.mainImage} alt={prod.name} className="h-full w-full object-contain" />
                        ) : (
                          <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-12 w-full" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-white block">{prod.name}</span>
                        <span className="text-xs text-muted-text font-semibold uppercase mt-1 block">{prod.category} • {prod.price.toLocaleString()} EGP</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleFeaturedActive(item.productId, item.isActive)}
                        className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${item.isActive
                            ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                            : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                          }`}
                      >
                        {item.isActive ? "Shown" : "Hidden"}
                      </button>

                      <button
                        disabled={index === 0}
                        onClick={() => moveFeaturedUp(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        &uarr;
                      </button>
                      <button
                        disabled={index === homeFeaturedProducts.length - 1}
                        onClick={() => moveFeaturedDown(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        &darr;
                      </button>

                      <button
                        onClick={() => handleRemoveFeaturedProduct(item.productId)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                        title="Remove"
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="star" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">Curator empty</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Currently displaying default featured formulas.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Performance Stories & Lab Notes */}
      {activeTab === "stories" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color/30 pb-5 gap-4">
            <div>
              <h3 className="text-base font-black uppercase text-white">Performance Stories & Lab Notes</h3>
              <p className="text-xs text-muted-text uppercase font-semibold mt-1">Manage grid blog cards shown in the swiper carousel on landing page.</p>
            </div>
            <button
              onClick={handleOpenAddStory}
              className="rounded-xl bg-primary-coral px-5 py-3 text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-md text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg hover:scale-105 transition-all duration-300"
            >
              Add New Card
              <Icon name="plus" size={14} />
            </button>
          </div>

          {homeStories.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeStories.sort((a, b) => a.displayOrder - b.displayOrder).map((story, index) => (
                <div
                  key={story.id}
                  className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="h-20 w-28 bg-surface-deep rounded-2xl border border-border-color flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                      <img src={story.image} alt={story.title} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block">{story.title}</span>
                      <span className="text-xs text-muted-text font-semibold uppercase mt-1 line-clamp-1 max-w-lg">{story.description}</span>
                      {story.link && (
                        <span className="text-xs text-accent-orange font-bold mt-1 block">Link: {story.link}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleStoryActive(story.id, story.isActive)}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${story.isActive
                          ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                          : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                        }`}
                    >
                      {story.isActive ? "Shown" : "Hidden"}
                    </button>

                    <button
                      disabled={index === 0}
                      onClick={() => moveStoryUp(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      &uarr;
                    </button>
                    <button
                      disabled={index === homeStories.length - 1}
                      onClick={() => moveStoryDown(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      &darr;
                    </button>

                    <button
                      onClick={() => handleOpenEditStory(story)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all duration-200 cursor-pointer"
                      title="Edit Card"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                      title="Delete Card"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="category" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">No stories cards</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Add cards to display stories.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Bestsellers curator */}
      {activeTab === "bestsellers" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div>
            <h3 className="text-base font-black uppercase text-white mb-1">Best Selling Formulas Showcase</h3>
            <p className="text-xs text-muted-text uppercase font-semibold">Choose which products display in the Homepage Bestselling grid.</p>
          </div>

          {/* Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border-color/30 pb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Search catalog to add formulas</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text pointer-events-none">
                  <Icon name="search" size={16} />
                </span>
                <input
                  type="text"
                  value={bestsellerSearch}
                  onChange={(e) => setBestsellerSearch(e.target.value)}
                  placeholder="Type product name..."
                  className="w-full rounded-xl border border-border-color bg-surface-deep pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary-coral transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Matching products</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddBestsellerProduct(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-sm text-white uppercase focus:outline-none cursor-pointer"
              >
                <option value="">-- Choose product to add --</option>
                {filteredBestsellerProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Curated list */}
          {homeBestSellers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeBestSellers.sort((a, b) => a.displayOrder - b.displayOrder).map((item, index) => {
                const prod = products.find(p => p.id === item.productId);
                if (!prod) return null;
                return (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="h-16 w-14 bg-card-bg border border-border-color/30 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {prod.mainImage ? (
                          <img src={prod.mainImage} alt={prod.name} className="h-full w-full object-contain" />
                        ) : (
                          <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-12 w-full" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-white block">{prod.name}</span>
                        <span className="text-xs text-muted-text font-semibold uppercase mt-1 block">{prod.category} • {prod.price.toLocaleString()} EGP</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleBestsellerActive(item.productId, item.isActive)}
                        className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${item.isActive
                            ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                            : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                          }`}
                      >
                        {item.isActive ? "Shown" : "Hidden"}
                      </button>

                      <button
                        disabled={index === 0}
                        onClick={() => moveBestsellerUp(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        &uarr;
                      </button>
                      <button
                        disabled={index === homeBestSellers.length - 1}
                        onClick={() => moveBestsellerDown(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        &darr;
                      </button>

                      <button
                        onClick={() => handleRemoveBestsellerProduct(item.productId)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                        title="Remove"
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="check" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">Curator empty</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Currently displaying default bestselling formulas.</span>
            </div>
          )}
        </div>
      )}

      {/* --- BANNER MODAL FORM (Simplified to image-only upload) --- */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <form
            onSubmit={handleSaveBanner}
            className="w-full max-w-xl rounded-3xl border border-border-color/60 bg-card-bg p-8 shadow-2xl glass-panel relative animate-slide-up flex flex-col gap-6 text-sm"
          >
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute right-5 top-5 text-muted-text hover:text-white cursor-pointer"
            >
              <Icon name="close" size={24} />
            </button>

            <h3 className="text-base font-black uppercase text-white border-b border-border-color/30 pb-4">
              {editingBanner ? "Edit Hero Banner" : "Create Hero Banner"}
            </h3>

            {/* Desktop Image File */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">Upload Desktop Image *</label>
              <span className="block text-[10px] text-muted-text uppercase font-semibold tracking-wider mb-2">
                Recommended: 1920x800 px (or 1200x500 px) | Aspect Ratio: 12:5
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageReader(e, setBannerImage)}
                className="w-full text-xs text-muted-text cursor-pointer bg-surface-deep/40 px-4 py-3 rounded-2xl border border-border-color file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:bg-primary-coral/10 file:text-primary-coral file:cursor-pointer hover:file:bg-primary-coral/20 file:transition-all"
              />
              {bannerImage && (
                <div className="mt-3 h-28 w-full rounded-xl overflow-hidden border border-border-color/50 bg-surface-deep flex items-center justify-center">
                  <img src={bannerImage} alt="Desktop Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Mobile Image File */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">Upload Mobile Image (Optional)</label>
              <span className="block text-[10px] text-muted-text uppercase font-semibold tracking-wider mb-2">
                Recommended: 750x1000 px (or 600x800 px) | Aspect Ratio: 3:4
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageReader(e, setBannerMobileImage)}
                className="w-full text-xs text-muted-text cursor-pointer bg-surface-deep/40 px-4 py-3 rounded-2xl border border-border-color file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:bg-primary-coral/10 file:text-primary-coral file:cursor-pointer hover:file:bg-primary-coral/20 file:transition-all"
              />
              {bannerMobileImage && (
                <div className="mt-3 h-24 w-20 rounded-xl overflow-hidden border border-border-color/50 bg-surface-deep flex items-center justify-center">
                  <img src={bannerMobileImage} alt="Mobile Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Redirect Target Link */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">Banner Redirect Link *</label>
              <input
                type="text"
                required
                value={bannerCtaLink}
                onChange={(e) => setBannerCtaLink(e.target.value)}
                placeholder="e.g. /products or /products?category=protein"
                className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            {/* Visibility checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="bannerActive"
                checked={bannerIsActive}
                onChange={(e) => setBannerIsActive(e.target.checked)}
                className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-5 w-5 cursor-pointer"
              />
              <label htmlFor="bannerActive" className="text-xs uppercase font-extrabold tracking-wider text-white cursor-pointer select-none">
                Enable banner visibility immediately
              </label>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="flex-1 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg transition-all uppercase cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                SAVE BANNER
              </button>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="flex-1 rounded-full border !border-border-color/60 !bg-transparent py-3.5 text-xs font-black tracking-widest !text-muted-text hover:!text-primary-coral hover:!border-primary-coral/60 transition-all uppercase cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- STORY MODAL FORM --- */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <form
            onSubmit={handleSaveStory}
            className="w-full max-w-2xl rounded-3xl border border-border-color/60 bg-card-bg p-8 shadow-2xl glass-panel relative animate-slide-up flex flex-col gap-5 text-sm"
          >
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(false)}
              className="absolute right-5 top-5 text-muted-text hover:text-white cursor-pointer"
            >
              <Icon name="close" size={24} />
            </button>

            <h3 className="text-base font-black uppercase text-white border-b border-border-color/30 pb-4 mb-2">
              {editingStory ? "Edit Story Card" : "Add Story Card"}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Story Title *</label>
              <input
                type="text"
                required
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Description *</label>
              <textarea
                required
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                className="w-full h-28 rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground resize-none focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Optional Target URL Link</label>
                <input
                  type="text"
                  value={storyLink}
                  onChange={(e) => setStoryLink(e.target.value)}
                  placeholder="e.g. /products or /about"
                  className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Upload Card Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageReader(e, setStoryImage)}
                  className="w-full text-xs text-muted-text cursor-pointer bg-surface-deep/40 px-4 py-3 rounded-2xl border border-border-color file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:bg-primary-coral/10 file:text-primary-coral file:cursor-pointer hover:file:bg-primary-coral/20 file:transition-all mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="storyActive"
                checked={storyIsActive}
                onChange={(e) => setStoryIsActive(e.target.checked)}
                className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-5 w-5 cursor-pointer"
              />
              <label htmlFor="storyActive" className="text-xs uppercase font-extrabold tracking-wider text-white cursor-pointer select-none">Enable card visibility immediately</label>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg transition-all uppercase cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                SAVE STORY CARD
              </button>
              <button
                type="button"
                onClick={() => setIsStoryModalOpen(false)}
                className="flex-1 rounded-full border !border-border-color/60 !bg-transparent py-3.5 text-xs font-black tracking-widest !text-muted-text hover:!text-primary-coral hover:!border-primary-coral/60 transition-all uppercase cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}