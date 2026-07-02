using System;

namespace ValensApi.Application.DTOs.Settings;

public class UpdateGovernorateShippingDto
{
    public Guid Id { get; set; }
    public decimal ShippingCost { get; set; }
}
