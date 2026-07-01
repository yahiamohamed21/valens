namespace ValensApi.Application.DTOs.Home;

public class UpdateHomeStoryDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? Link { get; set; }
    public string? AltText { get; set; }
    public bool? IsActive { get; set; }
    public int? DisplayOrder { get; set; }
}
