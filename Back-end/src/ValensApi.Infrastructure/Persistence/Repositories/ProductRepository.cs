using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValensApi.Application.Interfaces;
using ValensApi.Domain.Entities;
using ValensApi.Infrastructure.Persistence.Repositories;

namespace ValensApi.Infrastructure.Persistence.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetProductsWithLowStockAsync(int threshold)
    {
        return await _dbSet
            .Where(p => p.Stock < threshold)
            .ToListAsync();
    }
}
