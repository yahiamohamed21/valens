using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using ValensApi.Domain.Entities;

namespace ValensApi.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email).IsUnique();

        // Seed default administrator
        var adminId = new Guid("a7c4f4a9-83ff-410e-a4b5-90f772591605");
        builder.HasData(new User
        {
            Id = adminId,
            Email = "admin@valens.com",
            PasswordHash = "fP1pSgpCP7+bxl1QxkIqDZHmkJT1VaCCCescwC9lIyc2AQ5oYHbwYngiRV3thFIo", // pre-calculated hash of Admin@Valens123!
            FullName = "Valens Administrator",
            Role = "Admin",
            Phone = "01000000000",
            Address = "Valens Head Office, Cairo",
            City = "Cairo",
            CreatedAt = new DateTimeOffset(2026, 6, 27, 0, 0, 0, TimeSpan.Zero),
            UpdatedAt = new DateTimeOffset(2026, 6, 27, 0, 0, 0, TimeSpan.Zero)
        });
    }
}
