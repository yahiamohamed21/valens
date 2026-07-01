using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class HomeBannerConfiguration : IEntityTypeConfiguration<HomeBanner>
{
    public void Configure(EntityTypeBuilder<HomeBanner> builder)
    {
        builder.Property(b => b.Title).HasMaxLength(200);
        builder.Property(b => b.Subtitle).HasMaxLength(500);
        builder.Property(b => b.DesktopImage).HasMaxLength(500);
        builder.Property(b => b.MobileImage).HasMaxLength(500);
        builder.Property(b => b.CtaText).HasMaxLength(100);
        builder.Property(b => b.CtaLink).HasMaxLength(500);
        builder.Property(b => b.AltText).HasMaxLength(200);

        builder.HasIndex(b => b.DisplayOrder);
        builder.HasIndex(b => b.IsActive);
    }
}
