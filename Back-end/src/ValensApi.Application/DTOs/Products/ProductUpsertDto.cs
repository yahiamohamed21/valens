using System.Collections.Generic;

namespace ValensApi.Application.DTOs.Products;

public class ProductUpsertDto
{
    public System.Guid? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public bool BestSeller { get; set; }
    public bool NewArrival { get; set; }
    public bool Visible { get; set; }
    public string VariantType { get; set; } = "none";
    public List<VariantUpsertDto> Variants { get; set; } = new();
    
    public decimal Price { get; set; }
    public decimal DiscountPrice { get; set; }
    public string Size { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string Sku { get; set; } = string.Empty;
    
    public string MainImage { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    
    public List<string> Ingredients { get; set; } = new();
    public string Usage { get; set; } = string.Empty;
    public List<string> Benefits { get; set; } = new();
    
    public string ImageType { get; set; } = "powder";
    public string ImageColor { get; set; } = "#FF8A75";
}
