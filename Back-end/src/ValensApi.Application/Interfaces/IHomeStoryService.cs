using ValensApi.Application.DTOs.HomeControl;

namespace ValensApi.Application.Interfaces;

public interface IHomeStoryService
{
    Task<List<HomeStoryResponseDto>> GetAllAsync();
    Task<HomeStoryResponseDto> CreateAsync(HomeStoryRequestDto dto);
    Task<HomeStoryResponseDto?> UpdateAsync(Guid id, HomeStoryRequestDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> SetActiveAsync(Guid id, bool isActive);
    Task<bool> ReorderAsync(ReorderDto dto);
    Task<List<HomeStoryResponseDto>> GetActiveAsync();
}
