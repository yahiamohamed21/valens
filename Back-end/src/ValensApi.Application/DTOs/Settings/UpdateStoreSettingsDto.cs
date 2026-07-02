namespace ValensApi.Application.DTOs.Settings;

public class UpdateStoreSettingsDto
{
    public decimal ShippingCost { get; set; }
    public decimal FreeShippingThreshold { get; set; }
    public string ContactPhone { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string SocialTikTok { get; set; } = string.Empty;
}
