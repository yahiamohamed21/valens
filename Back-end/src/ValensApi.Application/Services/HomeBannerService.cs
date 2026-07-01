using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.HomeControl;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class HomeBannerService : IHomeBannerService
{
    private readonly IUnitOfWork _unitOfWork;

    public HomeBannerService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<HomeBannerResponseDto>> GetAllAsync()
    {
        var banners = await _unitOfWork.HomeBanners.GetQueryable()
            .OrderBy(b => b.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return banners.Select(MapToResponseDto).ToList();
    }

    public async Task<HomeBannerResponseDto> CreateAsync(HomeBannerRequestDto dto)
    {
        var banner = new HomeBanner
        {
            Title = dto.Title ?? string.Empty,
            Subtitle = dto.Subtitle ?? string.Empty,
            DesktopImage = SaveBase64Image(dto.DesktopImage),
            MobileImage = SaveBase64Image(dto.MobileImage ?? string.Empty),
            CtaText = dto.CtaText ?? string.Empty,
            CtaLink = dto.CtaLink ?? string.Empty,
            AltText = dto.AltText ?? string.Empty,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder
        };

        await _unitOfWork.HomeBanners.AddAsync(banner);
        await _unitOfWork.SaveChangesAsync();

        return MapToResponseDto(banner);
    }

    public async Task<HomeBannerResponseDto?> UpdateAsync(Guid id, HomeBannerRequestDto dto)
    {
        var banner = await _unitOfWork.HomeBanners.GetByIdAsync(id);
        if (banner == null) return null;

        banner.Title = dto.Title ?? string.Empty;
        banner.Subtitle = dto.Subtitle ?? string.Empty;
        banner.DesktopImage = SaveBase64Image(dto.DesktopImage);
        banner.MobileImage = SaveBase64Image(dto.MobileImage ?? string.Empty);
        banner.CtaText = dto.CtaText ?? string.Empty;
        banner.CtaLink = dto.CtaLink ?? string.Empty;
        banner.AltText = dto.AltText ?? string.Empty;
        banner.IsActive = dto.IsActive;
        banner.DisplayOrder = dto.DisplayOrder;

        _unitOfWork.HomeBanners.Update(banner);
        await _unitOfWork.SaveChangesAsync();

        return MapToResponseDto(banner);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var banner = await _unitOfWork.HomeBanners.GetByIdAsync(id);
        if (banner == null) return false;

        _unitOfWork.HomeBanners.SoftDelete(banner);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive)
    {
        var banner = await _unitOfWork.HomeBanners.GetByIdAsync(id);
        if (banner == null) return false;

        banner.IsActive = isActive;
        _unitOfWork.HomeBanners.Update(banner);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderAsync(ReorderDto dto)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            foreach (var item in dto.Items)
            {
                var banner = await _unitOfWork.HomeBanners.GetByIdAsync(item.Id);
                if (banner == null)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return false;
                }
                banner.DisplayOrder = item.DisplayOrder;
                _unitOfWork.HomeBanners.Update(banner);
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

    public async Task<List<HomeBannerResponseDto>> GetActiveAsync()
    {
        var banners = await _unitOfWork.HomeBanners.GetQueryable()
            .Where(b => b.IsActive)
            .OrderBy(b => b.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return banners.Select(MapToResponseDto).ToList();
    }

    private static HomeBannerResponseDto MapToResponseDto(HomeBanner banner)
    {
        return new HomeBannerResponseDto
        {
            Id = banner.Id,
            Title = banner.Title,
            Subtitle = banner.Subtitle,
            DesktopImage = banner.DesktopImage,
            MobileImage = banner.MobileImage,
            CtaText = banner.CtaText,
            CtaLink = banner.CtaLink,
            AltText = banner.AltText,
            IsActive = banner.IsActive,
            DisplayOrder = banner.DisplayOrder
        };
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
