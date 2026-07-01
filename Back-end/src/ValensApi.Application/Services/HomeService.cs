using System.Threading.Tasks;
using ValensApi.Application.DTOs.HomeControl;
using ValensApi.Application.Interfaces;

namespace ValensApi.Application.Services;

public class HomeService : IHomeService
{
    private readonly IHomeBannerService _homeBannerService;
    private readonly IHomeStoryService _homeStoryService;
    private readonly IHomeSectionService _homeSectionService;

    public HomeService(
        IHomeBannerService homeBannerService,
        IHomeStoryService homeStoryService,
        IHomeSectionService homeSectionService)
    {
        _homeBannerService = homeBannerService;
        _homeStoryService = homeStoryService;
        _homeSectionService = homeSectionService;
    }

    public async Task<HomePublicResponseDto> GetPublicHomepageAsync()
    {
        var heroBanners = await _homeBannerService.GetActiveAsync();
        var performanceStories = await _homeStoryService.GetActiveAsync();
        var featuredFormulas = await _homeSectionService.GetActiveBySectionAsync("featured_formulas");
        var bestSellingFormulas = await _homeSectionService.GetActiveBySectionAsync("best_selling_formulas");

        return new HomePublicResponseDto
        {
            HeroBanners = heroBanners,
            FeaturedFormulas = featuredFormulas,
            PerformanceStories = performanceStories,
            BestSellingFormulas = bestSellingFormulas
        };
    }
}
