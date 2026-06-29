using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Orders;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IOrderService
{
    Task<object> CreateOrderAsync(CheckoutDto dto, Guid? loggedInUserId, bool isAuthenticated);
    Task<IEnumerable<OrderResponseDto>> GetMyOrdersAsync(Guid userId);
    Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync(string? search, string? category);
    Task<bool> UpdateStatusAsync(Guid id, string status);
    Task<bool> UpdateOrderDetailsAsync(UpdateOrderDto dto);
}
