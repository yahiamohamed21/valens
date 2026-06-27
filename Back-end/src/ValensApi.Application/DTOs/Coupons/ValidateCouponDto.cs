using System.Collections.Generic;
using ValensApi.Application.DTOs.Orders;

namespace ValensApi.Application.DTOs.Coupons;

public class ValidateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public List<CartItemDto> Items { get; set; } = new();
}
