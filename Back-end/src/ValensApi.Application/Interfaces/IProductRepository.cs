using System.Collections.Generic;
using System.Threading.Tasks;
using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<IEnumerable<Product>> GetProductsWithLowStockAsync(int threshold);
}
