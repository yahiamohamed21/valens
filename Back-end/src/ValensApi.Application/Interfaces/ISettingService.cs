using System.Threading.Tasks;
using ValensApi.Application.DTOs.Settings;

namespace ValensApi.Application.Interfaces;

public interface ISettingService
{
    Task<object> GetStoreSettingsAsync();
    Task<object> GetHomepageSettingsAsync();
    Task<bool> UpdateStoreSettingsAsync(UpdateStoreSettingsDto dto);
    Task<bool> UpdateHomepageSettingsAsync(UpdateHomepageSettingsDto dto);
}
