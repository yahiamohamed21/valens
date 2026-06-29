using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Orders;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

public class OrdersController : BaseApiController
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("checkout-order")]
    public async Task<IActionResult> CheckoutOrder([FromBody] CheckoutDto dto)
    {
        bool isAuthenticated = User.Identity?.IsAuthenticated == true;
        Guid? loggedInUserId = isAuthenticated ? CurrentUserId : null;

        try
        {
            var result = await _orderService.CreateOrderAsync(dto, loggedInUserId, isAuthenticated);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred processing order: {ex.Message}");
        }
    }

    [HttpGet("my-history")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetMyOrdersHistory()
    {
        var userId = CurrentUserId;
        if (userId == Guid.Empty)
        {
            return Unauthorized("User is not authorized.");
        }

        var orders = await _orderService.GetMyOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpPost("list-admin-orders")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetAdminOrders([FromBody] OrderAdminFilterDto dto)
    {
        var orders = await _orderService.GetAllOrdersAsync(dto?.Search, dto?.Category);
        return Ok(orders);
    }

    [HttpPost("update-order-status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus([FromBody] OrderStatusUpdateDto dto)
    {
        var success = await _orderService.UpdateStatusAsync(dto.Id, dto.Status);
        if (!success)
        {
            return NotFound("Order not found.");
        }

        return NoContent();
    }

    [HttpPost("update-order-details")]
    public async Task<IActionResult> UpdateOrderDetails([FromBody] UpdateOrderDto dto)
    {
        var success = await _orderService.UpdateOrderDetailsAsync(dto);
        if (!success)
        {
            return NotFound("Order not found.");
        }

        return NoContent();
    }
}
