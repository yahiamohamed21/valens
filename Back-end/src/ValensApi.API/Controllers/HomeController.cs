using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Home;
using ValensApi.Application.Interfaces;

namespace ValensApi.API.Controllers;

[ApiController]
[Route("api")]
public class HomeController : ControllerBase
{
    private readonly IHomeControlService _homeControlService;

    public HomeController(IHomeControlService homeControlService)
    {
        _homeControlService = homeControlService;
    }

    // ── Public Endpoint ───────────────────────────────────────────────────────

    [HttpGet("home")]
    public async Task<IActionResult> GetHomePage()
    {
        var data = await _homeControlService.GetHomePageAsync();
        return Ok(new { success = true, data });
    }

    // ── Hero Banners ──────────────────────────────────────────────────────────

    [HttpGet("admin/home-control/hero-banners")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetHeroBanners()
    {
        var data = await _homeControlService.GetAllBannersAsync();
        return Ok(new { success = true, data });
    }

    [HttpPost("admin/home-control/hero-banners")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateHeroBanner([FromBody] CreateHomeBannerDto dto)
    {
        var data = await _homeControlService.CreateBannerAsync(dto);
        return Ok(new { success = true, data });
    }

    [HttpPatch("admin/home-control/hero-banners/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateHeroBanner(Guid id, [FromBody] UpdateHomeBannerDto dto)
    {
        try
        {
            var data = await _homeControlService.UpdateBannerAsync(id, dto);
            return Ok(new { success = true, data });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("admin/home-control/hero-banners/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteHeroBanner(Guid id)
    {
        try
        {
            await _homeControlService.DeleteBannerAsync(id);
            return Ok(new { success = true, message = "Hero banner deleted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("admin/home-control/hero-banners/{id:guid}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleHeroBanner(Guid id, [FromBody] ToggleActiveDto dto)
    {
        try
        {
            var data = await _homeControlService.ToggleBannerAsync(id, dto.IsActive);
            return Ok(new { success = true, data });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("admin/home-control/hero-banners/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReorderHeroBanners([FromBody] ReorderDto dto)
    {
        await _homeControlService.ReorderBannersAsync(dto.Items);
        return Ok(new { success = true, message = "Hero banners reordered successfully" });
    }

    // ── Section Products ──────────────────────────────────────────────────────

    [HttpGet("admin/home-control/sections/{section_key}/products")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetSectionProducts(string section_key)
    {
        try
        {
            var data = await _homeControlService.GetSectionProductsAsync(section_key);
            return Ok(new { success = true, data });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPost("admin/home-control/sections/{section_key}/products")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddProductToSection(string section_key, [FromBody] AddSectionProductDto dto)
    {
        try
        {
            var data = await _homeControlService.AddProductToSectionAsync(section_key, dto);
            return Ok(new { success = true, data });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("admin/home-control/section-products/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSectionProduct(Guid id, [FromBody] UpdateSectionProductDto dto)
    {
        try
        {
            var data = await _homeControlService.UpdateSectionProductAsync(id, dto);
            return Ok(new { success = true, data });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("admin/home-control/section-products/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSectionProduct(Guid id)
    {
        try
        {
            await _homeControlService.DeleteSectionProductAsync(id);
            return Ok(new { success = true, message = "Product removed from homepage section successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("admin/home-control/section-products/{id:guid}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleSectionProduct(Guid id, [FromBody] ToggleActiveDto dto)
    {
        try
        {
            var data = await _homeControlService.ToggleSectionProductAsync(id, dto.IsActive);
            return Ok(new { success = true, data });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("admin/home-control/sections/{section_key}/products/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReorderSectionProducts(string section_key, [FromBody] ReorderDto dto)
    {
        try
        {
            await _homeControlService.ReorderSectionProductsAsync(section_key, dto.Items);
            return Ok(new { success = true, message = "Section products reordered successfully" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    // ── Performance Stories & Lab Notes ──────────────────────────────────────────

    [HttpGet("admin/home-control/stories")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetStories()
    {
        var data = await _homeControlService.GetAllStoriesAsync();
        return Ok(new { success = true, data });
    }

    [HttpPost("admin/home-control/stories")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateStory([FromBody] CreateHomeStoryDto dto)
    {
        var data = await _homeControlService.CreateStoryAsync(dto);
        return Ok(new { success = true, data });
    }

    [HttpPatch("admin/home-control/stories/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStory(Guid id, [FromBody] UpdateHomeStoryDto dto)
    {
        try
        {
            var data = await _homeControlService.UpdateStoryAsync(id, dto);
            return Ok(new { success = true, data });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("admin/home-control/stories/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteStory(Guid id)
    {
        try
        {
            await _homeControlService.DeleteStoryAsync(id);
            return Ok(new { success = true, message = "Story deleted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("admin/home-control/stories/{id:guid}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleStory(Guid id, [FromBody] ToggleActiveDto dto)
    {
        try
        {
            var data = await _homeControlService.ToggleStoryAsync(id, dto.IsActive);
            return Ok(new { success = true, data });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("admin/home-control/stories/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReorderStories([FromBody] ReorderDto dto)
    {
        await _homeControlService.ReorderStoriesAsync(dto.Items);
        return Ok(new { success = true, message = "Stories reordered successfully" });
    }
}
