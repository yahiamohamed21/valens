using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Categories;
using ValensApi.Application.DTOs.Common;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

public class CategoriesController : BaseApiController
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet("list-active-product-categories")]
    public async Task<ActionResult<IEnumerable<Category>>> GetActiveCategories()
    {
        var categories = await _categoryService.GetAllActiveAsync();
        return Ok(categories);
    }

    [HttpGet("list-admin-product-categories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Category>>> GetAdminAllCategories()
    {
        var categories = await _categoryService.AdminGetAllAsync();
        return Ok(categories);
    }

    [HttpPost("create-product-category")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Category>> CreateCategory([FromBody] CategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);
        if (category == null)
        {
            return BadRequest("Category name already exists.");
        }

        return CreatedAtAction(nameof(GetActiveCategories), new { id = category.Id }, category);
    }

    [HttpPost("update-product-category")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryDto dto)
    {
        var categoryDto = new CategoryDto
        {
            Name = dto.Name,
            IsActive = dto.IsActive
        };
        var success = await _categoryService.UpdateAsync(dto.Id, categoryDto);
        if (!success)
        {
            return NotFound("Category not found.");
        }

        return NoContent();
    }

    [HttpPost("delete-product-category")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory([FromBody] IdRequestDto dto)
    {
        var success = await _categoryService.DeleteAsync(dto.Id);
        if (!success)
        {
            return NotFound("Category not found.");
        }

        return NoContent();
    }
}
