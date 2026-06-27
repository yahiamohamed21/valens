using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Products;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<Product>> GetAllAsync(
        string? category, 
        string? search, 
        decimal? minPrice, 
        decimal? maxPrice, 
        string? sortBy, 
        bool isAdmin)
    {
        var query = _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .AsNoTracking();

        if (!isAdmin)
        {
            query = query.Where(p => p.Visible);
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.CategoryName.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) || 
                                     p.Description.ToLower().Contains(searchLower));
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice.Value);
        }
        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice.Value);
        }

        query = sortBy switch
        {
            "price_asc" => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            "name_asc" => query.OrderBy(p => p.Name),
            "name_desc" => query.OrderByDescending(p => p.Name),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        return await query.ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product> CreateAsync(ProductUpsertDto dto)
    {
        var categoryName = dto.Category.Trim();
        var categoryList = await _unitOfWork.Categories.FindAsync(c => c.Name.ToLower() == categoryName.ToLower());
        var category = categoryList.FirstOrDefault();

        if (category == null)
        {
            category = new Category { Name = categoryName, IsActive = true };
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
        }

        string mainImage = SaveBase64Image(dto.MainImage);
        var galleryImages = dto.Images.Select(img => SaveBase64Image(img)).Where(url => !string.IsNullOrEmpty(url)).ToList();

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            CategoryId = category.Id,
            CategoryName = category.Name,
            Featured = dto.Featured,
            BestSeller = dto.BestSeller,
            NewArrival = dto.NewArrival,
            Visible = dto.Visible,
            VariantType = dto.VariantType,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            Size = dto.Size,
            Stock = dto.Stock,
            Sku = dto.Sku,
            MainImage = mainImage,
            Images = galleryImages,
            Ingredients = dto.Ingredients,
            Usage = dto.Usage,
            Benefits = dto.Benefits,
            ImageType = dto.ImageType,
            ImageColor = dto.ImageColor
        };

        if (dto.VariantType != "none" && dto.Variants != null)
        {
            foreach (var vDto in dto.Variants)
            {
                var variant = new ProductVariant
                {
                    VariantId = string.IsNullOrEmpty(vDto.Id) ? "var-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() : vDto.Id,
                    Size = vDto.Size,
                    Flavor = vDto.Flavor,
                    Price = vDto.Price,
                    DiscountPrice = vDto.DiscountPrice,
                    StockQuantity = vDto.StockQuantity,
                    Sku = vDto.Sku,
                    Image = SaveBase64Image(vDto.Image),
                    IsAvailable = vDto.IsAvailable
                };
                product.Variants.Add(variant);
            }
        }

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return product;
    }

    public async Task<bool> UpdateAsync(Guid id, ProductUpsertDto dto)
    {
        var product = await _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return false;
        }

        var categoryName = dto.Category.Trim();
        var categoryList = await _unitOfWork.Categories.FindAsync(c => c.Name.ToLower() == categoryName.ToLower());
        var category = categoryList.FirstOrDefault();

        if (category == null)
        {
            category = new Category { Name = categoryName, IsActive = true };
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
        }

        string mainImage = SaveBase64Image(dto.MainImage);
        var galleryImages = dto.Images.Select(img => SaveBase64Image(img)).Where(url => !string.IsNullOrEmpty(url)).ToList();

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.CategoryId = category.Id;
        product.CategoryName = category.Name;
        product.Featured = dto.Featured;
        product.BestSeller = dto.BestSeller;
        product.NewArrival = dto.NewArrival;
        product.Visible = dto.Visible;
        product.VariantType = dto.VariantType;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.Size = dto.Size;
        product.Stock = dto.Stock;
        product.Sku = dto.Sku;
        product.MainImage = mainImage;
        product.Images = galleryImages;
        product.Ingredients = dto.Ingredients;
        product.Usage = dto.Usage;
        product.Benefits = dto.Benefits;
        product.ImageType = dto.ImageType;
        product.ImageColor = dto.ImageColor;

        // Remove variants
        var existingVariants = await _unitOfWork.ProductVariants.FindAsync(v => v.ProductId == id);
        foreach (var ev in existingVariants)
        {
            _unitOfWork.ProductVariants.Delete(ev);
        }

        if (dto.VariantType != "none" && dto.Variants != null)
        {
            foreach (var vDto in dto.Variants)
            {
                var variant = new ProductVariant
                {
                    VariantId = string.IsNullOrEmpty(vDto.Id) ? "var-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() : vDto.Id,
                    ProductId = product.Id,
                    Size = vDto.Size,
                    Flavor = vDto.Flavor,
                    Price = vDto.Price,
                    DiscountPrice = vDto.DiscountPrice,
                    StockQuantity = vDto.StockQuantity,
                    Sku = vDto.Sku,
                    Image = SaveBase64Image(vDto.Image),
                    IsAvailable = vDto.IsAvailable
                };
                product.Variants.Add(variant);
            }
        }

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
        {
            return false;
        }

        _unitOfWork.Products.SoftDelete(product);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    private string SaveBase64Image(string base64String)
    {
        if (string.IsNullOrEmpty(base64String)) return string.Empty;

        if (base64String.StartsWith("http") || base64String.StartsWith("/uploads"))
        {
            return base64String;
        }

        try
        {
            var base64Parts = base64String.Split(new[] { "base64," }, StringSplitOptions.None);
            var actualBase64 = base64Parts.Length > 1 ? base64Parts[1] : base64Parts[0];

            byte[] imageBytes = Convert.FromBase64String(actualBase64);

            string extension = ".jpg";
            if (base64String.Contains("image/png")) extension = ".png";
            else if (base64String.Contains("image/webp")) extension = ".webp";
            else if (base64String.Contains("image/gif")) extension = ".gif";

            string fileName = Guid.NewGuid().ToString() + extension;
            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string filePath = Path.Combine(uploadsFolder, fileName);
            System.IO.File.WriteAllBytes(filePath, imageBytes);

            return "/uploads/" + fileName;
        }
        catch
        {
            return base64String;
        }
    }
}
