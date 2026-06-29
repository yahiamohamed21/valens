using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Settings;

public class HomePageSettingsResponseDto
{
    [JsonPropertyName("brandName")]
    public string BrandName { get; set; } = string.Empty;

    [JsonPropertyName("logoText")]
    public string LogoText { get; set; } = string.Empty;

    [JsonPropertyName("heroTitle")]
    public string HeroTitle { get; set; } = string.Empty;

    [JsonPropertyName("heroSubtitle")]
    public string HeroSubtitle { get; set; } = string.Empty;

    [JsonPropertyName("heroCtaText")]
    public string HeroCtaText { get; set; } = string.Empty;

    [JsonPropertyName("heroCtaLink")]
    public string HeroCtaLink { get; set; } = string.Empty;

    [JsonPropertyName("firstBannerTitle")]
    public string FirstBannerTitle { get; set; } = string.Empty;

    [JsonPropertyName("firstBannerSubtitle")]
    public string FirstBannerSubtitle { get; set; } = string.Empty;

    [JsonPropertyName("firstBannerCtaText")]
    public string FirstBannerCtaText { get; set; } = string.Empty;

    [JsonPropertyName("promoBadge")]
    public string PromoBadge { get; set; } = string.Empty;

    [JsonPropertyName("heroTitle_ar")]
    public string? HeroTitleAr { get; set; }

    [JsonPropertyName("heroSubtitle_ar")]
    public string? HeroSubtitleAr { get; set; }

    [JsonPropertyName("heroCtaText_ar")]
    public string? HeroCtaTextAr { get; set; }

    [JsonPropertyName("firstBannerTitle_ar")]
    public string? FirstBannerTitleAr { get; set; }

    [JsonPropertyName("firstBannerSubtitle_ar")]
    public string? FirstBannerSubtitleAr { get; set; }

    [JsonPropertyName("firstBannerCtaText_ar")]
    public string? FirstBannerCtaTextAr { get; set; }

    [JsonPropertyName("promoBadge_ar")]
    public string? PromoBadgeAr { get; set; }
}
