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
    public async Task<IActionResult> UpdateHomepageSettings([FromBody] UpdateHomepageSettingsDto dto)
    {
        await _settingService.UpdateHomepageSettingsAsync(dto);
        return NoContent();
    }
}
