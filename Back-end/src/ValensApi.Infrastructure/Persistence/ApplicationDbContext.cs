using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ValensApi.Domain.Common;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<StoreSetting> StoreSettings => Set<StoreSetting>();
    public DbSet<UserOtp> UserOtps => Set<UserOtp>();
    public DbSet<GovernorateShipping> GovernorateShippings => Set<GovernorateShipping>();
    public DbSet<OrderReturn> OrderReturns => Set<OrderReturn>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply soft delete query filter for all entities inheriting from SoftDeletableEntity
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(SoftDeletableEntity).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
                var body = System.Linq.Expressions.Expression.Equal(
                    System.Linq.Expressions.Expression.Property(parameter, nameof(SoftDeletableEntity.IsDeleted)),
                    System.Linq.Expressions.Expression.Constant(false)
                );
                var lambda = System.Linq.Expressions.Expression.Lambda(body, parameter);
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }

        // Configure all decimal properties to use decimal(18,2) to avoid truncation warnings
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetColumnType("decimal(18,2)");
        }

        // JSON serializer options and converter for List<string> (referenced in configurations)
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditAndSoftDeleteProperties();
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateAuditAndSoftDeleteProperties();
        return base.SaveChanges();
    }

    private void UpdateAuditAndSoftDeleteProperties()
    {
        var entries = ChangeTracker.Entries();
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.Entity is BaseEntity baseEntity)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        baseEntity.CreatedAt = now;
                        baseEntity.UpdatedAt = now;
                        break;

                    case EntityState.Modified:
                        baseEntity.UpdatedAt = now;
                        break;

                    case EntityState.Deleted:
                        if (entry.Entity is SoftDeletableEntity softDeletable)
                        {
                            entry.State = EntityState.Modified;
                            softDeletable.IsDeleted = true;
                            softDeletable.DeletedAt = now;
                            baseEntity.UpdatedAt = now;
                        }
                        break;
                }
            }
        }
    }
}
