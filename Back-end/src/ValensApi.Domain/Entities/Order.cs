using System;
using System.Collections.Generic;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    // Shipping snapshots
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string? Notes { get; set; }
    
    public string Status { get; set; } = "New Order"; // "New Order", "Confirmed", "Preparing", "Shipped / Out for Delivery", "Delivered", "Cancelled", "Rejected", "Returned"
    public string PaymentMethod { get; set; } = "Cash on Delivery";
    public string ShippingMethod { get; set; } = "Standard";
    
    public decimal Subtotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public string CouponCode { get; set; } = string.Empty;
    public decimal Total { get; set; }
    
    public List<OrderItem> Items { get; set; } = new();
}
