using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Review : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public string Author { get; set; } = string.Empty;
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
    public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;
}
