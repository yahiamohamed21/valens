using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.DTOs.Home;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Services;

public class HomeControlService : IHomeControlService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    private static readonly HashSet<string> ValidSectionKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "featured_formulas", "best_selling_formulas"
    };

    public HomeControlService(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private string AbsoluteUrl(string? path)
    {
        if (string.IsNullOrEmpty(path)) return string.Empty;
        if (path.StartsWith("http", StringComparison.OrdinalIgnoreCase)) return path;
        var req = _httpContextAccessor.HttpContext?.Request;
        if (req != null)
        {
            var baseUrl = $"{req.Scheme}://{req.Host}";
            return baseUrl + (path.StartsWith('/') ? path : "/" + path);
        }
        return path;
    }

    private HomeBannerDto MapBanner(HomeBanner b) => new()
    {
        Id = b.Id,
        Title = b.Title,
        Subtitle = b.Subtitle,
        DesktopImage = AbsoluteUrl(b.DesktopImage),
        MobileImage = AbsoluteUrl(b.MobileImage),
        CtaText = b.CtaText,
        CtaLink = b.CtaLink,
        AltText = b.AltText,
        IsActive = b.IsActive,
        DisplayOrder = b.DisplayOrder,
        CreatedAt = b.CreatedAt,
        UpdatedAt = b.UpdatedAt,
    };

    private HomeStoryDto MapStory(HomeStory s) => new()
    {
        Id = s.Id,
        Title = s.Title,
        Description = s.Description,
        Image = AbsoluteUrl(s.Image),
        Link = s.Link,
        AltText = s.AltText,
        IsActive = s.IsActive,
        DisplayOrder = s.DisplayOrder,
        CreatedAt = s.CreatedAt,
        UpdatedAt = s.UpdatedAt,
    };

    private HomeSectionProductCardDto MapProductCard(Product p)
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

        return new HomeSectionProductCardDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = slug,
            Description = p.Description,
            Price = p.DiscountPrice > 0 && p.DiscountPrice < price ? p.DiscountPrice : price,
            Currency = "EGP",
            Image = string.IsNullOrEmpty(p.MainImage) ? null : AbsoluteUrl(p.MainImage),
            Rating = 5,
            ReviewsCount = 0,
            StockStatus = stockStatus,
            Badges = badges,
        };
    }

    private async Task<HomeSectionProductDto> MapSectionProduct(HomeSectionProduct sp)
    {
        HomeSectionProductCardDto? card = null;
        if (sp.Product != null)
            card = MapProductCard(sp.Product);

        return new HomeSectionProductDto
        {
            Id = sp.Id,
            SectionKey = sp.SectionKey,
            ProductId = sp.ProductId,
            IsActive = sp.IsActive,
            DisplayOrder = sp.DisplayOrder,
            CreatedAt = sp.CreatedAt,
            UpdatedAt = sp.UpdatedAt,
            Product = card,
        };
    }

    // ── Public Homepage ───────────────────────────────────────────────────────

    public async Task<HomePageDataDto> GetHomePageAsync()
    {
        var banners = await _unitOfWork.HomeBanners.GetQueryable()
            .Where(b => b.IsActive)
            .OrderBy(b => b.DisplayOrder)
            .ToListAsync();

        var stories = await _unitOfWork.HomeStories.GetQueryable()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();

        var sectionProducts = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(sp => sp.Product).ThenInclude(p => p!.Variants)
            .Include(sp => sp.Product).ThenInclude(p => p!.Reviews)
            .Where(sp => sp.IsActive && sp.Product != null && sp.Product.Visible)
            .OrderBy(sp => sp.DisplayOrder)
            .ToListAsync();

        var featured = sectionProducts.Where(sp => sp.SectionKey == "featured_formulas").ToList();
        var bestSelling = sectionProducts.Where(sp => sp.SectionKey == "best_selling_formulas").ToList();

        return new HomePageDataDto
        {
            HeroBanners = banners.Select(MapBanner).ToList(),
            FeaturedFormulas = featured.Select(sp => MapSectionProduct(sp).GetAwaiter().GetResult()).ToList(),
            PerformanceStories = stories.Select(MapStory).ToList(),
            BestSellingFormulas = bestSelling.Select(sp => MapSectionProduct(sp).GetAwaiter().GetResult()).ToList(),
        };
    }

    // ── Hero Banners ──────────────────────────────────────────────────────────

    public async Task<List<HomeBannerDto>> GetAllBannersAsync()
    {
        var banners = await _unitOfWork.HomeBanners.GetQueryable()
            .OrderBy(b => b.DisplayOrder)
            .ToListAsync();
        return banners.Select(MapBanner).ToList();
    }

    public async Task<HomeBannerDto> CreateBannerAsync(CreateHomeBannerDto dto)
    {
        var banner = new HomeBanner
        {
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            DesktopImage = dto.DesktopImage,
            MobileImage = dto.MobileImage,
            CtaText = dto.CtaText,
            CtaLink = dto.CtaLink,
            AltText = dto.AltText,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
        };
        await _unitOfWork.HomeBanners.AddAsync(banner);
        await _unitOfWork.SaveChangesAsync();
        return MapBanner(banner);
    }

    public async Task<HomeBannerDto> UpdateBannerAsync(Guid id, UpdateHomeBannerDto dto)
    {
        var banner = await _unitOfWork.HomeBanners.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Banner {id} not found");

        if (dto.Title != null) banner.Title = dto.Title;
        if (dto.Subtitle != null) banner.Subtitle = dto.Subtitle;
        if (dto.DesktopImage != null) banner.DesktopImage = dto.DesktopImage;
        if (dto.MobileImage != null) banner.MobileImage = dto.MobileImage;
        if (dto.CtaText != null) banner.CtaText = dto.CtaText;
        if (dto.CtaLink != null) banner.CtaLink = dto.CtaLink;
        if (dto.AltText != null) banner.AltText = dto.AltText;
        if (dto.IsActive.HasValue) banner.IsActive = dto.IsActive.Value;
        if (dto.DisplayOrder.HasValue) banner.DisplayOrder = dto.DisplayOrder.Value;

        _unitOfWork.HomeBanners.Update(banner);
        await _unitOfWork.SaveChangesAsync();
        return MapBanner(banner);
    }

    public async Task DeleteBannerAsync(Guid id)
    {
        var banner = await _unitOfWork.HomeBanners.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Banner {id} not found");
        _unitOfWork.HomeBanners.Delete(banner);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<HomeBannerDto> ToggleBannerAsync(Guid id, bool isActive)
    {
        var banner = await _unitOfWork.HomeBanners.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Banner {id} not found");
        banner.IsActive = isActive;
        _unitOfWork.HomeBanners.Update(banner);
        await _unitOfWork.SaveChangesAsync();
        return MapBanner(banner);
    }

    public async Task ReorderBannersAsync(List<ReorderItemDto> items)
    {
        foreach (var item in items)
        {
            var banner = await _unitOfWork.HomeBanners.GetByIdAsync(item.Id);
            if (banner != null)
            {
                banner.DisplayOrder = item.DisplayOrder;
                _unitOfWork.HomeBanners.Update(banner);
            }
        }
        await _unitOfWork.SaveChangesAsync();
    }

    // ── Stories ───────────────────────────────────────────────────────────────

    public async Task<List<HomeStoryDto>> GetAllStoriesAsync()
    {
        var stories = await _unitOfWork.HomeStories.GetQueryable()
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();
        return stories.Select(MapStory).ToList();
    }

    public async Task<HomeStoryDto> CreateStoryAsync(CreateHomeStoryDto dto)
    {
        var story = new HomeStory
        {
            Title = dto.Title,
            Description = dto.Description,
            Image = dto.Image,
            Link = dto.Link,
            AltText = dto.AltText,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
        };
        await _unitOfWork.HomeStories.AddAsync(story);
        await _unitOfWork.SaveChangesAsync();
        return MapStory(story);
    }

    public async Task<HomeStoryDto> UpdateStoryAsync(Guid id, UpdateHomeStoryDto dto)
    {
        var story = await _unitOfWork.HomeStories.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Story {id} not found");

        if (dto.Title != null) story.Title = dto.Title;
        if (dto.Description != null) story.Description = dto.Description;
        if (dto.Image != null) story.Image = dto.Image;
        if (dto.Link != null) story.Link = dto.Link;
        if (dto.AltText != null) story.AltText = dto.AltText;
        if (dto.IsActive.HasValue) story.IsActive = dto.IsActive.Value;
        if (dto.DisplayOrder.HasValue) story.DisplayOrder = dto.DisplayOrder.Value;

        _unitOfWork.HomeStories.Update(story);
        await _unitOfWork.SaveChangesAsync();
        return MapStory(story);
    }

    public async Task DeleteStoryAsync(Guid id)
    {
        var story = await _unitOfWork.HomeStories.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Story {id} not found");
        _unitOfWork.HomeStories.Delete(story);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<HomeStoryDto> ToggleStoryAsync(Guid id, bool isActive)
    {
        var story = await _unitOfWork.HomeStories.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Story {id} not found");
        story.IsActive = isActive;
        _unitOfWork.HomeStories.Update(story);
        await _unitOfWork.SaveChangesAsync();
        return MapStory(story);
    }

    public async Task ReorderStoriesAsync(List<ReorderItemDto> items)
    {
        foreach (var item in items)
        {
            var story = await _unitOfWork.HomeStories.GetByIdAsync(item.Id);
            if (story != null)
            {
                story.DisplayOrder = item.DisplayOrder;
                _unitOfWork.HomeStories.Update(story);
            }
        }
        await _unitOfWork.SaveChangesAsync();
    }

    // ── Section Products ──────────────────────────────────────────────────────

    private void ValidateSectionKey(string sectionKey)
    {
        if (!ValidSectionKeys.Contains(sectionKey))
            throw new ArgumentException($"Invalid section key '{sectionKey}'. Allowed: featured_formulas, best_selling_formulas");
    }

    public async Task<List<HomeSectionProductDto>> GetSectionProductsAsync(string sectionKey)
    {
        ValidateSectionKey(sectionKey);
        var items = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(sp => sp.Product).ThenInclude(p => p!.Variants)
            .Where(sp => sp.SectionKey == sectionKey)
            .OrderBy(sp => sp.DisplayOrder)
            .ToListAsync();

        var result = new List<HomeSectionProductDto>();
        foreach (var sp in items)
            result.Add(await MapSectionProduct(sp));
        return result;
    }

    public async Task<HomeSectionProductDto> AddProductToSectionAsync(string sectionKey, AddSectionProductDto dto)
    {
        ValidateSectionKey(sectionKey);

        // Duplicate check within same section
        var exists = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .AnyAsync(sp => sp.SectionKey == sectionKey && sp.ProductId == dto.ProductId);
        if (exists)
            throw new InvalidOperationException("Product already exists in this section");

        var sp = new HomeSectionProduct
        {
            SectionKey = sectionKey,
            ProductId = dto.ProductId,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
        };
        await _unitOfWork.HomeSectionProducts.AddAsync(sp);
        await _unitOfWork.SaveChangesAsync();

        // Reload with product
        var loaded = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(x => x.Product).ThenInclude(p => p!.Variants)
            .FirstOrDefaultAsync(x => x.Id == sp.Id);
        return await MapSectionProduct(loaded ?? sp);
    }

    public async Task<HomeSectionProductDto> UpdateSectionProductAsync(Guid id, UpdateSectionProductDto dto)
    {
        var sp = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(x => x.Product).ThenInclude(p => p!.Variants)
            .FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new KeyNotFoundException($"Section product {id} not found");

        if (dto.IsActive.HasValue) sp.IsActive = dto.IsActive.Value;
        if (dto.DisplayOrder.HasValue) sp.DisplayOrder = dto.DisplayOrder.Value;

        _unitOfWork.HomeSectionProducts.Update(sp);
        await _unitOfWork.SaveChangesAsync();
        return await MapSectionProduct(sp);
    }

    public async Task DeleteSectionProductAsync(Guid id)
    {
        var sp = await _unitOfWork.HomeSectionProducts.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Section product {id} not found");
        _unitOfWork.HomeSectionProducts.Delete(sp);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<HomeSectionProductDto> ToggleSectionProductAsync(Guid id, bool isActive)
    {
        var sp = await _unitOfWork.HomeSectionProducts.GetQueryable()
            .Include(x => x.Product).ThenInclude(p => p!.Variants)
            .FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new KeyNotFoundException($"Section product {id} not found");

        sp.IsActive = isActive;
        _unitOfWork.HomeSectionProducts.Update(sp);
        await _unitOfWork.SaveChangesAsync();
        return await MapSectionProduct(sp);
    }

    public async Task ReorderSectionProductsAsync(string sectionKey, List<ReorderItemDto> items)
    {
        ValidateSectionKey(sectionKey);
        foreach (var item in items)
        {
            var sp = await _unitOfWork.HomeSectionProducts.GetQueryable()
                .FirstOrDefaultAsync(x => x.Id == item.Id && x.SectionKey == sectionKey);
            if (sp != null)
            {
                sp.DisplayOrder = item.DisplayOrder;
                _unitOfWork.HomeSectionProducts.Update(sp);
            }
        }
        await _unitOfWork.SaveChangesAsync();
    }
}
