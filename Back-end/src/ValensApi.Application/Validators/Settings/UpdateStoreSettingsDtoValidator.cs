using FluentValidation;
using ValensApi.Application.DTOs.Settings;

namespace ValensApi.Application.Validators.Settings;

public class UpdateStoreSettingsDtoValidator : AbstractValidator<UpdateStoreSettingsDto>
{
    public UpdateStoreSettingsDtoValidator()
    {
        RuleFor(x => x.ShippingCost)
            .GreaterThanOrEqualTo(0).WithMessage("Shipping cost cannot be negative.");

        RuleFor(x => x.FreeShippingThreshold)
            .GreaterThanOrEqualTo(0).WithMessage("Free shipping threshold cannot be negative.");

        RuleFor(x => x.ContactPhone)
            .NotEmpty().WithMessage("Contact phone number is required.")
            .Matches(@"^01[0-2,5]\d{8}$|^\+?\d{10,15}$").WithMessage("Invalid contact phone number.");

        RuleFor(x => x.ContactEmail)
            .NotEmpty().WithMessage("Contact email is required.")
            .EmailAddress().WithMessage("Invalid contact email address format.");
    }
}
