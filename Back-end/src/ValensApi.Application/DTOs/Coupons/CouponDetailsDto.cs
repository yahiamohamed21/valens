using System;
using System.Collections.Generic;

namespace ValensApi.Application.DTOs.Coupons;

public class CouponDetailsDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string DiscountType { get; set; } = "Percentage";
    public decimal DiscountValue { get; set; }
    public DateTimeOffset? ExpiryDate { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int UsageCount { get; set; }
    public int? MaxUsage { get; set; }
    public bool IsActive { get; set; }
    public string? OwnerName { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Stats
    public int TotalOrders { get; set; }
    public int TotalProductsBought { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<CouponOrderDetailsDto> Orders { get; set; } = new();
}

public class CouponOrderDetailsDto
{
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateTimeOffset OrderDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public int ProductsCount { get; set; }
    public List<string> ProductNames { get; set; } = new();
}
