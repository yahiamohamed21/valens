using FluentValidation;
using System;
using System.Linq;
using ValensApi.Application.DTOs.Orders;

namespace ValensApi.Application.Validators.Orders;

public class OrderStatusUpdateDtoValidator : AbstractValidator<OrderStatusUpdateDto>
{
    private static readonly string[] AllowedStatuses = new[]
    {
        "NEW ORDER", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REJECTED", "RETURNED"
    };

    public OrderStatusUpdateDtoValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Order ID is required.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Order status is required.")
            .Must(status => AllowedStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Invalid order status. Allowed values: NEW ORDER, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, REJECTED, RETURNED.");
    }
}
