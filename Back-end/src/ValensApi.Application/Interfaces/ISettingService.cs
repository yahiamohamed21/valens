using System.Threading.Tasks;
using ValensApi.Application.DTOs.Settings;

namespace ValensApi.Application.Interfaces;

public interface ISettingService
{
    Task<StoreSettingsResponseDto> GetStoreSettingsAsync();
    Task<HomePageSettingsResponseDto> GetHomepageSettingsAsync();
    Task<bool> UpdateStoreSettingsAsync(UpdateStoreSettingsDto dto);
    Task<bool> UpdateHomepageSettingsAsync(UpdateHomepageSettingsDto dto);
    Task<object> GetHomepageOverviewAsync();
}
