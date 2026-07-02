using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading.Tasks;
using ValensApi.Application.Interfaces;

using ValensApi.Domain.Entities;
using ValensApi.Infrastructure.Persistence.Repositories;

namespace ValensApi.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _currentTransaction;
    private bool _disposed;

    public IProductRepository Products { get; }
    public IGenericRepository<Category> Categories { get; }
    public IGenericRepository<ProductVariant> ProductVariants { get; }
    public IGenericRepository<User> Users { get; }
    public IGenericRepository<Customer> Customers { get; }
    public IGenericRepository<Order> Orders { get; }
    public IGenericRepository<OrderItem> OrderItems { get; }
    public IGenericRepository<Coupon> Coupons { get; }
    public IGenericRepository<Expense> Expenses { get; }
    public IGenericRepository<StoreSetting> StoreSettings { get; }
    public IGenericRepository<UserOtp> UserOtps { get; }
    public IGenericRepository<SupportMessage> SupportMessages { get; }

    public UnitOfWork(ApplicationDbContext context, IProductRepository products)
    {
        _context = context;
        Products = products;
        Categories = new GenericRepository<Category>(context);
        ProductVariants = new GenericRepository<ProductVariant>(context);
        Users = new GenericRepository<User>(context);
        Customers = new GenericRepository<Customer>(context);
        Orders = new GenericRepository<Order>(context);
        OrderItems = new GenericRepository<OrderItem>(context);
        Coupons = new GenericRepository<Coupon>(context);
        Expenses = new GenericRepository<Expense>(context);
        StoreSettings = new GenericRepository<StoreSetting>(context);
        UserOtps = new GenericRepository<UserOtp>(context);
        SupportMessages = new GenericRepository<SupportMessage>(context);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task ExecuteSqlRawAsync(string sql, params object[] parameters)
    {
        await _context.Database.ExecuteSqlRawAsync(sql, parameters);
    }

    public async Task BeginTransactionAsync()
    {
        if (_currentTransaction != null)
        {
            return;
        }

        _currentTransaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync();
            }
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        try
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.RollbackAsync();
            }
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public async Task ExecuteInTransactionAsync(Func<Task> action)
    {
        var strategy = _context.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await action();
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        });
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _context.Dispose();
                _currentTransaction?.Dispose();
            }
            _disposed = true;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}
