using System;

namespace ValensApi.Application.DTOs.Orders;

public class CartItemDto
{
    public Guid ProductId { get; set; }
    public string? VariantId { get; set; }
    public string? Size { get; set; }
    public string? Flavor { get; set; }
    public int Quantity { get; set; }
}
