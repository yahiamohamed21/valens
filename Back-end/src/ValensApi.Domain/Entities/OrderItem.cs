using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }

    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public string ProductName { get; set; } = string.Empty;
    public string VariantId { get; set; } = string.Empty; // custom string id e.g. "var-123"
    public string Size { get; set; } = string.Empty;
    public string Flavor { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}
