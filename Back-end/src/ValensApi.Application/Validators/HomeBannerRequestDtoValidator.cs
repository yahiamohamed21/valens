using FluentValidation;
using ValensApi.Application.DTOs.HomeControl;

namespace ValensApi.Application.Validators;

public class HomeBannerRequestDtoValidator : AbstractValidator<HomeBannerRequestDto>
{
    public HomeBannerRequestDtoValidator()
    {
        RuleFor(x => x.DesktopImage)
            .NotEmpty().WithMessage("Desktop image is required.")
            .Must(BeAValidUrl).WithMessage("Desktop image must be a valid URL.");

        RuleFor(x => x.MobileImage)
            .Must(BeAValidUrl).When(x => !string.IsNullOrEmpty(x.MobileImage))
            .WithMessage("Mobile image must be a valid URL.");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(1).WithMessage("Display order must be at least 1.");
    }

    private bool BeAValidUrl(string url)
    {
        if (string.IsNullOrEmpty(url)) return false;
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }
}
