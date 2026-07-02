using FluentValidation;
using ValensApi.Application.DTOs.Orders;

namespace ValensApi.Application.Validators.Orders;

public class UpdateOrderDtoValidator : AbstractValidator<UpdateOrderDto>
{
    public UpdateOrderDtoValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Order ID is required.");

        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Customer name is required.")
            .Length(3, 100).WithMessage("Customer name must be between 3 and 100 characters.");

        RuleFor(x => x.CustomerPhone)
            .NotEmpty().WithMessage("Customer phone number is required.")
            .Matches(@"^01[0-2,5]\d{8}$").WithMessage("Invalid Egyptian phone number. Must be 11 digits starting with 010, 011, 012, or 015.");

        RuleFor(x => x.ShippingAddress)
            .NotEmpty().WithMessage("Shipping address is required.")
            .Length(5, 200).WithMessage("Shipping address must be between 5 and 200 characters.");

        RuleFor(x => x.ShippingCity)
            .NotEmpty().WithMessage("Shipping city is required.")
            .MaximumLength(50).WithMessage("City cannot exceed 50 characters.");
    }
}
