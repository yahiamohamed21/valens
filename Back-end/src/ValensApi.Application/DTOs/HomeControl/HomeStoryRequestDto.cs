using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class HomeStoryRequestDto
{
    [JsonPropertyName("title")]
    [Required(ErrorMessage = "Title is required.")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    [Required(ErrorMessage = "Description is required.")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("image")]
    [Required(ErrorMessage = "Image is required.")]
    public string Image { get; set; } = string.Empty;

    [JsonPropertyName("link")]
    public string? Link { get; set; }

    [JsonPropertyName("altText")]
    public string? AltText { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("displayOrder")]
    [Range(1, int.MaxValue, ErrorMessage = "Display order must be at least 1.")]
    public int DisplayOrder { get; set; } = 1;
}
