using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Settings;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ValensApi.Application.Services;

public class SettingService : ISettingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;

    public SettingService(IUnitOfWork unitOfWork, IFileStorageService fileStorageService)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
    }

    public async Task<object> GetStoreSettingsAsync()
    {
        var settings = await GetOrCreateSettingsAsync();
        return new
        {
            settings.ShippingCost,
            settings.FreeShippingThreshold,
            settings.ContactPhone,
            settings.ContactEmail
        };
    }

    public async Task<object> GetHomepageSettingsAsync()
    {
        var settings = await GetOrCreateSettingsAsync();
        return new
        {
            settings.HomepageHeroTitle,
            settings.HomepageHeroSubtitle,
            settings.HomepageDiscountBannerText,
            settings.HeroImage,
            settings.PromoBannerImage,
            settings.HomepageSliderImages
        };
    }

    public async Task<bool> UpdateStoreSettingsAsync(UpdateStoreSettingsDto dto)
    {
        var settings = await GetOrCreateSettingsAsync();

        settings.ShippingCost = dto.ShippingCost;
        settings.FreeShippingThreshold = dto.FreeShippingThreshold;
        settings.ContactPhone = dto.ContactPhone;
        settings.ContactEmail = dto.ContactEmail;

        _unitOfWork.StoreSettings.Update(settings);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateHomepageSettingsAsync(UpdateHomepageSettingsDto dto)
    {
        var settings = await GetOrCreateSettingsAsync();

        settings.HomepageHeroTitle = dto.HomepageHeroTitle;
        settings.HomepageHeroSubtitle = dto.HomepageHeroSubtitle;
        settings.HomepageDiscountBannerText = dto.HomepageDiscountBannerText;

        // Hero Image
        if (dto.HeroImageFile != null)
        {
            if (!_fileStorageService.IsValidImage(dto.HeroImageFile, out var error))
                throw new ArgumentException($"Hero image: {error}");
            string newHeroImage = await _fileStorageService.SaveFileAsync(dto.HeroImageFile, "uploads/settings");
            if (!string.IsNullOrEmpty(settings.HeroImage))
            {
                _fileStorageService.DeleteFile(settings.HeroImage);
            }
            settings.HeroImage = newHeroImage;
        }
        else if (!string.IsNullOrEmpty(dto.HeroImage))
        {
            string processedImage = SaveBase64Image(dto.HeroImage, "settings");
            if (processedImage != settings.HeroImage)
            {
                if (!string.IsNullOrEmpty(settings.HeroImage))
                {
                    _fileStorageService.DeleteFile(settings.HeroImage);
                }
                settings.HeroImage = processedImage;
            }
        }

        // Promo Banner Image
        if (dto.PromoBannerImageFile != null)
        {
            if (!_fileStorageService.IsValidImage(dto.PromoBannerImageFile, out var error))
                throw new ArgumentException($"Promo banner image: {error}");
            string newPromoImage = await _fileStorageService.SaveFileAsync(dto.PromoBannerImageFile, "uploads/settings");
            if (!string.IsNullOrEmpty(settings.PromoBannerImage))
            {
                _fileStorageService.DeleteFile(settings.PromoBannerImage);
            }
            settings.PromoBannerImage = newPromoImage;
        }
        else if (!string.IsNullOrEmpty(dto.PromoBannerImage))
        {
            string processedImage = SaveBase64Image(dto.PromoBannerImage, "settings");
            if (processedImage != settings.PromoBannerImage)
            {
                if (!string.IsNullOrEmpty(settings.PromoBannerImage))
                {
                    _fileStorageService.DeleteFile(settings.PromoBannerImage);
                }
                settings.PromoBannerImage = processedImage;
            }
        }

        // Slider Images
        var finalSliderImages = new List<string>();
        if (dto.ExistingSliderImages != null)
        {
            finalSliderImages.AddRange(dto.ExistingSliderImages.Where(url => !string.IsNullOrEmpty(url)));
        }

        if (dto.HomepageSliderImageFiles != null && dto.HomepageSliderImageFiles.Count > 0)
        {
            foreach (var file in dto.HomepageSliderImageFiles)
            {
                if (!_fileStorageService.IsValidImage(file, out var error))
                    throw new ArgumentException($"Slider image: {error}");
                var url = await _fileStorageService.SaveFileAsync(file, "uploads/settings");
                if (!string.IsNullOrEmpty(url))
                    finalSliderImages.Add(url);
            }
        }

        if (dto.HomepageSliderImages != null && dto.HomepageSliderImages.Count > 0)
        {
            foreach (var imgStr in dto.HomepageSliderImages)
            {
                if (imgStr.StartsWith("http") || imgStr.StartsWith("/uploads"))
                {
                    if (!finalSliderImages.Contains(imgStr))
                        finalSliderImages.Add(imgStr);
                }
                else
                {
                    var url = SaveBase64Image(imgStr, "settings");
                    if (!string.IsNullOrEmpty(url) && !finalSliderImages.Contains(url))
                        finalSliderImages.Add(url);
                }
            }
        }

        // Clean up old slider images no longer kept
        if (settings.HomepageSliderImages != null)
        {
            var sliderImagesToDelete = settings.HomepageSliderImages.Except(finalSliderImages).ToList();
            foreach (var oldSliderImg in sliderImagesToDelete)
            {
                _fileStorageService.DeleteFile(oldSliderImg);
            }
        }

        settings.HomepageSliderImages = finalSliderImages;

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
                ShippingCost = 60,
                FreeShippingThreshold = 1500,
                ContactPhone = "+201000000000",
                ContactEmail = "support@valens.com",
                HomepageHeroTitle = "Premium Sports & Nutritional Supplements",
                HomepageHeroSubtitle = "Fuel your body with the highest quality formulations.",
                HomepageDiscountBannerText = "Get 10% off your first order! Use code: FIRST10",
                HeroImage = string.Empty,
                PromoBannerImage = string.Empty,
                HomepageSliderImages = new List<string>()
            };
            await _unitOfWork.StoreSettings.AddAsync(settings);
            await _unitOfWork.SaveChangesAsync();
        }
        return settings;
    }

    private string SaveBase64Image(string base64String, string subFolder = "settings")
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

    public async Task<object> GetHomepageOverviewAsync()
    {
        var settings = await GetHomepageSettingsAsync();
        
        var categories = await _unitOfWork.Categories.FindAsync(c => c.IsActive);
        
        var products = await _unitOfWork.Products.GetQueryable()
            .Include(p => p.Variants)
            .Where(p => p.Visible)
            .AsNoTracking()
            .ToListAsync();

        return new
        {
            Settings = settings,
            Categories = categories,
            Products = new
            {
                Featured = products.Where(p => p.Featured).ToList(),
                BestSellers = products.Where(p => p.BestSeller).ToList(),
                NewArrivals = products.Where(p => p.NewArrival).ToList()
            }
        };
    }

    public async Task<System.Collections.Generic.IEnumerable<GovernorateShipping>> GetGovernorateShippingsAsync()
    {
        var list = await _unitOfWork.GovernorateShippings.GetAllAsync();
        return list.OrderBy(g => g.GovernorateName);
    }

    public async Task<bool> UpdateGovernorateShippingAsync(UpdateGovernorateShippingDto dto)
    {
        var gov = await _unitOfWork.GovernorateShippings.GetByIdAsync(dto.Id);
        if (gov == null)
        {
            return false;
        }

        gov.ShippingCost = dto.ShippingCost;
        _unitOfWork.GovernorateShippings.Update(gov);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<GovernorateShipping?> CreateGovernorateShippingAsync(CreateGovernorateShippingDto dto)
    {
        var exists = await _unitOfWork.GovernorateShippings.FindAsync(g => 
            g.GovernorateName.ToLower() == dto.GovernorateName.Trim().ToLower()
        );
        if (exists.Any())
        {
            return null; // Already exists
        }

        var gov = new GovernorateShipping
        {
            Id = Guid.NewGuid(),
            GovernorateName = dto.GovernorateName.Trim(),
            ShippingCost = dto.ShippingCost,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        await _unitOfWork.GovernorateShippings.AddAsync(gov);
        await _unitOfWork.SaveChangesAsync();
        return gov;
    }
}
