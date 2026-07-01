using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class ProductReviewConfiguration : IEntityTypeConfiguration<ProductReview>
{
    public void Configure(EntityTypeBuilder<ProductReview> builder)
    {
        builder.HasKey(pr => pr.Id);
        
        builder.Property(pr => pr.CustomerName).IsRequired().HasMaxLength(150);
        builder.Property(pr => pr.CustomerEmail).IsRequired().HasMaxLength(256);
        builder.Property(pr => pr.Comment).IsRequired(false).HasMaxLength(2000);
        builder.Property(pr => pr.Rating).IsRequired();

        builder.HasOne(pr => pr.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(pr => pr.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
