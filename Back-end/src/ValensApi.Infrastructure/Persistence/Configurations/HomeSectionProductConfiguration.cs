using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class HomeSectionProductConfiguration : IEntityTypeConfiguration<HomeSectionProduct>
{
    public void Configure(EntityTypeBuilder<HomeSectionProduct> builder)
    {
        builder.Property(sp => sp.SectionKey).HasMaxLength(50).IsRequired();

        builder.HasOne(sp => sp.Product)
            .WithMany()
            .HasForeignKey(sp => sp.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes for performance
        builder.HasIndex(sp => sp.SectionKey);
        builder.HasIndex(sp => sp.DisplayOrder);
        builder.HasIndex(sp => sp.IsActive);
        builder.HasIndex(sp => sp.ProductId);

        // Unique constraint to prevent duplicate products in same section
        builder.HasIndex(sp => new { sp.SectionKey, sp.ProductId }).IsUnique();
    }
}
