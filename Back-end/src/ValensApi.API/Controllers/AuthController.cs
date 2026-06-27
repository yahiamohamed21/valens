using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Auth;
using ValensApi.Application.Interfaces;

namespace ValensApi.API.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register-customer")]
    public async Task<IActionResult> RegisterCustomer([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        if (result == null)
        {
            return BadRequest("Email is already registered.");
        }

        return Ok(result);
    }

    [HttpPost("register-new-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RegisterNewAdmin([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAdminAsync(dto);
        if (result == null)
        {
            return BadRequest("Email is already registered.");
        }

        return Ok(result);
    }

    [HttpPost("login-user")]
    public async Task<IActionResult> LoginUser([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (result == null)
        {
            return BadRequest("Invalid email or password.");
        }

        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto dto)
    {
        var success = await _authService.SendForgotPasswordOtpAsync(dto);
        if (!success)
        {
            return BadRequest("Email not found.");
        }

        return Ok(new { Message = "OTP verification code sent to your email." });
    }

    [HttpPost("reset-password-otp")]
    public async Task<IActionResult> ResetPasswordOtp([FromBody] ResetPasswordWithOtpDto dto)
    {
        var success = await _authService.ResetPasswordWithOtpAsync(dto);
        if (!success)
        {
            return BadRequest("Invalid or expired OTP code, or password confirmation does not match.");
        }

        return Ok(new { Message = "Password has been reset successfully." });
    }

    [HttpPost("change-customer-password")]
    [Authorize]
    public async Task<IActionResult> ChangeCustomerPassword([FromBody] ChangePasswordDto dto)
    {
        var userId = CurrentUserId;
        if (userId == Guid.Empty)
        {
            return Unauthorized("User is not authorized.");
        }

        var success = await _authService.ChangePasswordAsync(userId, dto);
        if (!success)
        {
            return BadRequest("Invalid old password, or new passwords do not match.");
        }

        return Ok(new { Message = "Password updated successfully." });
    }

    [HttpPost("change-admin-password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ChangeAdminPassword([FromBody] ChangePasswordDto dto)
    {
        var userId = CurrentUserId;
        if (userId == Guid.Empty)
        {
            return Unauthorized("User is not authorized.");
        }

        var success = await _authService.ChangePasswordAsync(userId, dto);
        if (!success)
        {
            return BadRequest("Invalid old password, or new passwords do not match.");
        }

        return Ok(new { Message = "Admin password updated successfully." });
    }
}
