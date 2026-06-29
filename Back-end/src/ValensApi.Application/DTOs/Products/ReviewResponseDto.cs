using System;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Products;

public class ReviewResponseDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("author")]
    public string Author { get; set; } = string.Empty;

    [JsonPropertyName("rating")]
    public int Rating { get; set; }

    [JsonPropertyName("comment")]
    public string Comment { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateTimeOffset Date { get; set; }
}
