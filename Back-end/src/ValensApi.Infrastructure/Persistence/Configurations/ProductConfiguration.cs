using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var stringListConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, options),
            v => string.IsNullOrWhiteSpace(v) ? new List<string>() : (JsonSerializer.Deserialize<List<string>>(v, options) ?? new List<string>())
        );

        var stringListComparer = new ValueComparer<List<string>>(
            (a, b) => a != null && b != null && a.SequenceEqual(b),
            c => c.Aggregate(0, (hash, s) => HashCode.Combine(hash, s.GetHashCode())),
            c => c.ToList()
        );

        builder.Property(p => p.Images)
            .HasConversion(stringListConverter, stringListComparer);

        builder.Property(p => p.Ingredients)
            .HasConversion(stringListConverter, stringListComparer);

        builder.Property(p => p.IngredientsAr)
            .HasConversion(stringListConverter, stringListComparer);

        builder.Property(p => p.Benefits)
            .HasConversion(stringListConverter, stringListComparer);

        builder.Property(p => p.BenefitsAr)
            .HasConversion(stringListConverter, stringListComparer);

        builder.HasMany(p => p.Variants)
            .WithOne(v => v.Product)
            .HasForeignKey(v => v.ProductId)
            .IsRequired(false)      
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Category)
            .WithMany()
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
