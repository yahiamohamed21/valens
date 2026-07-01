using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class ToggleStatusDto
{
    [JsonPropertyName("isActive")]
    [Required(ErrorMessage = "IsActive is required.")]
    public bool IsActive { get; set; }
}
