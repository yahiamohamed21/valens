namespace ValensApi.Application.DTOs.Orders;

public class CheckoutPreviewDto
{
    public decimal Subtotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal Total { get; set; }
}
