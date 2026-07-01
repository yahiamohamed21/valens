using ValensApi.Application.DTOs.HomeControl;

namespace ValensApi.Application.Interfaces;

public interface IHomeBannerService
{
    Task<List<HomeBannerResponseDto>> GetAllAsync();
    Task<HomeBannerResponseDto> CreateAsync(HomeBannerRequestDto dto);
    Task<HomeBannerResponseDto?> UpdateAsync(Guid id, HomeBannerRequestDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> SetActiveAsync(Guid id, bool isActive);
    Task<bool> ReorderAsync(ReorderDto dto);
    Task<List<HomeBannerResponseDto>> GetActiveAsync();
}
