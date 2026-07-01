using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Products;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IProductService
{
    Task<ValensApi.Application.DTOs.Common.PaginatedList<Product>> GetAllAsync(string? category, string? search, decimal? minPrice, decimal? maxPrice, string? sortBy, bool isAdmin, int pageNumber = 1, int pageSize = 10);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> CreateAsync(ProductUpsertDto dto);
    Task<bool> UpdateAsync(Guid id, ProductUpsertDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ToggleVisibilityAsync(Guid id);
    Task<HomepageSectionsDto> GetHomepageSectionsAsync();
    Task<List<ValensApi.Application.DTOs.Home.HomeSectionProductCardDto>> SearchAdminProductsAsync(string? query, int limit);
}
