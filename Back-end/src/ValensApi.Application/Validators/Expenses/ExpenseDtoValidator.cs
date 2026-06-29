using FluentValidation;
using ValensApi.Application.DTOs.Expenses;

namespace ValensApi.Application.Validators.Expenses;

public class ExpenseDtoValidator : AbstractValidator<ExpenseDto>
{
    public ExpenseDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Expense title is required.")
            .Length(3, 100).WithMessage("Expense title must be between 3 and 100 characters.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Expense amount must be greater than zero.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Expense category is required.")
            .Must(cat => cat == "Advertising" || cat == "Salaries" || cat == "Shipping" || cat == "Rent" || cat == "Other")
            .WithMessage("Invalid category. Must be one of: Advertising, Salaries, Shipping, Rent, Other.");
    }
}
