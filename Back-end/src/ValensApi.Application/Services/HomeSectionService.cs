using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.HomeControl;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;
using ValensApi.Application.Validators;

namespace ValensApi.Application.Services;

public class HomeSectionService : IHomeSectionService
{
    private readonly IUnitOfWork _unitOfWork;

    public HomeSectionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<HomeSectionProductResponseDto>> GetBySectionAsync(string sectionKey)
    {
        if (!HomeSectionProductRequestDtoValidator.IsValidSectionKey(sectionKey))
        {
            return new List<HomeSectionProductResponseDto>();
        }

        var sectionProducts = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(sp => sp.Product)
            .Where(sp => sp.SectionKey == sectionKey.ToLower())
            .OrderBy(sp => sp.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return sectionProducts.Select(MapToResponseDto).ToList();
    }

    public async Task<HomeSectionProductResponseDto> AddToSectionAsync(string sectionKey, HomeSectionProductRequestDto dto)
    {
        if (!HomeSectionProductRequestDtoValidator.IsValidSectionKey(sectionKey))
        {
            throw new ArgumentException($"Invalid section key: {sectionKey}");
        }

        var productExists = await _unitOfWork.Products.GetByIdAsync(dto.ProductId);
        if (productExists == null)
        {
            throw new ArgumentException("Product not found.");
        }

        var sectionProduct = new HomeSectionProduct
        {
            SectionKey = sectionKey.ToLower(),
            ProductId = dto.ProductId,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder
        };

        await _unitOfWork.HomeSectionProducts.AddAsync(sectionProduct);
        await _unitOfWork.SaveChangesAsync();

        var created = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(sp => sp.Product)
            .FirstOrDefaultAsync(sp => sp.Id == sectionProduct.Id);

        return MapToResponseDto(created!);
    }

    public async Task<HomeSectionProductResponseDto?> UpdateAsync(Guid id, HomeSectionProductRequestDto dto)
    {
        var sectionProduct = await _unitOfWork.HomeSectionProducts.GetByIdAsync(id);
        if (sectionProduct == null) return null;

        sectionProduct.IsActive = dto.IsActive;
        sectionProduct.DisplayOrder = dto.DisplayOrder;

        _unitOfWork.HomeSectionProducts.Update(sectionProduct);
        await _unitOfWork.SaveChangesAsync();

        var updated = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(sp => sp.Product)
            .FirstOrDefaultAsync(sp => sp.Id == id);

        return MapToResponseDto(updated!);
    }

    public async Task<bool> RemoveAsync(Guid id)
    {
        var sectionProduct = await _unitOfWork.HomeSectionProducts.GetByIdAsync(id);
        if (sectionProduct == null) return false;

        _unitOfWork.HomeSectionProducts.SoftDelete(sectionProduct);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive)
    {
        var sectionProduct = await _unitOfWork.HomeSectionProducts.GetByIdAsync(id);
        if (sectionProduct == null) return false;

        sectionProduct.IsActive = isActive;
        _unitOfWork.HomeSectionProducts.Update(sectionProduct);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderAsync(string sectionKey, ReorderDto dto)
    {
        if (!HomeSectionProductRequestDtoValidator.IsValidSectionKey(sectionKey))
        {
            return false;
        }

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            foreach (var item in dto.Items)
            {
                var sectionProduct = await _unitOfWork.HomeSectionProducts.GetByIdAsync(item.Id);
                if (sectionProduct == null || sectionProduct.SectionKey != sectionKey.ToLower())
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return false;
                }
                sectionProduct.DisplayOrder = item.DisplayOrder;
                _unitOfWork.HomeSectionProducts.Update(sectionProduct);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<List<ProductCardDto>> GetActiveBySectionAsync(string sectionKey)
    {
        if (!HomeSectionProductRequestDtoValidator.IsValidSectionKey(sectionKey))
        {
            return new List<ProductCardDto>();
        }

        var sectionProducts = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(sp => sp.Product)
            .Where(sp => sp.SectionKey == sectionKey.ToLower() && sp.IsActive)
            .OrderBy(sp => sp.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return sectionProducts.Select(sp => MapToProductCardDto(sp.Product!)).ToList();
    }

    public async Task<List<ProductSearchResponseDto>> SearchProductsAsync(string? query, int limit)
    {
        var productsQuery = _unitOfWork.Products.GetQueryable()
            .AsNoTracking();

        if (!string.IsNullOrEmpty(query))
        {
            var searchLower = query.ToLower();
            productsQuery = productsQuery.Where(p => 
                p.Name.ToLower().Contains(searchLower) || 
                p.Description.ToLower().Contains(searchLower));
        }

        if (limit > 0)
        {
            productsQuery = productsQuery.Take(limit);
        }

        var products = await productsQuery.ToListAsync();

        return products.Select(p => new ProductSearchResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Name.ToLower().Replace(" ", "-"),
            Price = p.Price,
            Currency = "EGP",
            Image = p.MainImage,
            StockStatus = GetStockStatus(p.Stock)
        }).ToList();
    }

    private static HomeSectionProductResponseDto MapToResponseDto(HomeSectionProduct sp)
    {
        return new HomeSectionProductResponseDto
        {
            Id = sp.Id,
            SectionProductId = sp.Id,
            SectionKey = sp.SectionKey,
            ProductId = sp.ProductId,
            IsActive = sp.IsActive,
            DisplayOrder = sp.DisplayOrder,
            Product = sp.Product != null ? MapToProductCardDto(sp.Product) : null
        };
    }

    private static ProductCardDto MapToProductCardDto(Product product)
    {
        var badges = new List<string>();
        if (product.Featured) badges.Add("FEATURED");
        if (product.BestSeller) badges.Add("BEST SELLER");
        if (product.NewArrival) badges.Add("NEW");

        return new ProductCardDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Name.ToLower().Replace(" ", "-"),
            Description = product.Description,
            Price = product.Price,
            Currency = "EGP",
            Image = product.MainImage,
            Rating = 0,
            ReviewsCount = 0,
            StockStatus = GetStockStatus(product.Stock),
            Badges = badges
        };
    }

    private static string GetStockStatus(int stock)
    {
        if (stock <= 0) return "out_of_stock";
        if (stock <= 10) return "low_stock";
        return "in_stock";
    }
}
