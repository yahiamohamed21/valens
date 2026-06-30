using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Common;
using ValensApi.Application.DTOs.Products;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.API.Controllers;

public class ProductsController : BaseApiController
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost("list-products")]
    public async Task<IActionResult> GetProducts([FromBody] ProductFilterDto dto)
    {
        bool isAdmin = User.Identity?.IsAuthenticated == true && User.IsInRole("Admin");
        var products = await _productService.GetAllAsync(
            dto.Category, 
            dto.Search, 
            dto.MinPrice, 
            dto.MaxPrice, 
            dto.SortBy, 
            isAdmin,
            dto.PageNumber,
            dto.PageSize
        );
        return Ok(products);
    }

    [HttpPost("list-homepage-sections")]
    public async Task<ActionResult<HomepageSectionsDto>> GetHomepageSections()
    {
        var sections = await _productService.GetHomepageSectionsAsync();
        return Ok(sections);
    }

    [HttpPost("detail-product")]
    public async Task<ActionResult<Product>> GetProductById([FromBody] IdRequestDto dto)
    {
        var product = await _productService.GetByIdAsync(dto.Id);
        if (product == null)
        {
            return NotFound("Product not found.");
        }

        return Ok(product);
    }

    [HttpPost("create-product")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] ProductUpsertDto dto)
    {
        try
        {
            var product = await _productService.CreateAsync(dto);
            return Ok(product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("create-product-form")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> CreateProductForm([FromForm] ProductUpsertDto dto)
    {
        try
        {
            var product = await _productService.CreateAsync(dto);
            return Ok(product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("update-product")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct([FromBody] ProductUpsertDto dto)
    {
        if (!dto.Id.HasValue)
        {
            return BadRequest("Product Id is required for updates.");
        }

        try
        {
            var success = await _productService.UpdateAsync(dto.Id.Value, dto);
            if (!success)
            {
                return NotFound("Product not found.");
            }

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("update-product-form")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProductForm([FromForm] ProductUpsertDto dto)
    {
        if (!dto.Id.HasValue)
        {
            return BadRequest("Product Id is required for updates.");
        }

        try
        {
            var success = await _productService.UpdateAsync(dto.Id.Value, dto);
            if (!success)
            {
                return NotFound("Product not found.");
            }

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("delete-product")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct([FromBody] IdRequestDto dto)
    {
        var success = await _productService.DeleteAsync(dto.Id);
        if (!success)
        {
            return NotFound("Product not found.");
        }

        return NoContent();
    }

    [HttpPost("toggle-product")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleProduct([FromBody] IdRequestDto dto)
    {
        var success = await _productService.ToggleVisibilityAsync(dto.Id);
        if (!success)
        {
            return NotFound("Product not found.");
        }

        return NoContent();
    }
}
