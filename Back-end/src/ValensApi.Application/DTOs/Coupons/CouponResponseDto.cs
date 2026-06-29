using System;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Coupons;

public class CouponResponseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("discountType")]
    public string DiscountType { get; set; } = "percentage";

    [JsonPropertyName("discountValue")]
    public decimal DiscountValue { get; set; }

    [JsonPropertyName("expiryDate")]
    public DateTimeOffset ExpiryDate { get; set; }

    [JsonPropertyName("usageLimit")]
    public int? UsageLimit { get; set; }

    [JsonPropertyName("usageCount")]
    public int UsageCount { get; set; }

    [JsonPropertyName("minOrderAmount")]
    public decimal MinOrderAmount { get; set; }

    [JsonPropertyName("active")]
    public bool Active { get; set; }
}
