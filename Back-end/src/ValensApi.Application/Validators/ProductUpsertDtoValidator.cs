using FluentValidation;
using ValensApi.Application.DTOs.Products;

namespace ValensApi.Application.Validators;

public class ProductUpsertDtoValidator : AbstractValidator<ProductUpsertDto>
{
    public ProductUpsertDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required.")
            .MaximumLength(200).WithMessage("Product name must not exceed 200 characters.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0.");

        RuleFor(x => x.DiscountPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Discount price must be 0 or greater.")
            .LessThanOrEqualTo(x => x.Price).WithMessage("Discount price cannot exceed the original price.");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Stock quantity must be 0 or greater.");
    }
}
