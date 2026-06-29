using System.Collections.Generic;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class StoreSetting : BaseEntity
{
    // Store settings
    public string BrandName { get; set; } = "VALENS";
    public string LogoText { get; set; } = "VALENS";
    public string ContactEmail { get; set; } = "elite@valens.com";
    public string ContactPhone { get; set; } = "+1 (800) 825-3677";
    public string Address { get; set; } = "88 Science & Athletics Drive, Sector 4, CA 90210";
    public decimal ShippingCost { get; set; } = 60; // 60 EGP
    public decimal FreeShippingThreshold { get; set; } = 1500; // 1500 EGP
    public decimal TaxRate { get; set; } = 5; // 5%
    public string SocialInstagram { get; set; } = "@valens_nutrition";
    public string SocialTwitter { get; set; } = "@valens_performance";
    public string SocialFacebook { get; set; } = "valens.elite";

    // Homepage settings
    public string HomepageHeroTitle { get; set; } = "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE";
    public string HomepageHeroSubtitle { get; set; } = "Engineered for elite athletes. Premium supplements formulated with clinical dosages, clean ingredients, and zero compromises.";
    public string HeroCtaText { get; set; } = "SHOP THE NUTRITION";
    public string HeroCtaLink { get; set; } = "/products";
    public string FirstBannerTitle { get; set; } = "THE VALENS FORMULA";
    public string FirstBannerSubtitle { get; set; } = "Cold-filtered processing, zero artificial coloring, complete transparency. We don't hide behind proprietary blends. What you see is exactly what powers you.";
    public string FirstBannerCtaText { get; set; } = "DISCOVER THE SCIENCE";
    public string PromoBadge { get; set; } = "ELITE PERFORMANCE LINE";

    // Arabic translation fields
    public string? HeroTitleAr { get; set; } = "مُصمم برؤية علمية، مُنفجر بقوة الأداء";
    public string? HeroSubtitleAr { get; set; } = "مُهندس خصيصاً للرياضيين النخبة. مكملات فاخرة مُصممة بجرعات سريرية ومكونات نظيفة وبدون تنازلات.";
    public string? HeroCtaTextAr { get; set; } = "تسوق التغذية الفاخرة";
    public string? FirstBannerTitleAr { get; set; } = "تركيبة VALENS النخبوية";
    public string? FirstBannerSubtitleAr { get; set; } = "معالجة بالفلترة الباردة، خالية تمامًا من الألوان الاصطناعية، وشفافية مطلقة للبطاقات. لا نختبئ خلف تركيبات احتكارية مبهمة.";
    public string? FirstBannerCtaTextAr { get; set; } = "اكتشف الجانب العلمي";
    public string? PromoBadgeAr { get; set; } = "خط الأداء الرياضي الفاخر";

    // Homepage image fields
    public string HeroImage { get; set; } = string.Empty;
    public string PromoBannerImage { get; set; } = string.Empty;
    public List<string> HomepageSliderImages { get; set; } = new();
}
