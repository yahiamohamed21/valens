using Microsoft.AspNetCore.Http;
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
    private readonly IFileStorageService _fileStorageService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ProductService(IUnitOfWork unitOfWork, IFileStorageService fileStorageService, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ValensApi.Application.DTOs.Common.PaginatedList<Product>> GetAllAsync(
        string? category, 
        string? search, 
        decimal? minPrice, 
        decimal? maxPrice, 
        string? sortBy, 
        bool isAdmin,
        int pageNumber = 1,
        int pageSize = 10)
    {
        var query = _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .Include(p => p.Reviews)
            .AsNoTracking();

        if (!isAdmin)
        {
            var activeCategoryIds = _unitOfWork.Categories.GetQueryable()
                .Where(c => c.IsActive)
                .Select(c => (Guid?)c.Id);
            query = query.Where(p => p.Visible && activeCategoryIds.Contains(p.CategoryId));
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.CategoryName.ToLower() == category.ToLower());
        }

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) || 
                                     p.NameAr.ToLower().Contains(searchLower) ||
                                     p.Description.ToLower().Contains(searchLower) ||
                                     p.DescriptionAr.ToLower().Contains(searchLower));
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

        var totalCount = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        foreach (var item in items)
        {
            FormatProductUrls(item);
        }

        return new ValensApi.Application.DTOs.Common.PaginatedList<Product>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .Include(p => p.Reviews)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product != null)
        {
            FormatProductUrls(product);
        }
        return product;
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
            else if (!category.IsActive)
            {
                throw new ArgumentException($"The category '{category.Name}' is hidden/inactive. You cannot assign products to it.");
            }

            string mainImage = "";
            if (dto.MainImageFile != null)
            {
                if (!_fileStorageService.IsValidImage(dto.MainImageFile, out var error))
                    throw new ArgumentException($"Main image: {error}");
                mainImage = await _fileStorageService.SaveFileAsync(dto.MainImageFile, "uploads/products");
            }
            else
            {
                mainImage = SaveBase64Image(dto.MainImage, "products");
            }

            var galleryImages = new List<string>();
            if (dto.ImageFiles != null && dto.ImageFiles.Count > 0)
            {
                foreach (var file in dto.ImageFiles)
                {
                    if (!_fileStorageService.IsValidImage(file, out var error))
                        throw new ArgumentException($"Gallery image: {error}");
                    var url = await _fileStorageService.SaveFileAsync(file, "uploads/products");
                    if (!string.IsNullOrEmpty(url))
                        galleryImages.Add(url);
                }
            }
            if (dto.Images != null && dto.Images.Count > 0)
            {
                foreach (var imgStr in dto.Images)
                {
                    var url = SaveBase64Image(imgStr, "products");
                    if (!string.IsNullOrEmpty(url) && !galleryImages.Contains(url))
                        galleryImages.Add(url);
                }
            }

            var product = new Product
            {
                Name = dto.Name,
                NameAr = dto.NameAr,
                Description = dto.Description,
                DescriptionAr = dto.DescriptionAr,
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
                IngredientsAr = dto.IngredientsAr,
                Usage = dto.Usage,
                UsageAr = dto.UsageAr,
                Benefits = dto.Benefits,
                BenefitsAr = dto.BenefitsAr,
                ImageType = dto.ImageType,
                ImageColor = dto.ImageColor
            };

            if (dto.VariantType != "none" && dto.Variants != null)
            {
                foreach (var vDto in dto.Variants)
                {
                    if (vDto == null) continue;
                    string variantImage = "";
                    if (vDto.ImageFile != null)
                    {
                        if (!_fileStorageService.IsValidImage(vDto.ImageFile, out var error))
                            throw new ArgumentException($"Variant image: {error}");
                        variantImage = await _fileStorageService.SaveFileAsync(vDto.ImageFile, "uploads/variants");
                    }
                    else
                    {
                        variantImage = SaveBase64Image(vDto.Image, "variants");
                    }

                    var variant = new ProductVariant
                    {
                        VariantId = string.IsNullOrEmpty(vDto.Id) ? "var-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() : vDto.Id,
                        Size = vDto.Size,
                        Flavor = vDto.Flavor,
                        Price = vDto.Price,
                        DiscountPrice = vDto.DiscountPrice,
                        StockQuantity = vDto.StockQuantity,
                        Sku = vDto.Sku,
                        Image = variantImage,
                        IsAvailable = vDto.IsAvailable
                    };
                    product.Variants.Add(variant);
                }

                if (product.Variants.Any())
                {
                    product.Price = product.Variants.Min(v => v.Price);
                    var discounts = product.Variants
                        .Where(v => v.DiscountPrice > 0 && v.DiscountPrice < v.Price)
                        .Select(v => v.DiscountPrice)
                        .ToList();
                    product.DiscountPrice = discounts.Any() ? discounts.Min() : 0;
                    product.Stock = product.Variants.Sum(v => v.StockQuantity);
                }
            }

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();
        FormatProductUrls(product);
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
            else if (!category.IsActive)
            {
                throw new ArgumentException($"The category '{category.Name}' is hidden/inactive. You cannot assign products to it.");
            }

            // Normalize all incoming image URL fields to relative paths to prevent mismatches
            dto.MainImage = GetRelativeUrl(dto.MainImage);
            if (dto.ExistingImages != null)
            {
                dto.ExistingImages = dto.ExistingImages.Select(GetRelativeUrl).ToList();
            }
            if (dto.Images != null)
            {
                dto.Images = dto.Images.Select(GetRelativeUrl).ToList();
            }
            if (dto.Variants != null)
            {
                foreach (var v in dto.Variants)
                {
                    v.Image = GetRelativeUrl(v.Image);
                }
            }

            // Handle Main Image update & deletion
            string mainImage = GetRelativeUrl(product.MainImage);
            if (dto.MainImageFile != null)
            {
                if (!_fileStorageService.IsValidImage(dto.MainImageFile, out var error))
                    throw new ArgumentException($"Main image: {error}");
                string newMainImage = await _fileStorageService.SaveFileAsync(dto.MainImageFile, "uploads/products");
                var relativeOldMainImage = GetRelativeUrl(product.MainImage);
                if (!string.IsNullOrEmpty(relativeOldMainImage))
                {
                    _fileStorageService.DeleteFile(relativeOldMainImage);
                }
                mainImage = newMainImage;
            }
            else if (!string.IsNullOrEmpty(dto.MainImage))
            {
                string processedImage = SaveBase64Image(dto.MainImage, "products");
                var relativeOldMainImage = GetRelativeUrl(product.MainImage);
                if (processedImage != relativeOldMainImage)
                {
                    if (!string.IsNullOrEmpty(relativeOldMainImage))
                    {
                        _fileStorageService.DeleteFile(relativeOldMainImage);
                    }
                    mainImage = processedImage;
                }
            }

            // Handle Gallery Images update & deletion
            var newGalleryUrls = new List<string>();
            if (dto.ExistingImages != null)
            {
                newGalleryUrls.AddRange(dto.ExistingImages.Where(url => !string.IsNullOrEmpty(url)));
            }

            if (dto.ImageFiles != null && dto.ImageFiles.Count > 0)
            {
                foreach (var file in dto.ImageFiles)
                {
                    if (!_fileStorageService.IsValidImage(file, out var error))
                        throw new ArgumentException($"Gallery image: {error}");
                    var url = await _fileStorageService.SaveFileAsync(file, "uploads/products");
                    if (!string.IsNullOrEmpty(url))
                        newGalleryUrls.Add(url);
                }
            }

            if (dto.Images != null && dto.Images.Count > 0)
            {
                foreach (var imgStr in dto.Images)
                {
                    if (imgStr.StartsWith("/uploads"))
                    {
                        if (!newGalleryUrls.Contains(imgStr))
                            newGalleryUrls.Add(imgStr);
                    }
                    else
                    {
                        var url = SaveBase64Image(imgStr, "products");
                        if (!string.IsNullOrEmpty(url) && !newGalleryUrls.Contains(url))
                            newGalleryUrls.Add(url);
                    }
                }
            }

            // Clean up old gallery images that are no longer kept
            var relativeProductImages = product.Images.Select(GetRelativeUrl).ToList();
            var imagesToDelete = relativeProductImages.Except(newGalleryUrls).ToList();
            foreach (var oldImg in imagesToDelete)
            {
                _fileStorageService.DeleteFile(oldImg);
            }

            product.Name = dto.Name;
            product.NameAr = dto.NameAr;
            product.Description = dto.Description;
            product.DescriptionAr = dto.DescriptionAr;
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
            product.Images = newGalleryUrls;
            product.Ingredients = dto.Ingredients;
            product.IngredientsAr = dto.IngredientsAr;
            product.Usage = dto.Usage;
            product.UsageAr = dto.UsageAr;
            product.Benefits = dto.Benefits;
            product.BenefitsAr = dto.BenefitsAr;
            product.ImageType = dto.ImageType;
            product.ImageColor = dto.ImageColor;

            // Collect old variant images for cleanup
            var oldVariantImages = product.Variants
                .Select(v => GetRelativeUrl(v.Image))
                .Where(img => !string.IsNullOrEmpty(img))
                .ToList();

            // Remove existing variants from context tracking and clear collection to prevent tracking conflict
            foreach (var ev in product.Variants.ToList())
            {
                _unitOfWork.ProductVariants.Delete(ev);
            }
            product.Variants.Clear();

            var newVariantImages = new List<string>();
            if (dto.VariantType != "none" && dto.Variants != null)
            {
                foreach (var vDto in dto.Variants)
                {
                    if (vDto == null) continue;
                    string variantImage = "";
                    if (vDto.ImageFile != null)
                    {
                        if (!_fileStorageService.IsValidImage(vDto.ImageFile, out var error))
                            throw new ArgumentException($"Variant image: {error}");
                        variantImage = await _fileStorageService.SaveFileAsync(vDto.ImageFile, "uploads/variants");
                    }
                    else if (!string.IsNullOrEmpty(vDto.Image))
                    {
                        variantImage = SaveBase64Image(vDto.Image, "variants");
                    }

                    if (!string.IsNullOrEmpty(variantImage))
                    {
                        newVariantImages.Add(variantImage);
                    }

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
                        Image = variantImage,
                        IsAvailable = vDto.IsAvailable
                    };
                    await _unitOfWork.ProductVariants.AddAsync(variant);
                    product.Variants.Add(variant);
                }

                if (product.Variants.Any())
                {
                    product.Price = product.Variants.Min(v => v.Price);
                    var discounts = product.Variants
                        .Where(v => v.DiscountPrice > 0 && v.DiscountPrice < v.Price)
                        .Select(v => v.DiscountPrice)
                        .ToList();
                    product.DiscountPrice = discounts.Any() ? discounts.Min() : 0;
                    product.Stock = product.Variants.Sum(v => v.StockQuantity);
                }
            }

            // Clean up variant images that are no longer referenced
            var variantImagesToDelete = oldVariantImages.Except(newVariantImages).ToList();
            foreach (var oldVarImg in variantImagesToDelete)
            {
                _fileStorageService.DeleteFile(oldVarImg);
            }

        await _unitOfWork.SaveChangesAsync();
        FormatProductUrls(product);
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

    public async Task<bool> ToggleVisibilityAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
        {
            return false;
        }

        product.Visible = !product.Visible;
        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<HomepageSectionsDto> GetHomepageSectionsAsync()
    {
        var visibleProducts = await _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .Include(p => p.Reviews)
            .Where(p => p.Visible)
            .AsNoTracking()
            .ToListAsync();

        foreach (var product in visibleProducts)
        {
            FormatProductUrls(product);
        }

        return new HomepageSectionsDto
        {
            Featured = visibleProducts.Where(p => p.Featured).ToList(),
            BestSellers = visibleProducts.Where(p => p.BestSeller).ToList(),
            NewArrivals = visibleProducts.Where(p => p.NewArrival).ToList()
        };
    }

    private string SaveBase64Image(string base64String, string subFolder = "products")
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
            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", subFolder);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string filePath = Path.Combine(uploadsFolder, fileName);
            System.IO.File.WriteAllBytes(filePath, imageBytes);

            return $"/uploads/{subFolder}/{fileName}";
        }
        catch
        {
            return base64String;
        }
    }

    private string GetRelativeUrl(string url)
    {
        if (string.IsNullOrEmpty(url)) return url;
        if (url.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                var uri = new System.Uri(url);
                return uri.AbsolutePath;
            }
            catch
            {
                return url;
            }
        }
        return url;
    }

    private string GetAbsoluteUrl(string path)
    {
        if (string.IsNullOrEmpty(path)) return path;
        if (path.StartsWith("http", StringComparison.OrdinalIgnoreCase)) return path;

        var request = _httpContextAccessor.HttpContext?.Request;
        if (request != null)
        {
            var baseUrl = $"{request.Scheme}://{request.Host}";
            return baseUrl + (path.StartsWith('/') ? path : "/" + path);
        }

        return path;
    }

    public async Task<List<ValensApi.Application.DTOs.Home.HomeSectionProductCardDto>> SearchAdminProductsAsync(string? query, int limit)
    {
        var dbQuery = _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .AsNoTracking();

        if (!string.IsNullOrEmpty(query))
        {
            var queryLower = query.ToLower();
            dbQuery = dbQuery.Where(p => p.Name.ToLower().Contains(queryLower) || 
                                         p.CategoryName.ToLower().Contains(queryLower));
        }

        var products = await dbQuery.Take(limit).ToListAsync();
        
        var result = new List<ValensApi.Application.DTOs.Home.HomeSectionProductCardDto>();
        foreach (var p in products)
        {
            decimal price = p.Price;
            int stock = p.Stock;
            List<string> badges = new();

            if (p.VariantType != "none" && p.Variants?.Any() == true)
            {
                price = p.Variants.Min(v => v.Price);
                stock = p.Variants.Sum(v => v.StockQuantity);
            }

            if (p.NewArrival) badges.Add("NEW");
            if (p.BestSeller) badges.Add("HOT");
            if (p.DiscountPrice > 0 && p.DiscountPrice < price)
            {
                var savePct = (int)Math.Round((1 - p.DiscountPrice / price) * 100);
                badges.Add($"SAVE {savePct}%");
            }

            string stockStatus = stock > 10 ? "in_stock" : stock > 0 ? "low_stock" : "out_of_stock";
            string slug = p.Name.ToLowerInvariant().Replace(" ", "-");

            result.Add(new ValensApi.Application.DTOs.Home.HomeSectionProductCardDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = slug,
                Description = p.Description,
                Price = p.DiscountPrice > 0 && p.DiscountPrice < price ? p.DiscountPrice : price,
                Currency = "EGP",
                Image = string.IsNullOrEmpty(p.MainImage) ? null : GetAbsoluteUrl(p.MainImage),
                Rating = 5,
                ReviewsCount = 0,
                StockStatus = stockStatus,
                Badges = badges,
            });
        }
        return result;
    }

    private void FormatProductUrls(Product product)
    {
        if (product == null) return;
        
        product.MainImage = GetAbsoluteUrl(product.MainImage);
        if (product.Images != null)
        {
            product.Images = product.Images.Select(GetAbsoluteUrl).ToList();
        }
        
        if (product.Variants != null)
        {
            foreach (var variant in product.Variants)
            {
                variant.Image = GetAbsoluteUrl(variant.Image);
            }

            if (product.VariantType != "none" && product.Variants.Any())
            {
                product.Price = product.Variants.Min(v => v.Price);
                
                var discounts = product.Variants
                    .Where(v => v.DiscountPrice > 0 && v.DiscountPrice < v.Price)
                    .Select(v => v.DiscountPrice)
                    .ToList();
                product.DiscountPrice = discounts.Any() ? discounts.Min() : 0;
                
                product.Stock = product.Variants.Sum(v => v.StockQuantity);
            }
        }
    }
}
