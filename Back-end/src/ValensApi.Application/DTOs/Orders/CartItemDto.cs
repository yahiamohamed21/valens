using System;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Orders;

public class CartItemDto
{
    [JsonPropertyName("productId")]
    public Guid ProductId { get; set; }

    [JsonPropertyName("selectedVariant")]
    public string? VariantId { get; set; }

    [JsonPropertyName("selectedSize")]
    public string? Size { get; set; }

    [JsonPropertyName("flavor")]
    public string? Flavor { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }
}
