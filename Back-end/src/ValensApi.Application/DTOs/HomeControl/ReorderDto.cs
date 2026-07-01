using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class ReorderItemDto
{
    [JsonPropertyName("id")]
    [Required(ErrorMessage = "ID is required.")]
    public Guid Id { get; set; }

    [JsonPropertyName("displayOrder")]
    [Required(ErrorMessage = "Display order is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Display order must be at least 1.")]
    public int DisplayOrder { get; set; }
}

public class ReorderDto
{
    [JsonPropertyName("items")]
    [Required(ErrorMessage = "Items are required.")]
    public List<ReorderItemDto> Items { get; set; } = new();
}
