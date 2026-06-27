export type CarouselItem = {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  category?: string;
  title_ar?: string;
  category_ar?: string;
  description_ar?: string;
};

export const mockCarouselData: CarouselItem[] = [
  {
    id: "performance-lab",
    title: "Performance Lab",
    imageUrl: "https://picsum.photos/id/1048/1200/900",
    imageAlt: "Athlete training in a modern performance lab",
    description: "Clinical-grade formulas built for measurable strength, endurance, and recovery.",
    title_ar: "مختبر الأداء",
    description_ar: "تركيبات ذات درجة سريرية مصممة للقوة وقوة التحمل والاستشفاء القابلة للقياس.",
  },
  {
    id: "daily-recovery",
    title: "Daily Recovery",
    imageUrl: "https://picsum.photos/id/1060/1200/900",
    imageAlt: "Clean recovery setup with water and wellness essentials",
    description: "Support the reset phase with transparent ingredients and consistent routines.",
    title_ar: "الاستشفاء اليومي",
    description_ar: "ادعم مرحلة إعادة الضبط بمكونات شفافة وروتين متسق.",
  },
  {
    id: "clean-energy",
    title: "Clean Energy",
    imageUrl: "https://picsum.photos/id/1076/1200/900",
    imageAlt: "Runner moving through a sunlit urban training route",
    description: "Focused, smooth output without relying on hidden proprietary blends.",
    title_ar: "الطاقة النظيفة",
    description_ar: "طاقة مركزة وسلسة دون الاعتماد على خلطات احتكارية مخفية.",
  },
  {
    id: "strength-stack",
    title: "Strength Stack",
    imageUrl: "https://picsum.photos/id/1084/1200/900",
    imageAlt: "Strength training equipment arranged in a premium gym",
    description: "Temporary product imagery while the final backend media API is prepared.",
    title_ar: "بناء القوة",
    description_ar: "صور منتجات مؤقتة لحين إعداد واجهة برمجة تطبيقات الوسائط الخلفية النهائية.",
  },
  {
    id: "sleep-reset",
    title: "Sleep Reset",
    imageUrl: "https://picsum.photos/id/1025/1200/900",
    imageAlt: "Calm evening recovery environment with soft natural light",
    description: "A calmer end-of-day ritual designed around better readiness tomorrow.",
    title_ar: "ضبط النوم",
    description_ar: "طقوس نهاية اليوم الأكثر هدوءاً والمصممة للاستعداد بشكل أفضل للغد.",
  },
];
