using FluentValidation;
using ValensApi.Application.DTOs.Coupons;
using ValensApi.Application.Validators.Orders;

namespace ValensApi.Application.Validators.Coupons;

public class ValidateCouponDtoValidator : AbstractValidator<ValidateCouponDto>
{
    public ValidateCouponDtoValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Coupon code is required.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Cart items are required.")
            .Must(items => items != null && items.Count > 0).WithMessage("Cart must contain at least one item.");

        RuleForEach(x => x.Items)
            .SetValidator(new CartItemDtoValidator());
    }
}
