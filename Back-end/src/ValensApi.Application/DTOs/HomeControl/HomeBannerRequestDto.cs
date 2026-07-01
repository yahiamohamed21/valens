using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class HomeBannerRequestDto
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("subtitle")]
    public string? Subtitle { get; set; }

    [JsonPropertyName("desktopImage")]
    [Required(ErrorMessage = "Desktop image is required.")]
    public string DesktopImage { get; set; } = string.Empty;

    [JsonPropertyName("mobileImage")]
    public string? MobileImage { get; set; }

    [JsonPropertyName("ctaText")]
    public string? CtaText { get; set; }

    [JsonPropertyName("ctaLink")]
    public string? CtaLink { get; set; }

    [JsonPropertyName("altText")]
    public string? AltText { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("displayOrder")]
    [Range(1, int.MaxValue, ErrorMessage = "Display order must be at least 1.")]
    public int DisplayOrder { get; set; } = 1;
}
