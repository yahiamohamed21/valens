using FluentValidation;
using ValensApi.Application.DTOs.Settings;

namespace ValensApi.Application.Validators.Settings;

public class UpdateHomepageSettingsDtoValidator : AbstractValidator<UpdateHomepageSettingsDto>
{
    public UpdateHomepageSettingsDtoValidator()
    {
        RuleFor(x => x.HomepageHeroTitle)
            .NotEmpty().WithMessage("Homepage hero title is required.")
            .Length(3, 200).WithMessage("Hero title must be between 3 and 200 characters.");

        RuleFor(x => x.HomepageHeroSubtitle)
            .NotEmpty().WithMessage("Homepage hero subtitle is required.")
            .Length(3, 500).WithMessage("Hero subtitle must be between 3 and 500 characters.");

        RuleFor(x => x.HomepageDiscountBannerText)
            .NotEmpty().WithMessage("Homepage discount banner text is required.")
            .MaximumLength(200).WithMessage("Discount banner text cannot exceed 200 characters.");
    }
}
