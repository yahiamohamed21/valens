using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public string VariantId { get; set; } = string.Empty; // matches frontend e.g. "var-1719460000"
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public string Size { get; set; } = string.Empty;
    public string Flavor { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
}
