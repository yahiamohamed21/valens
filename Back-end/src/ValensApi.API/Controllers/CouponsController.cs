using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Common;
using ValensApi.Application.DTOs.Coupons;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

public class CouponsController : BaseApiController
{
    private readonly ICouponService _couponService;

    public CouponsController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    [HttpPost("validate-coupon")]
    public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponDto dto)
    {
        try
        {
            var result = await _couponService.ValidateCouponAsync(dto);
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
            return StatusCode(500, $"An error occurred validating coupon: {ex.Message}");
        }
    }

    [HttpGet("list-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<CouponResponseDto>>> GetAdminCoupons()
    {
        var coupons = await _couponService.GetAllCouponsAsync();
        return Ok(coupons);
    }

    [HttpPost("create-coupon")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CouponResponseDto>> CreateCoupon([FromBody] CouponDto dto)
    {
        var coupon = await _couponService.CreateCouponAsync(dto);
        if (coupon == null)
        {
            return BadRequest("Coupon code already exists.");
        }

        return CreatedAtAction(nameof(GetAdminCoupons), new { id = coupon.Id }, coupon);
    }

    [HttpPost("update-coupon")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCoupon([FromBody] CouponDto dto)
    {
        if (!dto.Id.HasValue)
        {
            return BadRequest("Coupon Id is required for updates.");
        }

        var success = await _couponService.UpdateCouponAsync(dto.Id.Value, dto);
        if (!success)
        {
            return NotFound("Coupon code not found.");
        }

        return NoContent();
    }

    [HttpPost("delete-coupon")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCoupon([FromBody] IdRequestDto dto)
    {
        var success = await _couponService.DeleteCouponAsync(dto.Id);
        if (!success)
        {
            return NotFound("Coupon code not found.");
        }

        return NoContent();
    }

    [HttpPost("toggle-coupon")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleCoupon([FromBody] IdRequestDto dto)
    {
        var success = await _couponService.ToggleActiveAsync(dto.Id);
        if (!success)
        {
            return NotFound("Coupon code not found.");
        }

        return NoContent();
    }
}
