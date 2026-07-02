using FluentValidation;
using ValensApi.Application.DTOs.Settings;

namespace ValensApi.Application.Validators.Settings;

public class CreateGovernorateShippingDtoValidator : AbstractValidator<CreateGovernorateShippingDto>
{
    public CreateGovernorateShippingDtoValidator()
    {
        RuleFor(x => x.GovernorateName)
            .NotEmpty().WithMessage("Governorate name is required.");

        RuleFor(x => x.ShippingCost)
            .GreaterThanOrEqualTo(0).WithMessage("Shipping cost cannot be negative.");
    }
}
