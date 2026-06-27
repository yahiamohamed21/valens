namespace ValensApi.Application.DTOs.Coupons;

public class ValidateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public decimal OrderAmount { get; set; }
}
