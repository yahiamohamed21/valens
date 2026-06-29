using FluentValidation;
using ValensApi.Application.DTOs.Categories;

namespace ValensApi.Application.Validators.Categories;

public class CategoryDtoValidator : AbstractValidator<CategoryDto>
{
    public CategoryDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .Length(2, 50).WithMessage("Category name must be between 2 and 50 characters.");
    }
}
