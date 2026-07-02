using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class GovernorateShippingConfiguration : IEntityTypeConfiguration<GovernorateShipping>
{
    public void Configure(EntityTypeBuilder<GovernorateShipping> builder)
    {
        builder.HasIndex(g => g.GovernorateName).IsUnique();
        builder.Property(g => g.GovernorateName).IsRequired().HasMaxLength(100);
        builder.Property(g => g.ShippingCost).IsRequired().HasColumnType("decimal(18,2)");
    }
}
