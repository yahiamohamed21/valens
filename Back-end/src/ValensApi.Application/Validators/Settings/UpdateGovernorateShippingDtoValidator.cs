using FluentValidation;
using ValensApi.Application.DTOs.Settings;

namespace ValensApi.Application.Validators.Settings;

public class UpdateGovernorateShippingDtoValidator : AbstractValidator<UpdateGovernorateShippingDto>
{
    public UpdateGovernorateShippingDtoValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Governorate ID is required.");

        RuleFor(x => x.ShippingCost)
            .GreaterThanOrEqualTo(0).WithMessage("Shipping cost cannot be negative.");
    }
}
