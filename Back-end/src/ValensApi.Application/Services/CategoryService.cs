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

    public async Task<IEnumerable<Category>> GetAllActiveAsync()
    {
        var categories = await _unitOfWork.Categories.FindAsync(c => c.IsActive);
        return categories.OrderBy(c => c.Name);
    }

    public async Task<IEnumerable<Category>> AdminGetAllAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        return categories.OrderBy(c => c.Name);
    }

    public async Task<Category?> CreateAsync(CategoryDto dto)
    {
        var existing = await _unitOfWork.Categories.FindAsync(c => c.Name.ToLower() == dto.Name.ToLower());
        if (existing.Any())
        {
            return null;
        }

        var category = new Category
        {
            Name = dto.Name,
            IsActive = dto.IsActive
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return category;
    }

    public async Task<bool> UpdateAsync(Guid id, CategoryDto dto)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
        {
            return false;
        }

        category.Name = dto.Name;
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
