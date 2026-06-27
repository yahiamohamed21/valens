using ValensApi.Domain.Entities;

namespace ValensApi.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    IGenericRepository<Category> Categories { get; }
    IGenericRepository<ProductVariant> ProductVariants { get; }
    IGenericRepository<User> Users { get; }
    IGenericRepository<Customer> Customers { get; }
    IGenericRepository<Order> Orders { get; }
    IGenericRepository<OrderItem> OrderItems { get; }
    IGenericRepository<Coupon> Coupons { get; }
    IGenericRepository<Expense> Expenses { get; }
    IGenericRepository<StoreSetting> StoreSettings { get; }
    IGenericRepository<UserOtp> UserOtps { get; }
    
    Task<int> SaveChangesAsync();
    Task ExecuteSqlRawAsync(string sql, params object[] parameters);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task ExecuteInTransactionAsync(Func<Task> action);
}
