namespace ValensApi.Application.DTOs.Settings;

public class CreateGovernorateShippingDto
{
    public string GovernorateName { get; set; } = string.Empty;
    public decimal ShippingCost { get; set; }
}
