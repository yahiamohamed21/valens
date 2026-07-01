using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class HomeStoryConfiguration : IEntityTypeConfiguration<HomeStory>
{
    public void Configure(EntityTypeBuilder<HomeStory> builder)
    {
        builder.Property(s => s.Title).HasMaxLength(200);
        builder.Property(s => s.Description).HasMaxLength(500);
        builder.Property(s => s.Image).HasMaxLength(500);
        builder.Property(s => s.Link).HasMaxLength(500);
        builder.Property(s => s.AltText).HasMaxLength(200);

        builder.HasIndex(s => s.DisplayOrder);
        builder.HasIndex(s => s.IsActive);
    }
}
