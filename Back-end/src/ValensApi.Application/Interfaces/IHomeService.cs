using ValensApi.Application.DTOs.HomeControl;

namespace ValensApi.Application.Interfaces;

public interface IHomeService
{
    Task<HomePublicResponseDto> GetPublicHomepageAsync();
}
