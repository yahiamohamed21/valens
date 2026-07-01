using ValensApi.Application.DTOs.HomeControl;

namespace ValensApi.Application.Interfaces;

public interface IHomeSectionService
{
    Task<List<HomeSectionProductResponseDto>> GetBySectionAsync(string sectionKey);
    Task<HomeSectionProductResponseDto> AddToSectionAsync(string sectionKey, HomeSectionProductRequestDto dto);
    Task<HomeSectionProductResponseDto?> UpdateAsync(Guid id, HomeSectionProductRequestDto dto);
    Task<bool> RemoveAsync(Guid id);
    Task<bool> SetActiveAsync(Guid id, bool isActive);
    Task<bool> ReorderAsync(string sectionKey, ReorderDto dto);
    Task<List<ProductCardDto>> GetActiveBySectionAsync(string sectionKey);
    Task<List<ProductSearchResponseDto>> SearchProductsAsync(string? query, int limit);
}
