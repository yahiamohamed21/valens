using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Settings;

public class StoreSettingsResponseDto
{
    [JsonPropertyName("brandName")]
    public string BrandName { get; set; } = string.Empty;

    [JsonPropertyName("logoText")]
    public string LogoText { get; set; } = string.Empty;

    [JsonPropertyName("contactEmail")]
    public string ContactEmail { get; set; } = string.Empty;

    [JsonPropertyName("contactPhone")]
    public string ContactPhone { get; set; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("shippingCost")]
    public decimal ShippingCost { get; set; }

    [JsonPropertyName("taxRate")]
    public decimal TaxRate { get; set; }

    [JsonPropertyName("socialInstagram")]
    public string SocialInstagram { get; set; } = string.Empty;

    [JsonPropertyName("socialTwitter")]
    public string SocialTwitter { get; set; } = string.Empty;

    [JsonPropertyName("socialFacebook")]
    public string SocialFacebook { get; set; } = string.Empty;
}
