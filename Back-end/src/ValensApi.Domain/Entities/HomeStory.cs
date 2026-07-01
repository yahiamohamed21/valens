using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class HomeStory : SoftDeletableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 1;
}
