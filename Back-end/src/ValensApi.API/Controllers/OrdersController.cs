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

    /// <summary>
    /// Returns the authenticated user's saved profile (name, email, phone,
    /// address, city) so the frontend can pre-fill the checkout form
    /// without asking the customer to re-type their details.
    /// </summary>
    [HttpGet("checkout-profile")]
    [Authorize]
    public async Task<IActionResult> GetCheckoutProfile()
    {
        var userId = CurrentUserId;
        if (userId == Guid.Empty)
            return Unauthorized("User is not authorized.");

        var profile = await _orderService.GetCheckoutProfileAsync(userId);
        if (profile == null)
            return NotFound("User profile not found.");

        return Ok(profile);
    }

    [HttpPost("preview-checkout")]
    [HttpPost("checkout-preview")]

    public async Task<IActionResult> PreviewCheckout([FromBody] CheckoutDto dto)
    {
        try
        {
            var preview = await _orderService.PreviewCheckoutAsync(dto);
            return Ok(preview);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpPost("checkout-order")]
    [HttpPost("checkout")]
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
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred processing order: {ex.Message}");
        }
    }

    [HttpGet("my-history")]
    [Authorize]
    public async Task<IActionResult> GetMyOrdersHistory([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userId = CurrentUserId;
        if (userId == Guid.Empty)
        {
            return Unauthorized("User is not authorized.");
        }

        var orders = await _orderService.GetMyOrdersAsync(userId, pageNumber, pageSize);
        return Ok(orders);
    }

    [HttpPost("list-admin-orders")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminOrders([FromBody] OrderAdminFilterDto dto)
    {
        var orders = await _orderService.GetAllOrdersAsync(dto?.Search, dto?.Category, dto?.PageNumber ?? 1, dto?.PageSize ?? 10);
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

    [HttpPost("update-order-status-by-number")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatusByNumber([FromBody] UpdateOrderStatusByNumberDto dto)
    {
        var success = await _orderService.UpdateStatusByNumberAsync(dto.OrderNumber, dto.Status);
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
