using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Category : SoftDeletableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageColor { get; set; } = "#FF8A75";
    public bool IsActive { get; set; } = true;
}
