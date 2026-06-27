using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class UserOtp : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Action { get; set; } = "PasswordReset"; // "PasswordReset", "EmailVerification", etc.
    public DateTimeOffset Expiry { get; set; }
    public bool IsUsed { get; set; }
}
