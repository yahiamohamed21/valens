using FluentValidation;
using Microsoft.AspNetCore.Http;
using ValensApi.Application.DTOs.Orders;

namespace ValensApi.Application.Validators.Orders;

public class CheckoutDtoValidator : AbstractValidator<CheckoutDto>
{
    public CheckoutDtoValidator(IHttpContextAccessor httpContextAccessor)
    {
        var user = httpContextAccessor.HttpContext?.User;
        bool isAuthenticated = user?.Identity?.IsAuthenticated == true;

        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Customer name is required.")
            .Length(3, 100).WithMessage("Customer name must be between 3 and 100 characters.")
            .When(_ => !isAuthenticated);

        RuleFor(x => x.CustomerEmail)
            .NotEmpty().WithMessage("Customer email is required.")
            .EmailAddress().WithMessage("Invalid email address format.")
            .When(_ => !isAuthenticated);

        RuleFor(x => x.CustomerPhone)
            .NotEmpty().WithMessage("Customer phone number is required.")
            .Matches(@"^01[0-2,5]\d{8}$").WithMessage("Invalid Egyptian phone number. Must be 11 digits starting with 010, 011, 012, or 015.")
            .When(_ => !isAuthenticated);

        RuleFor(x => x.ShippingAddress)
            .NotEmpty().WithMessage("Shipping address is required.")
            .Length(5, 200).WithMessage("Shipping address must be between 5 and 200 characters.")
            .When(_ => !isAuthenticated);

        RuleFor(x => x.ShippingCity)
            .NotEmpty().WithMessage("Shipping city is required.")
            .MaximumLength(50).WithMessage("City cannot exceed 50 characters.")
            .When(_ => !isAuthenticated);

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Order items are required.")
            .Must(items => items != null && items.Count > 0).WithMessage("Order must contain at least one item.");

        RuleForEach(x => x.Items)
            .SetValidator(new CartItemDtoValidator());
    }
}
