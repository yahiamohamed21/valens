using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Categories;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponseDto>> GetAllActiveAsync();
    Task<IEnumerable<CategoryResponseDto>> AdminGetAllAsync();
    Task<CategoryResponseDto?> CreateAsync(CategoryDto dto);
    Task<bool> UpdateAsync(Guid id, CategoryDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ToggleActiveAsync(Guid id);
}
