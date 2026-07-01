using FluentValidation;
using ValensApi.Application.DTOs.HomeControl;

namespace ValensApi.Application.Validators;

public class HomeSectionProductRequestDtoValidator : AbstractValidator<HomeSectionProductRequestDto>
{
    private static readonly string[] ValidSectionKeys = { "featured_formulas", "best_selling_formulas" };

    public HomeSectionProductRequestDtoValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(1).WithMessage("Display order must be at least 1.");
    }

    public static bool IsValidSectionKey(string sectionKey)
    {
        return ValidSectionKeys.Contains(sectionKey?.ToLower());
    }
}
