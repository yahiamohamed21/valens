namespace ValensApi.Application.DTOs.Orders;

public class UpdateOrderStatusByNumberDto
{
    public string OrderNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
