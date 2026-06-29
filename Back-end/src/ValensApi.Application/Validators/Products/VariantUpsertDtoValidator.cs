using FluentValidation;
using ValensApi.Application.DTOs.Products;

namespace ValensApi.Application.Validators.Products;

public class VariantUpsertDtoValidator : AbstractValidator<VariantUpsertDto>
{
    public VariantUpsertDtoValidator()
    {
        RuleFor(x => x.Size)
            .MaximumLength(50).WithMessage("Variant size cannot exceed 50 characters.");

        RuleFor(x => x.Flavor)
            .MaximumLength(50).WithMessage("Variant flavor cannot exceed 50 characters.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Variant price must be greater than zero.");

        RuleFor(x => x.DiscountPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Variant discount price cannot be negative.")
            .LessThanOrEqualTo(x => x.Price).WithMessage("Variant discount price cannot exceed the original price.");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Variant stock quantity cannot be negative.");

        RuleFor(x => x.Sku)
            .MaximumLength(100).WithMessage("Variant SKU cannot exceed 100 characters.");
    }
}
