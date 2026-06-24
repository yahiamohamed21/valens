using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Product : SoftDeletableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
}
