using System;
using System.Threading.Tasks;

namespace ValensApi.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    
    Task<int> SaveChangesAsync();
    Task ExecuteSqlRawAsync(string sql, params object[] parameters);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task ExecuteInTransactionAsync(Func<Task> action);
}
