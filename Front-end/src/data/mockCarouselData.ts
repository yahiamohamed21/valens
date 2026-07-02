// src/data/mockCarouselData.ts
import type { CarouselItem } from "@/types/store";

export const mockCarouselData: CarouselItem[] = [
  {
    id: "1",
    title: "Premium Powder Blend",
    imageUrl: "/images/carousel/powder1.jpg",
    imageAlt: "Premium powder supplement",
    description: "A high‑quality powder formulation for daily wellness.",
    category: "Powder",
    title_ar: "مزيج مسحوق مميز",
    category_ar: "مسحوق",
    description_ar: "تركيبة مسحوق عالية الجودة للصحة اليومية.",
  },
  {
    id: "2",
    title: "Advanced Capsule Series",
    imageUrl: "/images/carousel/capsule1.jpg",
    imageAlt: "Advanced capsules",
    description: "Targeted capsules delivering precise nutrients.",
    category: "Capsule",
    title_ar: "سلسلة كبسولات متقدمة",
    category_ar: "كبسولة",
    description_ar: "كبسولات مستهدفة توصيل العناصر الغذائية بدقة.",
  },
  {
    id: "3",
    title: "Liquid Wellness Boost",
    imageUrl: "/images/carousel/liquid1.jpg",
    imageAlt: "Liquid supplement bottle",
    description: "Fast‑absorbing liquid formula for immediate effect.",
    category: "Liquid",
    title_ar: "رفع السوائل للصحة",
    category_ar: "سائل",
    description_ar: "تركيبة سائلة سريعة الامتصاص لتأثير فوري.",
  },
];
