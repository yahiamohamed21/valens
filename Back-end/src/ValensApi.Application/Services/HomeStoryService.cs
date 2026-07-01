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

public class HomeStoryService : IHomeStoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public HomeStoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<HomeStoryResponseDto>> GetAllAsync()
    {
        var stories = await _unitOfWork.HomeStories.GetQueryable()
            .OrderBy(s => s.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return stories.Select(MapToResponseDto).ToList();
    }

    public async Task<HomeStoryResponseDto> CreateAsync(HomeStoryRequestDto dto)
    {
        var story = new HomeStory
        {
            Title = dto.Title,
            Description = dto.Description,
            Image = SaveBase64Image(dto.Image),
            Link = dto.Link ?? string.Empty,
            AltText = dto.AltText ?? string.Empty,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder
        };

        await _unitOfWork.HomeStories.AddAsync(story);
        await _unitOfWork.SaveChangesAsync();

        return MapToResponseDto(story);
    }

    public async Task<HomeStoryResponseDto?> UpdateAsync(Guid id, HomeStoryRequestDto dto)
    {
        var story = await _unitOfWork.HomeStories.GetByIdAsync(id);
        if (story == null) return null;

        story.Title = dto.Title;
        story.Description = dto.Description;
        story.Image = SaveBase64Image(dto.Image);
        story.Link = dto.Link ?? string.Empty;
        story.AltText = dto.AltText ?? string.Empty;
        story.IsActive = dto.IsActive;
        story.DisplayOrder = dto.DisplayOrder;

        _unitOfWork.HomeStories.Update(story);
        await _unitOfWork.SaveChangesAsync();

        return MapToResponseDto(story);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var story = await _unitOfWork.HomeStories.GetByIdAsync(id);
        if (story == null) return false;

        _unitOfWork.HomeStories.SoftDelete(story);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive)
    {
        var story = await _unitOfWork.HomeStories.GetByIdAsync(id);
        if (story == null) return false;

        story.IsActive = isActive;
        _unitOfWork.HomeStories.Update(story);
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
                var story = await _unitOfWork.HomeStories.GetByIdAsync(item.Id);
                if (story == null)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return false;
                }
                story.DisplayOrder = item.DisplayOrder;
                _unitOfWork.HomeStories.Update(story);
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

    public async Task<List<HomeStoryResponseDto>> GetActiveAsync()
    {
        var stories = await _unitOfWork.HomeStories.GetQueryable()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return stories.Select(MapToResponseDto).ToList();
    }

    private static HomeStoryResponseDto MapToResponseDto(HomeStory story)
    {
        return new HomeStoryResponseDto
        {
            Id = story.Id,
            Title = story.Title,
            Description = story.Description,
            Image = story.Image,
            Link = story.Link,
            AltText = story.AltText,
            IsActive = story.IsActive,
            DisplayOrder = story.DisplayOrder
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
