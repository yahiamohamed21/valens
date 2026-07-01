using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Common;
using ValensApi.Application.DTOs.HomeControl;
using ValensApi.Application.Interfaces;

namespace ValensApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    private readonly IHomeService _homeService;
    private readonly IHomeBannerService _homeBannerService;
    private readonly IHomeStoryService _homeStoryService;
    private readonly IHomeSectionService _homeSectionService;

    public HomeController(
        IHomeService homeService,
        IHomeBannerService homeBannerService,
        IHomeStoryService homeStoryService,
        IHomeSectionService homeSectionService)
    {
        _homeService = homeService;
        _homeBannerService = homeBannerService;
        _homeStoryService = homeStoryService;
        _homeSectionService = homeSectionService;
    }

    // Public endpoint
    [HttpGet]
    public async Task<ActionResult<HomePublicResponseDto>> GetPublicHomepage()
    {
        var homepage = await _homeService.GetPublicHomepageAsync();
        return Ok(homepage);
    }

    // Admin endpoints
    [HttpGet("admin/home-control/hero-banners")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> GetHeroBanners()
    {
        var banners = await _homeBannerService.GetAllAsync();
        return Ok(banners);
    }

    [HttpPost("admin/home-control/hero-banners")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HomeBannerResponseDto>> CreateHeroBanner([FromBody] HomeBannerRequestDto dto)
    {
        var banner = await _homeBannerService.CreateAsync(dto);
        return Ok(banner);
    }

    [HttpPatch("admin/home-control/hero-banners/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateHeroBanner(Guid id, [FromBody] HomeBannerRequestDto dto)
    {
        var banner = await _homeBannerService.UpdateAsync(id, dto);
        if (banner == null)
        {
            return NotFound("Hero banner not found.");
        }
        return Ok(banner);
    }

    [HttpDelete("admin/home-control/hero-banners/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteHeroBanner(Guid id)
    {
        var success = await _homeBannerService.DeleteAsync(id);
        if (!success)
        {
            return NotFound("Hero banner not found.");
        }
        return Ok(new { message = "Hero banner deleted successfully" });
    }

    [HttpPatch("admin/home-control/hero-banners/{id}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ToggleHeroBanner(Guid id, [FromBody] ToggleStatusDto dto)
    {
        var success = await _homeBannerService.SetActiveAsync(id, dto.IsActive);
        if (!success)
        {
            return NotFound("Hero banner not found.");
        }
        return NoContent();
    }

    [HttpPatch("admin/home-control/hero-banners/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ReorderHeroBanners([FromBody] ReorderDto dto)
    {
        var success = await _homeBannerService.ReorderAsync(dto);
        if (!success)
        {
            return BadRequest("Failed to reorder hero banners.");
        }
        return NoContent();
    }

    [HttpGet("admin/home-control/stories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> GetStories()
    {
        var stories = await _homeStoryService.GetAllAsync();
        return Ok(stories);
    }

    [HttpPost("admin/home-control/stories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HomeStoryResponseDto>> CreateStory([FromBody] HomeStoryRequestDto dto)
    {
        var story = await _homeStoryService.CreateAsync(dto);
        return Ok(story);
    }

    [HttpPatch("admin/home-control/stories/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateStory(Guid id, [FromBody] HomeStoryRequestDto dto)
    {
        var story = await _homeStoryService.UpdateAsync(id, dto);
        if (story == null)
        {
            return NotFound("Story not found.");
        }
        return Ok(story);
    }

    [HttpDelete("admin/home-control/stories/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteStory(Guid id)
    {
        var success = await _homeStoryService.DeleteAsync(id);
        if (!success)
        {
            return NotFound("Story not found.");
        }
        return NoContent();
    }

    [HttpPatch("admin/home-control/stories/{id}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ToggleStory(Guid id, [FromBody] ToggleStatusDto dto)
    {
        var success = await _homeStoryService.SetActiveAsync(id, dto.IsActive);
        if (!success)
        {
            return NotFound("Story not found.");
        }
        return NoContent();
    }

    [HttpPatch("admin/home-control/stories/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ReorderStories([FromBody] ReorderDto dto)
    {
        var success = await _homeStoryService.ReorderAsync(dto);
        if (!success)
        {
            return BadRequest("Failed to reorder stories.");
        }
        return NoContent();
    }

    [HttpGet("admin/home-control/sections/{sectionKey}/products")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> GetSectionProducts(string sectionKey)
    {
        var products = await _homeSectionService.GetBySectionAsync(sectionKey);
        return Ok(products);
    }

    [HttpPost("admin/home-control/sections/{sectionKey}/products")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<HomeSectionProductResponseDto>> AddSectionProduct(string sectionKey, [FromBody] HomeSectionProductRequestDto dto)
    {
        try
        {
            var sectionProduct = await _homeSectionService.AddToSectionAsync(sectionKey, dto);
            return Ok(sectionProduct);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("admin/home-control/section-products/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateSectionProduct(Guid id, [FromBody] HomeSectionProductRequestDto dto)
    {
        var sectionProduct = await _homeSectionService.UpdateAsync(id, dto);
        if (sectionProduct == null)
        {
            return NotFound("Section product not found.");
        }
        return Ok(sectionProduct);
    }

    [HttpDelete("admin/home-control/section-products/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RemoveSectionProduct(Guid id)
    {
        var success = await _homeSectionService.RemoveAsync(id);
        if (!success)
        {
            return NotFound("Section product not found.");
        }
        return Ok(new { message = "Product removed from homepage section successfully" });
    }

    [HttpPatch("admin/home-control/section-products/{id}/toggle")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ToggleSectionProduct(Guid id, [FromBody] ToggleStatusDto dto)
    {
        var success = await _homeSectionService.SetActiveAsync(id, dto.IsActive);
        if (!success)
        {
            return NotFound("Section product not found.");
        }
        return NoContent();
    }

    [HttpPatch("admin/home-control/sections/{sectionKey}/products/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ReorderSectionProducts(string sectionKey, [FromBody] ReorderDto dto)
    {
        var success = await _homeSectionService.ReorderAsync(sectionKey, dto);
        if (!success)
        {
            return BadRequest("Failed to reorder section products.");
        }
        return NoContent();
    }

    [HttpGet("admin/products/search")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> SearchProducts([FromQuery] string? query = null, [FromQuery] int limit = 20)
    {
        var products = await _homeSectionService.SearchProductsAsync(query, limit);
        return Ok(products);
    }
}
