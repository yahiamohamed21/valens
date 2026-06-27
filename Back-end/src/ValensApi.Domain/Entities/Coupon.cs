using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Coupon : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string DiscountType { get; set; } = "Percentage"; // "Percentage", "Fixed"
    public decimal DiscountValue { get; set; }
    public DateTimeOffset ExpiryDate { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int UsageCount { get; set; }
    public int? MaxUsage { get; set; }
    public bool IsActive { get; set; } = true;
}
