using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class HomeSectionProduct : BaseEntity
{
    public string SectionKey { get; set; } = string.Empty; // "featured_formulas" | "best_selling_formulas"
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}
