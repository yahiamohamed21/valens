using System.Text.Json.Serialization;

namespace ValensApi.Application.DTOs.HomeControl;

public class HomePublicResponseDto
{
    [JsonPropertyName("heroBanners")]
    public List<HomeBannerResponseDto> HeroBanners { get; set; } = new();

    [JsonPropertyName("featuredFormulas")]
    public List<ProductCardDto> FeaturedFormulas { get; set; } = new();

    [JsonPropertyName("performanceStories")]
    public List<HomeStoryResponseDto> PerformanceStories { get; set; } = new();

    [JsonPropertyName("bestSellingFormulas")]
    public List<ProductCardDto> BestSellingFormulas { get; set; } = new();
}
