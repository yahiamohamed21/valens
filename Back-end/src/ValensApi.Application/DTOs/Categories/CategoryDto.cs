using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Categories;

public class CategoryDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("imageColor")]
    public string ImageColor { get; set; } = "#FF8A75";

    [JsonPropertyName("visible")]
    public bool IsActive { get; set; } = true;
}
