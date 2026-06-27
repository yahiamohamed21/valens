using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Categories;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllActiveAsync();
    Task<IEnumerable<Category>> AdminGetAllAsync();
    Task<Category?> CreateAsync(CategoryDto dto);
    Task<bool> UpdateAsync(Guid id, CategoryDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ToggleActiveAsync(Guid id);
}
