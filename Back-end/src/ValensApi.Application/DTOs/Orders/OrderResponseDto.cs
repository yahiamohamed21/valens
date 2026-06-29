using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Orders;

public class OrderResponseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("orderNumber")]
    public string OrderNumber { get; set; } = string.Empty;

    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("customerPhone")]
    public string CustomerPhone { get; set; } = string.Empty;

    [JsonPropertyName("customerEmail")]
    public string CustomerEmail { get; set; } = string.Empty;

    [JsonPropertyName("customerAddress")]
    public string CustomerAddress { get; set; } = string.Empty;

    [JsonPropertyName("customerCity")]
    public string CustomerCity { get; set; } = string.Empty;

    [JsonPropertyName("notes")]
    public string? Notes { get; set; }

    [JsonPropertyName("items")]
    public List<OrderItemResponseDto> Items { get; set; } = new();

    [JsonPropertyName("totalPrice")]
    public decimal TotalPrice { get; set; }

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = string.Empty;

    [JsonPropertyName("shippingMethod")]
    public string ShippingMethod { get; set; } = string.Empty;

    [JsonPropertyName("shippingCost")]
    public decimal ShippingCost { get; set; }

    [JsonPropertyName("discountAmount")]
    public decimal DiscountAmount { get; set; }

    [JsonPropertyName("couponCode")]
    public string? CouponCode { get; set; }

    [JsonPropertyName("orderDate")]
    public DateTimeOffset OrderDate { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "New Order";
}

public class OrderItemResponseDto
{
    [JsonPropertyName("productId")]
    public Guid ProductId { get; set; }

    [JsonPropertyName("productName")]
    public string ProductName { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }

    [JsonPropertyName("size")]
    public string Size { get; set; } = string.Empty;

    [JsonPropertyName("variant")]
    public string Variant { get; set; } = string.Empty;

    [JsonPropertyName("imageColor")]
    public string ImageColor { get; set; } = "#FF8A75";

    [JsonPropertyName("imageType")]
    public string ImageType { get; set; } = "powder";
}
