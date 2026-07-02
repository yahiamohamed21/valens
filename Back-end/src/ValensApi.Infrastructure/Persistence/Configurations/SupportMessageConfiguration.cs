using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class SupportMessageConfiguration : IEntityTypeConfiguration<SupportMessage>
{
    public void Configure(EntityTypeBuilder<SupportMessage> builder)
    {
        builder.Property(m => m.Name).HasMaxLength(200).IsRequired();
        builder.Property(m => m.Email).HasMaxLength(200).IsRequired();
        builder.Property(m => m.Phone).HasMaxLength(50).IsRequired();
        builder.Property(m => m.Message).HasMaxLength(2000).IsRequired();

        builder.HasIndex(m => m.CreatedAt);
    }
}
