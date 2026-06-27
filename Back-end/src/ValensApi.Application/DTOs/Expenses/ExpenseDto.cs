using System;

namespace ValensApi.Application.DTOs.Expenses;

public class ExpenseDto
{
    public Guid? Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty; // "Advertising", "Salaries", "Shipping", "Rent", "Other"
    public DateTimeOffset? Date { get; set; }
}
