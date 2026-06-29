using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Orders;

public class CheckoutDto
{
    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("customerEmail")]
    public string CustomerEmail { get; set; } = string.Empty;

    [JsonPropertyName("customerPhone")]
    public string CustomerPhone { get; set; } = string.Empty;

    [JsonPropertyName("customerAddress")]
    public string ShippingAddress { get; set; } = string.Empty;

    [JsonPropertyName("customerCity")]
    public string ShippingCity { get; set; } = string.Empty;

    [JsonPropertyName("notes")]
    public string? Notes { get; set; }

    [JsonPropertyName("shippingMethod")]
    public string ShippingMethod { get; set; } = "Standard";

    [JsonPropertyName("couponCode")]
    public string? CouponCode { get; set; }

    [JsonPropertyName("items")]
    public List<CartItemDto> Items { get; set; } = new();
}
