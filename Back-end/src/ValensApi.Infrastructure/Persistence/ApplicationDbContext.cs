using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
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
                            // Intercept deletion and turn it into a soft delete update
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
