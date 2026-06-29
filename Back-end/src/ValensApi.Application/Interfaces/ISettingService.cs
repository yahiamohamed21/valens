using System.Threading.Tasks;
using ValensApi.Application.DTOs.Settings;

namespace ValensApi.Application.Interfaces;

public interface ISettingService
{
    Task<object> GetStoreSettingsAsync();
    Task<object> GetHomepageSettingsAsync();
    Task<bool> UpdateStoreSettingsAsync(UpdateStoreSettingsDto dto);
    Task<bool> UpdateHomepageSettingsAsync(UpdateHomepageSettingsDto dto);
    Task<object> GetHomepageOverviewAsync();
    Task<System.Collections.Generic.IEnumerable<ValensApi.Domain.Entities.GovernorateShipping>> GetGovernorateShippingsAsync();
    Task<bool> UpdateGovernorateShippingAsync(UpdateGovernorateShippingDto dto);
    Task<ValensApi.Domain.Entities.GovernorateShipping?> CreateGovernorateShippingAsync(CreateGovernorateShippingDto dto);
}
