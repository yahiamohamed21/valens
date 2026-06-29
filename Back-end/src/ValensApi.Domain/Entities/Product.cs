using System;
using System.Collections.Generic;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Product : SoftDeletableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    
    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }

    public bool Featured { get; set; }
    public bool BestSeller { get; set; }
    public bool NewArrival { get; set; }
    public bool Visible { get; set; } = true;

    public string VariantType { get; set; } = "none"; // "none", "size", "flavor", "both"
    public decimal Price { get; set; }
    public decimal DiscountPrice { get; set; }
    public string Size { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string Sku { get; set; } = string.Empty;

    public string MainImage { get; set; } = string.Empty;
    
    // JSON lists in database
    public List<string> Images { get; set; } = new();
    public List<string> Ingredients { get; set; } = new();
    public List<string> Benefits { get; set; } = new();

    public string Usage { get; set; } = string.Empty;
    public string ImageType { get; set; } = "powder"; // "powder", "capsule", "liquid"
    public string ImageColor { get; set; } = "#FF8A75";

    public List<ProductVariant> Variants { get; set; } = new();
    public List<Review> Reviews { get; set; } = new();

    // Average rating (calculated/cached)
    public double Rating { get; set; }

    // Arabic translation fields
    public string? NameAr { get; set; }
    public string? DescriptionAr { get; set; }
    public string? UsageAr { get; set; }
    public List<string>? IngredientsAr { get; set; }
    public List<string>? BenefitsAr { get; set; }
}
