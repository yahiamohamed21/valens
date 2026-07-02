using System.Collections.Generic;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class StoreSetting : BaseEntity
{
    public decimal ShippingCost { get; set; } = 60; // 60 EGP
    public decimal FreeShippingThreshold { get; set; } = 1500; // 1500 EGP
    public string ContactPhone { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string SocialTikTok { get; set; } = string.Empty;
    
    // Homepage settings
    public string HomepageHeroTitle { get; set; } = "Premium Sports & Nutritional Supplements";
    public string HomepageHeroSubtitle { get; set; } = "Fuel your body with the highest quality formulations.";
    public string HomepageDiscountBannerText { get; set; } = "Get 10% off your first order! Use code: FIRST10";

    // Homepage image fields
    public string HeroImage { get; set; } = string.Empty;
    public string PromoBannerImage { get; set; } = string.Empty;
    public List<string> HomepageSliderImages { get; set; } = new();
}
