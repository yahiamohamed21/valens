using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Orders;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IOrderService
{
    Task<object> CreateOrderAsync(CheckoutDto dto, Guid? loggedInUserId, bool isAuthenticated);
    Task<CheckoutProfileDto?> GetCheckoutProfileAsync(Guid userId);
    Task<ValensApi.Application.DTOs.Common.PaginatedList<Order>> GetMyOrdersAsync(Guid userId, int pageNumber = 1, int pageSize = 10);
    Task<ValensApi.Application.DTOs.Common.PaginatedList<Order>> GetAllOrdersAsync(string? search, string? category, int pageNumber = 1, int pageSize = 10);
    Task<CheckoutPreviewDto> PreviewCheckoutAsync(CheckoutDto dto);
    Task<bool> UpdateStatusAsync(Guid id, string status);
    Task<bool> UpdateStatusByNumberAsync(string orderNumber, string status);
    Task<bool> UpdateOrderDetailsAsync(UpdateOrderDto dto);
}
