using FluentValidation;
using ValensApi.Application.DTOs.Orders;

namespace ValensApi.Application.Validators.Orders;

public class CartItemDtoValidator : AbstractValidator<CartItemDto>
{
    public CartItemDtoValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be at least 1.")
            .LessThanOrEqualTo(1000).WithMessage("Quantity cannot exceed 1000.");
    }
}
