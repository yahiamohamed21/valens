namespace ValensApi.Application.DTOs.Orders;

public class OrderStatusUpdateDto
{
    public System.Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
}
