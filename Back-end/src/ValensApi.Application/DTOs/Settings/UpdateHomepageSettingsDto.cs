using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace ValensApi.Application.DTOs.Settings;

public class UpdateHomepageSettingsDto
{
    public string HomepageHeroTitle { get; set; } = string.Empty;
    public string HomepageHeroSubtitle { get; set; } = string.Empty;
    public string HomepageDiscountBannerText { get; set; } = string.Empty;
    
    // Legacy support for base64 / string URLs
    public string HeroImage { get; set; } = string.Empty;
    public string PromoBannerImage { get; set; } = string.Empty;
    public List<string> HomepageSliderImages { get; set; } = new();

    // Professional multipart uploads
    public IFormFile? HeroImageFile { get; set; }
    public IFormFile? PromoBannerImageFile { get; set; }
    public List<IFormFile>? HomepageSliderImageFiles { get; set; }
    public List<string>? ExistingSliderImages { get; set; } = new();
}
