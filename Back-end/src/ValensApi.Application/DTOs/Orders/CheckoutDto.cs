using System.Collections.Generic;

namespace ValensApi.Application.DTOs.Orders;

public class CheckoutDto
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string? CouponCode { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}
