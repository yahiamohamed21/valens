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
    
    public string Status { get; set; } = "New"; // "New", "Processing", "Shipped", "Completed", "Cancelled"
    public string PaymentMethod { get; set; } = "Cash on Delivery"; // "Cash on Delivery" (COD) / الدفع عند الاستلام
    
    public decimal Subtotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public string CouponCode { get; set; } = string.Empty;
    public decimal Total { get; set; }
    
    public List<OrderItem> Items { get; set; } = new();
}
