namespace ValensApi.Application.DTOs.Home;

public class CreateHomeBannerDto
{
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string DesktopImage { get; set; } = string.Empty;
    public string MobileImage { get; set; } = string.Empty;
    public string CtaText { get; set; } = string.Empty;
    public string CtaLink { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}
