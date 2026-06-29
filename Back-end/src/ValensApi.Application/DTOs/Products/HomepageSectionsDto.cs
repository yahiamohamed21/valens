using System.Collections.Generic;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.DTOs.Products;

public class HomepageSectionsDto
{
    public IEnumerable<ProductResponseDto> Featured { get; set; } = new List<ProductResponseDto>();
    public IEnumerable<ProductResponseDto> BestSellers { get; set; } = new List<ProductResponseDto>();
    public IEnumerable<ProductResponseDto> NewArrivals { get; set; } = new List<ProductResponseDto>();
}
