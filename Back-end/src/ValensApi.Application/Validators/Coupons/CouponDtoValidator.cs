using FluentValidation;
using System;
using ValensApi.Application.DTOs.Coupons;

namespace ValensApi.Application.Validators.Coupons;

public class CouponDtoValidator : AbstractValidator<CouponDto>
{
    public CouponDtoValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Coupon code is required.")
            .Length(3, 20).WithMessage("Coupon code must be between 3 and 20 characters.")
            .Matches(@"^[A-Z0-9_-]+$").WithMessage("Coupon code must contain only uppercase alphanumeric characters, dashes, or underscores.");

        RuleFor(x => x.DiscountType)
            .NotEmpty().WithMessage("Discount type is required.")
            .Must(type => type == "Percentage" || type == "Fixed").WithMessage("Discount type must be either 'Percentage' or 'Fixed'.");

        RuleFor(x => x.DiscountValue)
            .GreaterThan(0).WithMessage("Discount value must be greater than zero.")
            .LessThanOrEqualTo(100000.00m).WithMessage("Discount value cannot exceed 100,000.00.");

        // Conditional validation for Percentage type
        RuleFor(x => x.DiscountValue)
            .LessThanOrEqualTo(100m).WithMessage("Percentage discount cannot exceed 100%.")
            .When(x => x.DiscountType == "Percentage");

        RuleFor(x => x.ExpiryDate)
            .GreaterThan(DateTimeOffset.UtcNow).WithMessage("Expiry date must be in the future.")
            .When(x => x.ExpiryDate.HasValue);

        RuleFor(x => x.MinOrderAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum order amount cannot be negative.");

        RuleFor(x => x.MaxUsage)
            .GreaterThan(0).WithMessage("Maximum usage must be at least 1.")
            .When(x => x.MaxUsage.HasValue);
    }
}
