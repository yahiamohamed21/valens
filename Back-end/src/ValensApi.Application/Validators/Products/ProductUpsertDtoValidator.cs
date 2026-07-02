using FluentValidation;
using ValensApi.Application.DTOs.Products;

namespace ValensApi.Application.Validators.Products;

public class ProductUpsertDtoValidator : AbstractValidator<ProductUpsertDto>
{
    public ProductUpsertDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required.")
            .Length(3, 150).WithMessage("Product name must be between 3 and 150 characters.");

        RuleFor(x => x.NameAr)
            .NotEmpty().WithMessage("Arabic product name is required.")
            .Length(3, 150).WithMessage("Arabic product name must be between 3 and 150 characters.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required.")
            .MaximumLength(50).WithMessage("Category cannot exceed 50 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");

        RuleFor(x => x.DescriptionAr)
            .NotEmpty().WithMessage("Arabic description is required.")
            .MaximumLength(1000).WithMessage("Arabic description cannot exceed 1000 characters.");

        RuleFor(x => x.VariantType)
            .NotEmpty().WithMessage("Variant type is required.")
            .Must(type => type == "none" || type == "size" || type == "flavor" || type == "both")
            .WithMessage("Variant type must be one of: none, size, flavor, both.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");

        // If no variants, price must be greater than zero
        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Product price must be greater than zero when there are no variants.")
            .When(x => x.VariantType == "none");

        RuleFor(x => x.DiscountPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Discount price cannot be negative.")
            .LessThanOrEqualTo(x => x.Price).WithMessage("Discount price cannot exceed the original price.");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Stock cannot be negative.");

        RuleFor(x => x.Sku)
            .MaximumLength(100).WithMessage("SKU cannot exceed 100 characters.");

        RuleFor(x => x.ImageType)
            .Must(type => string.IsNullOrEmpty(type) || type == "powder" || type == "capsule" || type == "liquid" || type == "bar" || type == "tablet" || type == "other")
            .WithMessage("Invalid image type. Allowed: powder, capsule, liquid, bar, tablet, other.");

        RuleFor(x => x.ImageColor)
            .Matches(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
            .WithMessage("Image color must be a valid hex color code.")
            .When(x => !string.IsNullOrEmpty(x.ImageColor));

        // Validate nested variant list
        RuleForEach(x => x.Variants)
            .SetValidator(new VariantUpsertDtoValidator())
            .When(x => x.VariantType != "none" && x.Variants != null);
    }
}
