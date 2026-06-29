using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Settings;
using ValensApi.Application.DTOs.Categories;
using ValensApi.Application.DTOs.Products;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ValensApi.Application.Services;

public class SettingService : ISettingService
{
    private readonly IUnitOfWork _unitOfWork;

    public SettingService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<StoreSettingsResponseDto> GetStoreSettingsAsync()
    {
        var settings = await GetOrCreateSettingsAsync();
        return new StoreSettingsResponseDto
        {
            BrandName = settings.BrandName,
            LogoText = settings.LogoText,
            ContactEmail = settings.ContactEmail,
            ContactPhone = settings.ContactPhone,
            Address = settings.Address,
            ShippingCost = settings.ShippingCost,
            TaxRate = settings.TaxRate,
            SocialInstagram = settings.SocialInstagram,
            SocialTwitter = settings.SocialTwitter,
            SocialFacebook = settings.SocialFacebook
        };
    }

    public async Task<HomePageSettingsResponseDto> GetHomepageSettingsAsync()
    {
        var settings = await GetOrCreateSettingsAsync();
        return new HomePageSettingsResponseDto
        {
            BrandName = settings.BrandName,
            LogoText = settings.LogoText,
            HeroTitle = settings.HomepageHeroTitle,
            HeroSubtitle = settings.HomepageHeroSubtitle,
            HeroCtaText = settings.HeroCtaText,
            HeroCtaLink = settings.HeroCtaLink,
            FirstBannerTitle = settings.FirstBannerTitle,
            FirstBannerSubtitle = settings.FirstBannerSubtitle,
            FirstBannerCtaText = settings.FirstBannerCtaText,
            PromoBadge = settings.PromoBadge,
            HeroTitleAr = settings.HeroTitleAr,
            HeroSubtitleAr = settings.HeroSubtitleAr,
            HeroCtaTextAr = settings.HeroCtaTextAr,
            FirstBannerTitleAr = settings.FirstBannerTitleAr,
            FirstBannerSubtitleAr = settings.FirstBannerSubtitleAr,
            FirstBannerCtaTextAr = settings.FirstBannerCtaTextAr,
            PromoBadgeAr = settings.PromoBadgeAr
        };
    }

    public async Task<bool> UpdateStoreSettingsAsync(UpdateStoreSettingsDto dto)
    {
        var settings = await GetOrCreateSettingsAsync();

        settings.BrandName = dto.BrandName;
        settings.LogoText = dto.LogoText;
        settings.ContactPhone = dto.ContactPhone;
        settings.ContactEmail = dto.ContactEmail;
        settings.Address = dto.Address;
        settings.ShippingCost = dto.ShippingCost;
        settings.FreeShippingThreshold = dto.FreeShippingThreshold;
        settings.TaxRate = dto.TaxRate;
        settings.SocialInstagram = dto.SocialInstagram;
        settings.SocialTwitter = dto.SocialTwitter;
        settings.SocialFacebook = dto.SocialFacebook;

        _unitOfWork.StoreSettings.Update(settings);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateHomepageSettingsAsync(UpdateHomepageSettingsDto dto)
    {
        var settings = await GetOrCreateSettingsAsync();

        settings.BrandName = dto.BrandName;
        settings.LogoText = dto.LogoText;
        settings.HomepageHeroTitle = dto.HeroTitle;
        settings.HomepageHeroSubtitle = dto.HeroSubtitle;
        settings.HeroCtaText = dto.HeroCtaText;
        settings.HeroCtaLink = dto.HeroCtaLink;
        settings.FirstBannerTitle = dto.FirstBannerTitle;
        settings.FirstBannerSubtitle = dto.FirstBannerSubtitle;
        settings.FirstBannerCtaText = dto.FirstBannerCtaText;
        settings.PromoBadge = dto.PromoBadge;

        settings.HeroTitleAr = dto.HeroTitleAr;
        settings.HeroSubtitleAr = dto.HeroSubtitleAr;
        settings.HeroCtaTextAr = dto.HeroCtaTextAr;
        settings.FirstBannerTitleAr = dto.FirstBannerTitleAr;
        settings.FirstBannerSubtitleAr = dto.FirstBannerSubtitleAr;
        settings.FirstBannerCtaTextAr = dto.FirstBannerCtaTextAr;
        settings.PromoBadgeAr = dto.PromoBadgeAr;

        settings.HeroImage = SaveBase64Image(dto.HeroImage);
        settings.PromoBannerImage = SaveBase64Image(dto.PromoBannerImage);

        if (dto.HomepageSliderImages != null)
        {
            settings.HomepageSliderImages = dto.HomepageSliderImages
                .Select(img => SaveBase64Image(img))
                .Where(url => !string.IsNullOrEmpty(url))
                .ToList();
        }

        _unitOfWork.StoreSettings.Update(settings);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    private async Task<StoreSetting> GetOrCreateSettingsAsync()
    {
        var settingsList = await _unitOfWork.StoreSettings.GetAllAsync();
        var settings = settingsList.FirstOrDefault();
        if (settings == null)
        {
            settings = new StoreSetting
            {
                BrandName = "VALENS",
                LogoText = "VALENS",
                ContactPhone = "+1 (800) 825-3677",
                ContactEmail = "elite@valens.com",
                Address = "88 Science & Athletics Drive, Sector 4, CA 90210",
                ShippingCost = 60,
                FreeShippingThreshold = 1500,
                TaxRate = 5,
                SocialInstagram = "@valens_nutrition",
                SocialTwitter = "@valens_performance",
                SocialFacebook = "valens.elite",
                HomepageHeroTitle = "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
                HomepageHeroSubtitle = "Engineered for elite athletes. Premium supplements formulated with clinical dosages, clean ingredients, and zero compromises.",
                HeroCtaText = "SHOP THE NUTRITION",
                HeroCtaLink = "/products",
                FirstBannerTitle = "THE VALENS FORMULA",
                FirstBannerSubtitle = "Cold-filtered processing, zero artificial coloring, complete transparency. We don't hide behind proprietary blends. What you see is exactly what powers you.",
                FirstBannerCtaText = "DISCOVER THE SCIENCE",
                PromoBadge = "ELITE PERFORMANCE LINE",
                HeroTitleAr = "مُصمم برؤية علمية، مُنفجر بقوة الأداء",
                HeroSubtitleAr = "مُهندس خصيصاً للرياضيين النخبة. مكملات فاخرة مُصممة بجرعات سريرية ومكونات نظيفة وبدون تنازلات.",
                HeroCtaTextAr = "تسوق التغذية الفاخرة",
                FirstBannerTitleAr = "تركيبة VALENS النخبوية",
                FirstBannerSubtitleAr = "معالجة بالفلترة الباردة، خالية تمامًا من الألوان الاصطناعية، وشفافية مطلقة للبطاقات. لا نختبئ خلف تركيبات احتكارية مبهمة.",
                FirstBannerCtaTextAr = "اكتشف الجانب العلمي",
                PromoBadgeAr = "خط الأداء الرياضي الفاخر",
                HeroImage = string.Empty,
                PromoBannerImage = string.Empty,
                HomepageSliderImages = new List<string>()
            };
            await _unitOfWork.StoreSettings.AddAsync(settings);
            await _unitOfWork.SaveChangesAsync();
        }
        return settings;
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

    public async Task<object> GetHomepageOverviewAsync()
    {
        var settings = await GetHomepageSettingsAsync();
        
        var categories = await _unitOfWork.Categories.FindAsync(c => c.IsActive);
        
        var products = await _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .Include(p => p.Reviews)
            .Where(p => p.Visible)
            .AsNoTracking()
            .ToListAsync();

        return new
        {
            Settings = settings,
            Categories = categories.Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ImageColor = c.ImageColor,
                Visible = c.IsActive
            }).OrderBy(c => c.Name).ToList(),
            Products = new
            {
                Featured = products.Where(p => p.Featured).Select(MapProductToResponseDto).ToList(),
                BestSellers = products.Where(p => p.BestSeller).Select(MapProductToResponseDto).ToList(),
                NewArrivals = products.Where(p => p.NewArrival).Select(MapProductToResponseDto).ToList()
            }
        };
    }

    private static ProductResponseDto MapProductToResponseDto(Product product)
    {
        return new ProductResponseDto
        {
            Id = product.Id,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            Name = product.Name,
            Description = product.Description,
            CategoryName = product.CategoryName,
            CategoryId = product.CategoryId,
            Featured = product.Featured,
            BestSeller = product.BestSeller,
            NewArrival = product.NewArrival,
            Visible = product.Visible,
            VariantType = product.VariantType,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Size = product.Size,
            Stock = product.Stock,
            Sku = product.Sku,
            MainImage = product.MainImage,
            Images = product.Images ?? new(),
            Ingredients = product.Ingredients ?? new(),
            Benefits = product.Benefits ?? new(),
            Usage = product.Usage,
            ImageType = product.ImageType,
            ImageColor = product.ImageColor,
            Variants = product.Variants?.Select(v => new ProductVariantResponseDto
            {
                VariantId = v.VariantId,
                ProductId = v.ProductId,
                Size = v.Size,
                Flavor = v.Flavor,
                Price = v.Price,
                DiscountPrice = v.DiscountPrice,
                StockQuantity = v.StockQuantity,
                Sku = v.Sku,
                Image = v.Image,
                IsAvailable = v.IsAvailable
            }).ToList() ?? new(),
            Rating = product.Rating,
            Reviews = product.Reviews?.Select(r => new ReviewResponseDto
            {
                Id = r.Id,
                Author = r.Author,
                Rating = r.Rating,
                Comment = r.Comment,
                Date = r.Date
            }).ToList() ?? new(),
            NameAr = product.NameAr,
            DescriptionAr = product.DescriptionAr,
            IngredientsAr = product.IngredientsAr ?? new(),
            UsageAr = product.UsageAr,
            BenefitsAr = product.BenefitsAr ?? new()
        };
    }
}
