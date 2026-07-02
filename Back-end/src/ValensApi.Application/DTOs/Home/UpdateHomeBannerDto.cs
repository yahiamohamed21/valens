namespace ValensApi.Application.DTOs.Home;

public class UpdateHomeBannerDto
{
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? DesktopImage { get; set; }
    public string? MobileImage { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public string? AltText { get; set; }
    public bool? IsActive { get; set; }
    public int? DisplayOrder { get; set; }
}
