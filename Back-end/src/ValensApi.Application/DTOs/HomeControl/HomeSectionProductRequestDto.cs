using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class HomeSectionProductRequestDto
{
    [JsonPropertyName("productId")]
    [Required(ErrorMessage = "Product ID is required.")]
    public Guid ProductId { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("displayOrder")]
    [Range(1, int.MaxValue, ErrorMessage = "Display order must be at least 1.")]
    public int DisplayOrder { get; set; } = 1;
}
