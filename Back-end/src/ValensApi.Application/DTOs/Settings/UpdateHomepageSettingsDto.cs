using System.Collections.Generic;

namespace ValensApi.Application.DTOs.Settings;

public class UpdateHomepageSettingsDto
{
    public string HomepageHeroTitle { get; set; } = string.Empty;
    public string HomepageHeroSubtitle { get; set; } = string.Empty;
    public string HomepageDiscountBannerText { get; set; } = string.Empty;
    
    // Homepage images
    public string HeroImage { get; set; } = string.Empty;
    public string PromoBannerImage { get; set; } = string.Empty;
    public List<string> HomepageSliderImages { get; set; } = new();
}
