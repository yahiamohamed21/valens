using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class SupportMessage : SoftDeletableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
