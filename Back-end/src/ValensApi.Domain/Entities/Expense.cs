using System;
using ValensApi.Domain.Common;

namespace ValensApi.Domain.Entities;

public class Expense : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty; // "Advertising", "Salaries", "Shipping", "Rent", "Other"
    public DateTimeOffset Date { get; set; } = DateTimeOffset.UtcNow;
}
