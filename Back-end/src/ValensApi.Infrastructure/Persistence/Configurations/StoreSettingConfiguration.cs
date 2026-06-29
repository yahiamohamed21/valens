using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class StoreSettingConfiguration : IEntityTypeConfiguration<StoreSetting>
{
    public void Configure(EntityTypeBuilder<StoreSetting> builder)
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

        builder.Property(s => s.HomepageSliderImages)
            .HasConversion(stringListConverter, stringListComparer);

        // Seed default store settings
        var storeSettingsId = new Guid("4673bb03-cb84-4824-a745-f09205ea6857");
        builder.HasData(new StoreSetting
        {
            Id = storeSettingsId,
            ShippingCost = 60,
            FreeShippingThreshold = 1500,
            ContactPhone = "+201000000000",
            ContactEmail = "support@valens.com",
            HomepageHeroTitle = "Premium Sports & Nutritional Supplements",
            HomepageHeroSubtitle = "Fuel your body with the highest quality formulations.",
            HomepageDiscountBannerText = "Get 10% off your first order! Use code: FIRST10",
            HeroImage = string.Empty,
            PromoBannerImage = string.Empty,
            HomepageSliderImages = new List<string>(),
            CreatedAt = new DateTimeOffset(2026, 6, 27, 0, 0, 0, TimeSpan.Zero),
            UpdatedAt = new DateTimeOffset(2026, 6, 27, 0, 0, 0, TimeSpan.Zero)
        });
    }
}
