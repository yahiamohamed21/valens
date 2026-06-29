using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Common;
using ValensApi.Application.DTOs.Customers;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

public class CustomersController : BaseApiController
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost("list-admin-customers")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminCustomers([FromBody] CustomerAdminFilterDto dto)
    {
        var customers = await _customerService.GetAllAsync(dto?.Search, dto?.PageNumber ?? 1, dto?.PageSize ?? 10);
        return Ok(customers);
    }

    [HttpPost("detail-admin-customer")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> GetCustomerById([FromBody] IdRequestDto dto)
    {
        var result = await _customerService.GetByIdAsync(dto.Id);
        if (result == null)
        {
            return NotFound("Customer not found.");
        }

        return Ok(result);
    }

    [HttpPut("update-profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = CurrentUserId;
        if (userId == Guid.Empty)
        {
            return Unauthorized("User is not authorized.");
        }

        var success = await _customerService.UpdateProfileAsync(userId, dto);
        if (!success)
        {
            return NotFound("Customer profile not found.");
        }

        return NoContent();
    }
}
