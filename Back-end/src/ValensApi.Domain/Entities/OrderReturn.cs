using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class OrderReturn : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }
    
    public string OrderNumber { get; set; } = string.Empty;
    public DateTimeOffset ReturnDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    
    public string ReturnedFormulations { get; set; } = string.Empty; // formatted list of items returned
    public string ReturnReason { get; set; } = string.Empty;
    public bool IsRestoredToStock { get; set; }
    public decimal RefundAmount { get; set; }
    public string Notes { get; set; } = string.Empty;
}
