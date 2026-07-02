using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.Support;

public class SimpleResponseDto
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}
