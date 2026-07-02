"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<TranslationContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'messages.required_fields': 'Please fill in all required fields.',
    'messages.no_variants_alert': 'Please add at least one variant or select \'None\'.',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.status': 'Status',
    'common.remove': 'Remove',
    'common.required': 'Required',
    'common.show': 'Show',
    'common.no_products': 'No products found',
    'common.total_products': 'Products Total',
    'common.search': 'Search...',
    'common.all_categories': 'All Categories',
    'admin.modal.tab_general': 'General',
    'admin.modal.tab_pricing': 'Pricing',
    'admin.modal.tab_media': 'Media',
    'admin.modal.tab_specs': 'Specs',
    'admin.products.title': 'Products Management',
    'admin.products.add_btn': 'Add New Product',
    'admin.modal.prod_name_en': 'Product Name (English)',
    'admin.modal.prod_name_ar': 'Product Name (Arabic)',
    'admin.modal.category_sector': 'Category',
    'admin.modal.desc_en': 'Description (English)',
    'admin.modal.desc_ar': 'Description (Arabic)',
    'admin.modal.featured': 'Featured',
    'admin.modal.bestseller': 'Best Seller',
    'admin.modal.new_arrival': 'New Arrival',
    'admin.modal.visible': 'Visible',
    'admin.modal.variant_type': 'Variant Type',
    'admin.modal.no_variants_explain': 'Select how product variants are managed.',
    'admin.modal.no_variants': 'No Variants',
    'admin.modal.size_only': 'Size Only',
    'admin.modal.flavor_only': 'Flavor Only',
    'admin.modal.both_variants': 'Size & Flavor',
    'admin.modal.size_opt': 'Size Option',
    'admin.modal.flavor_opt': 'Flavor Option',
    'admin.modal.base_price': 'Base Price',
    'admin.modal.discount_percent': 'Discount %',
    'admin.modal.stock_qty': 'Stock Quantity',
    'admin.modal.sku': 'SKU',
    'admin.modal.upload_image': 'Upload Image',
    'admin.modal.add_variant': 'Add Variant',
    'admin.modal.media_title': 'Product Media',
    'admin.modal.main_image': 'Main Image',
    'admin.modal.gallery_images': 'Gallery Images',
    'admin.modal.ingredients_en': 'Ingredients (English)',
    'admin.modal.ingredients_ar': 'Ingredients (Arabic)',
    'admin.modal.usage_en': 'Usage (English)',
    'admin.modal.usage_ar': 'Usage (Arabic)',
    'admin.modal.benefits_en': 'Benefits (English)',
    'admin.modal.benefits_ar': 'Benefits (Arabic)',
    'admin.modal.render_type': 'Render Type',
    'admin.modal.save_btn': 'Save Product',
    'admin.orders.title': 'Orders Management',
    'admin.orders.order_id': 'Order ID',
    'admin.orders.customer': 'Customer',
    'admin.orders.date': 'Date',
    'admin.orders.total': 'Total',
    'admin.orders.status_col': 'Status',
    'common.egp': 'EGP',
    'common.actions': 'Actions',
    'common.view_details': 'View Details',
    'common.status_new': 'New Order',
    'common.status_confirmed': 'Confirmed',
    'common.status_preparing': 'Preparing',
    'common.status_shipped': 'Shipped',
    'common.status_delivered': 'Delivered',
    'common.status_cancelled': 'Cancelled',
    'common.status_rejected': 'Rejected',
    'common.status_returned': 'Returned',
    'common.cancel': 'Cancel',
    'common.previous': 'Previous',
    'common.next': 'Next',
  },
  ar: {
    'messages.required_fields': 'الرجاء تعبئة جميع الحقول المطلوبة.',
    'messages.no_variants_alert': 'الرجاء إضافة متغير واحد على الأقل أو اختيار \'لا يوجد\'.',
    'common.active': 'نشط',
    'common.inactive': 'غير نشط',
    'common.status': 'الحالة',
    'common.remove': 'إزالة',
    'common.required': 'مطلوب',
    'common.show': 'عرض',
    'common.no_products': 'لم يتم العثور على منتجات',
    'common.total_products': 'إجمالي المنتجات',
    'common.search': 'بحث...',
    'common.all_categories': 'جميع التصنيفات',
    'admin.modal.tab_general': 'عام',
    'admin.modal.tab_pricing': 'التسعير',
    'admin.modal.tab_media': 'الوسائط',
    'admin.modal.tab_specs': 'المواصفات',
    'admin.products.title': 'إدارة المنتجات',
    'admin.products.add_btn': 'إضافة منتج جديد',
    'admin.modal.prod_name_en': 'اسم المنتج (الإنجليزية)',
    'admin.modal.prod_name_ar': 'اسم المنتج (العربية)',
    'admin.modal.category_sector': 'الفئة',
    'admin.modal.desc_en': 'الوصف (الإنجليزية)',
    'admin.modal.desc_ar': 'الوصف (العربية)',
    'admin.modal.featured': 'مميز',
    'admin.modal.bestseller': 'الأكثر مبيعاً',
    'admin.modal.new_arrival': 'وصل حديثاً',
    'admin.modal.visible': 'مرئي',
    'admin.modal.variant_type': 'نوع المتغير',
    'admin.modal.no_variants_explain': 'اختر كيفية إدارة متغيرات المنتج.',
    'admin.modal.no_variants': 'لا يوجد متغيرات',
    'admin.modal.size_only': 'الحجم فقط',
    'admin.modal.flavor_only': 'النكهة فقط',
    'admin.modal.both_variants': 'الحجم والنكهة',
    'admin.modal.size_opt': 'خيار الحجم',
    'admin.modal.flavor_opt': 'خيار النكهة',
    'admin.modal.base_price': 'السعر الأساسي',
    'admin.modal.discount_percent': 'نسبة الخصم',
    'admin.modal.stock_qty': 'كمية المخزون',
    'admin.modal.sku': 'رمز المنتج',
    'admin.modal.upload_image': 'تحميل صورة',
    'admin.modal.add_variant': 'إضافة متغير',
    'admin.modal.media_title': 'وسائط المنتج',
    'admin.modal.main_image': 'الصورة الرئيسية',
    'admin.modal.gallery_images': 'صور المعرض',
    'admin.modal.ingredients_en': 'المكونات (الإنجليزية)',
    'admin.modal.ingredients_ar': 'المكونات (العربية)',
    'admin.modal.usage_en': 'الاستخدام (الإنجليزية)',
    'admin.modal.usage_ar': 'الاستخدام (العربية)',
    'admin.modal.benefits_en': 'الفوائد (الإنجليزية)',
    'admin.modal.benefits_ar': 'الفوائد (العربية)',
    'admin.modal.render_type': 'نوع العرض',
    'admin.modal.save_btn': 'حفظ المنتج',
    'admin.orders.title': 'إدارة الطلبات',
    'admin.orders.order_id': 'رقم الطلب',
    'admin.orders.customer': 'العميل',
    'admin.orders.date': 'التاريخ',
    'admin.orders.total': 'الإجمالي',
    'admin.orders.status_col': 'الحالة',
    'common.egp': 'ج.م',
    'common.actions': 'الإجراءات',
    'common.view_details': 'عرض التفاصيل',
    'common.status_new': 'طلب جديد',
    'common.status_confirmed': 'مؤكد',
    'common.status_preparing': 'قيد التحضير',
    'common.status_shipped': 'تم الشحن',
    'common.status_delivered': 'تم التوصيل',
    'common.status_cancelled': 'ملغي',
    'common.status_rejected': 'مرفوض',
    'common.status_returned': 'مسترجع',
    'common.cancel': 'إلغاء',
    'common.previous': 'السابق',
    'common.next': 'التالي',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default language is English

  const t = (key: string): string => {
    return translations[language][key] || key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
