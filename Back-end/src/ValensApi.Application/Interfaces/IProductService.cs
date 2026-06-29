using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Products;
using ValensApi.Application.DTOs.Common;

namespace ValensApi.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductResponseDto>> GetAllAsync(
        string? category, 
        string? search, 
        decimal? minPrice, 
        decimal? maxPrice, 
        string? sortBy, 
        int pageNumber,
        int pageSize,
        bool isAdmin);
    Task<ProductResponseDto?> GetByIdAsync(Guid id);
    Task<ProductResponseDto> CreateAsync(ProductUpsertDto dto);
    Task<bool> UpdateAsync(Guid id, ProductUpsertDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ToggleVisibilityAsync(Guid id);
    Task<HomepageSectionsDto> GetHomepageSectionsAsync();
}
