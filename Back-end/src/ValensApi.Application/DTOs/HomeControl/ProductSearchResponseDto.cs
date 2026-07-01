using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class ProductSearchResponseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "EGP";

    [JsonPropertyName("image")]
    public string? Image { get; set; }

    [JsonPropertyName("stockStatus")]
    public string StockStatus { get; set; } = "in_stock";
}
