using System;
using System.Collections.Generic;

namespace ValensApi.Application.DTOs.Home;

public class HomeSectionProductCardDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "EGP";
    public string? Image { get; set; }
    public int Rating { get; set; } = 5;
    public int ReviewsCount { get; set; } = 0;
    public string StockStatus { get; set; } = "in_stock";
    public List<string> Badges { get; set; } = new();
}
