using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Settings;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class SettingService : ISettingService
{
    private readonly IUnitOfWork _unitOfWork;

    public SettingService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
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
