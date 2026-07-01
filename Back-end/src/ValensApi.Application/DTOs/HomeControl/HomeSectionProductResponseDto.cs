using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class HomeSectionProductResponseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("sectionProductId")]
    public Guid SectionProductId { get; set; }

    [JsonPropertyName("sectionKey")]
    public string SectionKey { get; set; } = string.Empty;

    [JsonPropertyName("productId")]
    public Guid ProductId { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("displayOrder")]
    public int DisplayOrder { get; set; }

    [JsonPropertyName("product")]
    public ProductCardDto? Product { get; set; }
}

public class ProductCardDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "EGP";

    [JsonPropertyName("image")]
    public string? Image { get; set; }

    [JsonPropertyName("rating")]
    public double Rating { get; set; }

    [JsonPropertyName("reviewsCount")]
    public int ReviewsCount { get; set; }

    [JsonPropertyName("stockStatus")]
    public string StockStatus { get; set; } = "in_stock";

    [JsonPropertyName("badges")]
    public List<string> Badges { get; set; } = new();
}
