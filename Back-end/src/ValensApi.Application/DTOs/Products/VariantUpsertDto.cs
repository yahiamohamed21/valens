namespace ValensApi.Application.DTOs.Products;

public class VariantUpsertDto
{
    public string Id { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Flavor { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
}
