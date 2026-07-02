using System.Collections.Generic;

namespace ValensApi.Application.DTOs.Home;

public class HomePageDataDto
{
    public List<HomeBannerDto> HeroBanners { get; set; } = new();
    public List<HomeSectionProductDto> FeaturedFormulas { get; set; } = new();
    public List<HomeStoryDto> PerformanceStories { get; set; } = new();
    public List<HomeSectionProductDto> BestSellingFormulas { get; set; } = new();
}
