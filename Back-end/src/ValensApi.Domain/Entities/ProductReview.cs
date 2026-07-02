using System;
using System.Text.Json.Serialization;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class ProductReview : BaseEntity
{
    public Guid ProductId { get; set; }
    
    [JsonIgnore]
    public Product? Product { get; set; }

    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
    public bool IsApproved { get; set; } = true; // default to true so users see them immediately, can be moderated in admin panel
}
