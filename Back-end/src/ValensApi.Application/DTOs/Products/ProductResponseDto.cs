using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Products;

public class ProductResponseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTimeOffset CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTimeOffset UpdatedAt { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("category")]
    public string CategoryName { get; set; } = string.Empty;

    [JsonPropertyName("categoryId")]
    public Guid? CategoryId { get; set; }

    [JsonPropertyName("featured")]
    public bool Featured { get; set; }

    [JsonPropertyName("bestSeller")]
    public bool BestSeller { get; set; }

    [JsonPropertyName("newArrival")]
    public bool NewArrival { get; set; }

    [JsonPropertyName("visible")]
    public bool Visible { get; set; }

    [JsonPropertyName("variantType")]
    public string VariantType { get; set; } = "none";

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("discountPrice")]
    public decimal DiscountPrice { get; set; }

    [JsonPropertyName("size")]
    public string Size { get; set; } = string.Empty;

    [JsonPropertyName("stock")]
    public int Stock { get; set; }

    [JsonPropertyName("sku")]
    public string Sku { get; set; } = string.Empty;

    [JsonPropertyName("mainImage")]
    public string MainImage { get; set; } = string.Empty;

    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();

    [JsonPropertyName("ingredients")]
    public List<string> Ingredients { get; set; } = new();

    [JsonPropertyName("benefits")]
    public List<string> Benefits { get; set; } = new();

    [JsonPropertyName("usage")]
    public string Usage { get; set; } = string.Empty;

    [JsonPropertyName("imageType")]
    public string ImageType { get; set; } = "powder";

    [JsonPropertyName("imageColor")]
    public string ImageColor { get; set; } = "#FF8A75";

    [JsonPropertyName("variants")]
    public List<ProductVariantResponseDto> Variants { get; set; } = new();

    [JsonPropertyName("reviews")]
    public List<ReviewResponseDto> Reviews { get; set; } = new();

    [JsonPropertyName("rating")]
    public double Rating { get; set; }

    // Arabic translations
    [JsonPropertyName("name_ar")]
    public string? NameAr { get; set; }

    [JsonPropertyName("description_ar")]
    public string? DescriptionAr { get; set; }

    [JsonPropertyName("ingredients_ar")]
    public List<string>? IngredientsAr { get; set; }

    [JsonPropertyName("usage_ar")]
    public string? UsageAr { get; set; }

    [JsonPropertyName("benefits_ar")]
    public List<string>? BenefitsAr { get; set; }
}
