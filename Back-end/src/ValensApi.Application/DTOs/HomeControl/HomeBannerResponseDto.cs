using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class HomeBannerResponseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("subtitle")]
    public string Subtitle { get; set; } = string.Empty;

    [JsonPropertyName("desktopImage")]
    public string? DesktopImage { get; set; }

    [JsonPropertyName("mobileImage")]
    public string? MobileImage { get; set; }

    [JsonPropertyName("ctaText")]
    public string CtaText { get; set; } = string.Empty;

    [JsonPropertyName("ctaLink")]
    public string CtaLink { get; set; } = string.Empty;

    [JsonPropertyName("altText")]
    public string AltText { get; set; } = string.Empty;

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("displayOrder")]
    public int DisplayOrder { get; set; }
}
