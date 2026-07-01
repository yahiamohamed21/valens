using ValensApi.Application.DTOs.Home;

namespace ValensApi.Application.Interfaces;

public interface IHomeControlService
{
    // ── Public ──────────────────────────────────────────────────────────────────
    Task<HomePageDataDto> GetHomePageAsync();

    // ── Hero Banners ─────────────────────────────────────────────────────────────
    Task<List<HomeBannerDto>> GetAllBannersAsync();
    Task<HomeBannerDto> CreateBannerAsync(CreateHomeBannerDto dto);
    Task<HomeBannerDto> UpdateBannerAsync(Guid id, UpdateHomeBannerDto dto);
    Task DeleteBannerAsync(Guid id);
    Task<HomeBannerDto> ToggleBannerAsync(Guid id, bool isActive);
    Task ReorderBannersAsync(List<ReorderItemDto> items);

    // ── Stories ──────────────────────────────────────────────────────────────────
    Task<List<HomeStoryDto>> GetAllStoriesAsync();
    Task<HomeStoryDto> CreateStoryAsync(CreateHomeStoryDto dto);
    Task<HomeStoryDto> UpdateStoryAsync(Guid id, UpdateHomeStoryDto dto);
    Task DeleteStoryAsync(Guid id);
    Task<HomeStoryDto> ToggleStoryAsync(Guid id, bool isActive);
    Task ReorderStoriesAsync(List<ReorderItemDto> items);

    // ── Section Products ──────────────────────────────────────────────────────────
    Task<List<HomeSectionProductDto>> GetSectionProductsAsync(string sectionKey);
    Task<HomeSectionProductDto> AddProductToSectionAsync(string sectionKey, AddSectionProductDto dto);
    Task<HomeSectionProductDto> UpdateSectionProductAsync(Guid id, UpdateSectionProductDto dto);
    Task DeleteSectionProductAsync(Guid id);
    Task<HomeSectionProductDto> ToggleSectionProductAsync(Guid id, bool isActive);
    Task ReorderSectionProductsAsync(string sectionKey, List<ReorderItemDto> items);
}
