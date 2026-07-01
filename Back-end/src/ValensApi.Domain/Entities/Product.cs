using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Product : SoftDeletableEntity
{
    public string Name { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DescriptionAr { get; set; } = string.Empty;
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
    public List<string> IngredientsAr { get; set; } = new();
    public List<string> Benefits { get; set; } = new();
    public List<string> BenefitsAr { get; set; } = new();

    public string Usage { get; set; } = string.Empty;
    public string UsageAr { get; set; } = string.Empty;
    public string ImageType { get; set; } = "powder"; // "powder", "capsule", "liquid"
    public string ImageColor { get; set; } = "#FF8A75";

    public List<ProductVariant> Variants { get; set; } = new();
    public List<ProductReview> Reviews { get; set; } = new();

    [NotMapped]
    public double Rating
    {
        get
        {
            if (Reviews == null || !Reviews.Any(r => r.IsApproved))
                return 5.0;
            return Math.Round(Reviews.Where(r => r.IsApproved).Average(r => r.Rating), 1);
        }
    }
}
