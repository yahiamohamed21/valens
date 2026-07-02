namespace ValensApi.Application.DTOs.Expenses;

public class ExpenseFilterDto
{
    public string? Search { get; set; }
    public string? Category { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
