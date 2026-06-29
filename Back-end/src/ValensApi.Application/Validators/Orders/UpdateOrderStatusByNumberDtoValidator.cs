using FluentValidation;
using System;
using System.Linq;
using ValensApi.Application.DTOs.Orders;

namespace ValensApi.Application.Validators.Orders;

public class UpdateOrderStatusByNumberDtoValidator : AbstractValidator<UpdateOrderStatusByNumberDto>
{
    private static readonly string[] AllowedStatuses = new[]
    {
        "NEW ORDER", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REJECTED", "RETURNED"
    };

    public UpdateOrderStatusByNumberDtoValidator()
    {
        RuleFor(x => x.OrderNumber)
            .NotEmpty().WithMessage("Order number is required.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Order status is required.")
            .Must(status => AllowedStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Invalid order status. Allowed values: NEW ORDER, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, REJECTED, RETURNED.");
    }
}
