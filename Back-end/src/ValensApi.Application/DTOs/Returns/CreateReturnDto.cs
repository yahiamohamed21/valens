using System;
using System.Collections.Generic;

namespace ValensApi.Application.DTOs.Returns;

public class CreateReturnDto
{
    public Guid OrderId { get; set; }
    public string ReturnReason { get; set; } = string.Empty;
    public bool IsRestoredToStock { get; set; }
    public decimal RefundAmount { get; set; }
    public string Notes { get; set; } = string.Empty;
    public List<ReturnItemDto> Items { get; set; } = new();
}

public class ReturnItemDto
{
    public Guid ProductId { get; set; }
    public string VariantId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
