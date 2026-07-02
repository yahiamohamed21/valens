using Microsoft.AspNetCore.Http;

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

    // Legacy support for base64 / string URL
    public string Image { get; set; } = string.Empty;

    // Professional multipart upload
    public IFormFile? ImageFile { get; set; }

    public bool IsAvailable { get; set; } = true;
}
