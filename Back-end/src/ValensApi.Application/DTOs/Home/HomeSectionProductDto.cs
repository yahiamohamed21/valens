namespace ValensApi.Application.DTOs.Home;

public class HomeSectionProductDto
{
    public Guid Id { get; set; }
    public string SectionKey { get; set; } = string.Empty;
    public Guid ProductId { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public HomeSectionProductCardDto? Product { get; set; }
}
