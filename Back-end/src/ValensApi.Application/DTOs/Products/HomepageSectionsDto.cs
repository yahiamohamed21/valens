using System.Collections.Generic;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.DTOs.Products;

public class HomepageSectionsDto
{
    public IEnumerable<Product> Featured { get; set; } = new List<Product>();
    public IEnumerable<Product> BestSellers { get; set; } = new List<Product>();
    public IEnumerable<Product> NewArrivals { get; set; } = new List<Product>();
}
