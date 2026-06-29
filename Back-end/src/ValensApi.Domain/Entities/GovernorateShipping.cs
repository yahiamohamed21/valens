using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class GovernorateShipping : BaseEntity
{
    public string GovernorateName { get; set; } = string.Empty;
    public decimal ShippingCost { get; set; }
}
