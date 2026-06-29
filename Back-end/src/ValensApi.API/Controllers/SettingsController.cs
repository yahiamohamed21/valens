using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Settings;
using ValensApi.Application.Interfaces;

namespace ValensApi.API.Controllers;

public class SettingsController : BaseApiController
{
    private readonly ISettingService _settingService;

    public SettingsController(ISettingService settingService)
    {
        _settingService = settingService;
    }

    [HttpGet("store-config")]
    public async Task<IActionResult> GetStoreSettings()
    {
        var settings = await _settingService.GetStoreSettingsAsync();
        return Ok(settings);
    }

    [HttpGet("homepage-config")]
    public async Task<IActionResult> GetHomepageSettings()
    {
        var settings = await _settingService.GetHomepageSettingsAsync();
        return Ok(settings);
    }

    [HttpPut("update-store-config")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStoreSettings([FromBody] UpdateStoreSettingsDto dto)
    {
        await _settingService.UpdateStoreSettingsAsync(dto);
        return NoContent();
    }

    [HttpPut("update-homepage-config")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateHomepageSettings([FromForm] UpdateHomepageSettingsDto dto)
    {
        try
        {
            await _settingService.UpdateHomepageSettingsAsync(dto);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("homepage-overview")]
    public async Task<IActionResult> GetHomepageOverview()
    {
        var overview = await _settingService.GetHomepageOverviewAsync();
        return Ok(overview);
    }

    [HttpGet("governorates")]
    public async Task<IActionResult> GetGovernorateShippings()
    {
        var shippings = await _settingService.GetGovernorateShippingsAsync();
        return Ok(shippings);
    }

    [HttpPut("update-governorate-shipping")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGovernorateShipping([FromBody] UpdateGovernorateShippingDto dto)
    {
        var success = await _settingService.UpdateGovernorateShippingAsync(dto);
        if (!success)
        {
            return NotFound("Governorate shipping setting not found.");
        }

        return NoContent();
    }

    [HttpPost("create-governorate-shipping")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGovernorateShipping([FromBody] CreateGovernorateShippingDto dto)
    {
        var result = await _settingService.CreateGovernorateShippingAsync(dto);
        if (result == null)
        {
            return BadRequest("Governorate already exists.");
        }

        return CreatedAtAction(nameof(GetGovernorateShippings), new { id = result.Id }, result);
    }

    [HttpPost("create-admin-account")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAdminAccount([FromBody] ValensApi.Application.DTOs.Auth.RegisterDto dto, [FromServices] IAuthService authService)
    {
        var result = await authService.RegisterAdminAsync(dto);
        if (result == null)
        {
            return BadRequest("Email is already registered.");
        }

        return Ok(result);
    }
}
