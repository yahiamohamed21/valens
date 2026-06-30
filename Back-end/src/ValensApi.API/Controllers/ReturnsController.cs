using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Returns;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

[Authorize(Roles = "Admin")]
public class ReturnsController : BaseApiController
{
    private readonly IReturnService _returnService;

    public ReturnsController(IReturnService returnService)
    {
        _returnService = returnService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateReturn([FromBody] CreateReturnDto dto)
    {
        try
        {
            var result = await _returnService.CreateReturnAsync(dto);
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
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred creating return record: {ex.Message}");
        }
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<OrderReturn>>> GetReturnsList()
    {
        var returns = await _returnService.GetAllReturnsAsync();
        return Ok(returns);
    }
}
