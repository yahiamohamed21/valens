using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Categories;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    private static CategoryResponseDto MapToResponseDto(Category category)
    {
        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            ImageColor = category.ImageColor,
            Visible = category.IsActive
        };
    }

    public async Task<IEnumerable<CategoryResponseDto>> GetAllActiveAsync()
    {
        var categories = await _unitOfWork.Categories.FindAsync(c => c.IsActive);
        return categories.OrderBy(c => c.Name).Select(MapToResponseDto);
    }

    public async Task<IEnumerable<CategoryResponseDto>> AdminGetAllAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        return categories.OrderBy(c => c.Name).Select(MapToResponseDto);
    }

    public async Task<CategoryResponseDto?> CreateAsync(CategoryDto dto)
    {
        var existing = await _unitOfWork.Categories.FindAsync(c => c.Name.ToLower() == dto.Name.ToLower());
        if (existing.Any())
        {
            return null;
        }

        var category = new Category
        {
            Name = dto.Name,
            Slug = string.IsNullOrEmpty(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug,
            ImageColor = string.IsNullOrEmpty(dto.ImageColor) ? "#FF8A75" : dto.ImageColor,
            IsActive = dto.IsActive
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return MapToResponseDto(category);
    }

    public async Task<bool> UpdateAsync(Guid id, CategoryDto dto)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
        {
            return false;
        }

        category.Name = dto.Name;
        category.Slug = string.IsNullOrEmpty(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug;
        category.ImageColor = string.IsNullOrEmpty(dto.ImageColor) ? "#FF8A75" : dto.ImageColor;
        category.IsActive = dto.IsActive;

        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
        {
            return false;
        }

        _unitOfWork.Categories.SoftDelete(category);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleActiveAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
        {
            return false;
        }

        category.IsActive = !category.IsActive;
        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
